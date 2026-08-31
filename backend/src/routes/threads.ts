import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/threads — start a negotiation thread
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId } = req.body;

    if (!listingId) {
      res.status(400).json({ error: 'listingId is required' });
      return;
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (listing.status !== 'active') {
      res.status(400).json({ error: 'This listing is no longer available' });
      return;
    }

    if (listing.sellerId === req.user!.id) {
      res.status(400).json({ error: 'You cannot negotiate on your own listing' });
      return;
    }

    // Check if thread already exists for this buyer+listing
    const existingThread = await prisma.thread.findFirst({
      where: { listingId, buyerId: req.user!.id },
    });

    if (existingThread) {
      res.json({ thread: existingThread, existing: true });
      return;
    }

    const thread = await prisma.thread.create({
      data: {
        listingId,
        buyerId: req.user!.id,
        sellerId: listing.sellerId,
      },
      include: {
        listing: { select: { id: true, title: true, price: true, type: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true } },
      },
    });

    res.status(201).json({ thread });
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// GET /api/threads — get user's threads
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const threads = await prisma.thread.findMany({
      where: {
        OR: [{ buyerId: req.user!.id }, { sellerId: req.user!.id }],
      },
      include: {
        listing: { select: { id: true, title: true, price: true, type: true, images: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // last message preview
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add perspective (am I buyer or seller?)
    const threadsWithRole = threads.map((t) => ({
      ...t,
      myRole: t.buyerId === req.user!.id ? 'buyer' : 'seller',
    }));

    res.json({ threads: threadsWithRole });
  } catch (error) {
    console.error('Get threads error:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// GET /api/threads/:threadId — single thread details
router.get('/:threadId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: (req.params.threadId as string) },
      include: {
        listing: { select: { id: true, title: true, price: true, type: true, images: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true } },
      },
    });

    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    // Only participants can view
    if (thread.buyerId !== req.user!.id && thread.sellerId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const myRole = thread.buyerId === req.user!.id ? 'buyer' : 'seller';

    res.json({ thread: { ...thread, myRole } });
  } catch (error) {
    console.error('Get thread error:', error);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// GET /api/threads/:threadId/messages — load message history
router.get('/:threadId/messages', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const thread = await prisma.thread.findUnique({ where: { id: (req.params.threadId as string) } });

    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    if (thread.buyerId !== req.user!.id && thread.sellerId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: { threadId: (req.params.threadId as string) },
      include: {
        sender: { select: { id: true, alias: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Anonymize: map sender to role
    const anonymized = messages.map((m) => ({
      id: m.id,
      content: m.content,
      isFiltered: m.isFiltered,
      createdAt: m.createdAt,
      role: m.senderId === thread.buyerId ? 'buyer' : 'seller',
      isMe: m.senderId === req.user!.id,
    }));

    res.json({ messages: anonymized });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/threads/:threadId/status — accept/reject deal
router.patch('/:threadId/status', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['accepted', 'closed', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be accepted, closed, or rejected' });
      return;
    }

    const thread = await prisma.thread.findUnique({ where: { id: (req.params.threadId as string) } });

    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    if (thread.buyerId !== req.user!.id && thread.sellerId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Only seller can accept/reject
    if ((status === 'accepted' || status === 'rejected') && thread.sellerId !== req.user!.id) {
      res.status(403).json({ error: 'Only the seller can accept or reject deals' });
      return;
    }

    const updated = await prisma.thread.update({
      where: { id: (req.params.threadId as string) },
      data: { status },
    });

    // If accepted, update listing status
    if (status === 'accepted') {
      await prisma.listing.update({
        where: { id: thread.listingId },
        data: { status: 'sold' },
      });
    }

    res.json({ thread: updated });
  } catch (error) {
    console.error('Update thread status error:', error);
    res.status(500).json({ error: 'Failed to update thread status' });
  }
});

export default router;
