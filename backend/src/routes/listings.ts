import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

const PLATFORM_MARGIN_RATE = 0.05; // 5%

// Helper to parse JSON arrays safely
function parseJsonArray(jsonString: string): string[] {
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
}

// GET /api/listings — public, with filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      q,
      type,
      category,
      condition,
      minPrice,
      maxPrice,
      sort = 'recent',
      page = '1',
      limit = '20',
      seller,
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = Math.min(parseInt(limit as string, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: 'active',
    };

    if (q) {
      where.OR = [
        { title: { contains: q as string } },
        { description: { contains: q as string } },
      ];
    }
    if (type) where.type = type;
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (seller) where.sellerId = seller;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    // Build orderBy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          seller: {
            select: { id: true, alias: true, repScore: true, dealCount: true },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      listings: listings.map((l) => ({
        ...l,
        images: parseJsonArray(l.images),
        attachments: parseJsonArray(l.attachments),
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET /api/listings/:id — public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: (req.params.id as string) },
      include: {
        seller: {
          select: {
            id: true,
            alias: true,
            repScore: true,
            dealCount: true,
            createdAt: true,
            _count: { select: { listings: true } },
          },
        },
      },
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    let isAuthorized = true;
    if (listing.type === 'query') {
      isAuthorized = false;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string, role: string };
          
          if (decoded.id === listing.sellerId || decoded.role === 'admin') {
            isAuthorized = true;
          } else {
            const isHired = await prisma.projectRequest.findFirst({
              where: { listingId: listing.id, requesterId: decoded.id, status: 'accepted' }
            });
            if (isHired) isAuthorized = true;
          }
        } catch (e) {
          // ignore invalid token
        }
      }
    }

    const finalAttachments = isAuthorized ? parseJsonArray(listing.attachments) : [];

    res.json({
      listing: {
        ...listing,
        images: parseJsonArray(listing.images),
        attachments: finalAttachments,
        platformFee: listing.price * PLATFORM_MARGIN_RATE,
        isAuthorized
      },
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// POST /api/listings — auth required
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, price, type, category, condition, images, attachments, deadline } = req.body;

    if (!title || !description || !type || !category || !condition) {
      res.status(400).json({ error: 'Title, description, type, category, and condition are required' });
      return;
    }

    const validTypes = ['sell', 'resale', 'rent', 'free', 'query'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: 'Invalid listing type' });
      return;
    }

    const finalPrice = type === 'free' ? 0 : (parseFloat(price) || 0);

    if (type === 'query' || category === 'Projects & Assignments') {
      if (finalPrice < 50) {
        res.status(400).json({ error: 'Minimum rate for projects, assignments, and queries is ₹50' });
        return;
      }
    }

    // Listings expire in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: finalPrice,
        type,
        category,
        condition,
        images: JSON.stringify(images || []),
        attachments: JSON.stringify(attachments || []),
        deadline: deadline ? new Date(deadline) : null,
        sellerId: req.user!.id,
        expiresAt,
      },
      include: {
        seller: { select: { id: true, alias: true, repScore: true, dealCount: true } },
      },
    });

    res.status(201).json({
      listing: { ...listing, images: parseJsonArray(listing.images), attachments: parseJsonArray(listing.attachments) },
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// PUT /api/listings/:id — owner only
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: (req.params.id as string) } });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (listing.sellerId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'You can only edit your own listings' });
      return;
    }

    const { title, description, price, category, condition, images, attachments, status, deadline } = req.body;

    const updated = await prisma.listing.update({
      where: { id: (req.params.id as string) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(condition && { condition }),
        ...(images && { images: JSON.stringify(images) }),
        ...(attachments && { attachments: JSON.stringify(attachments) }),
        ...(status && { status }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
      include: {
        seller: { select: { id: true, alias: true, repScore: true, dealCount: true } },
      },
    });

    res.json({ listing: { ...updated, images: parseJsonArray(updated.images), attachments: parseJsonArray(updated.attachments) } });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE /api/listings/:id — owner or admin
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await prisma.listing.findUnique({ where: { id: (req.params.id as string) } });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (listing.sellerId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'You can only delete your own listings' });
      return;
    }

    // Soft delete - just mark as removed
    await prisma.listing.update({
      where: { id: (req.params.id as string) },
      data: { status: 'removed' },
    });

    // Clean up image files if stored locally
    const images = parseJsonArray(listing.images);
    for (const img of images) {
      if (img.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '../../uploads', path.basename(img));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// POST /api/listings/upload-image — upload image
router.post('/upload-image', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  // Image upload handled by multer in main index.ts
  res.json({ url: '/placeholder-image.png' });
});

export default router;
