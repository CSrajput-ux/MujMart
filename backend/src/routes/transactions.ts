import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const PLATFORM_MARGIN_RATE = 0.05; // 5%

// Helper for admin check
const requireAdmin = (req: AuthRequest, res: Response, next: Function) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// POST /api/transactions/checkout — Initiate a deal
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId, agreedPrice } = req.body;

    if (!listingId) {
      res.status(400).json({ error: 'listingId is required' });
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (listing.sellerId === req.user!.id) {
      res.status(400).json({ error: 'You cannot buy your own listing' });
      return;
    }

    if (listing.status !== 'active') {
      res.status(400).json({ error: 'Listing is no longer active' });
      return;
    }

    const finalAmount = agreedPrice !== undefined ? parseFloat(agreedPrice) : listing.price;
    const platformMargin = finalAmount * PLATFORM_MARGIN_RATE;

    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        buyerId: req.user!.id,
        sellerId: listing.sellerId,
        amount: finalAmount,
        platformMargin,
        status: 'pending_payment',
      },
    });

    // Mark listing as sold so others can't buy it simultaneously
    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'sold' },
    });

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to initiate checkout' });
  }
});

// POST /api/transactions/:id/submit-utr — Buyer submits UTR
router.post('/:id/submit-utr', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { utrNumber } = req.body;

    if (!utrNumber || utrNumber.length < 6) {
      res.status(400).json({ error: 'Valid UTR number is required' });
      return;
    }

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.buyerId !== req.user!.id) {
      res.status(404).json({ error: 'Transaction not found or unauthorized' });
      return;
    }

    if (transaction.status !== 'pending_payment') {
      res.status(400).json({ error: 'Transaction is not awaiting payment' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { utrNumber, status: 'verifying_payment' },
    });

    res.json({ transaction: updated });
  } catch (error) {
    console.error('Submit UTR error:', error);
    res.status(500).json({ error: 'Failed to submit UTR' });
  }
});

// POST /api/transactions/:id/verify-payment — Admin verifies UTR
router.post('/:id/verify-payment', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    
    if (!transaction || transaction.status !== 'verifying_payment') {
      res.status(400).json({ error: 'Invalid transaction state' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: 'escrow' },
    });

    res.json({ transaction: updated });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// POST /api/transactions/:id/confirm-receipt — Buyer confirms item received
router.post('/:id/confirm-receipt', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    
    if (!transaction || transaction.buyerId !== req.user!.id) {
      res.status(404).json({ error: 'Transaction not found or unauthorized' });
      return;
    }

    if (transaction.status !== 'escrow') {
      res.status(400).json({ error: 'Transaction is not in escrow' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: 'ready_for_payout' },
    });

    res.json({ transaction: updated });
  } catch (error) {
    console.error('Confirm receipt error:', error);
    res.status(500).json({ error: 'Failed to confirm receipt' });
  }
});

// POST /api/transactions/:id/complete-payout — Admin sends money to seller
router.post('/:id/complete-payout', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    
    if (!transaction || transaction.status !== 'ready_for_payout') {
      res.status(400).json({ error: 'Transaction is not ready for payout' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: 'completed' },
    });

    // Increment deal counts for buyer and seller
    await Promise.all([
      prisma.user.update({ where: { id: transaction.sellerId }, data: { dealCount: { increment: 1 } } }),
      prisma.user.update({ where: { id: transaction.buyerId }, data: { dealCount: { increment: 1 } } }),
    ]);

    res.json({ transaction: updated });
  } catch (error) {
    console.error('Complete payout error:', error);
    res.status(500).json({ error: 'Failed to complete payout' });
  }
});

// GET /api/transactions — user's transaction history (or all for admin)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role = 'all', status } = req.query;

    let where: any = {};
    
    if (req.user!.role === 'admin') {
      // Admin sees everything if role is not specified
      if (status) where.status = status;
    } else {
      // Normal user sees their own
      where = {
        OR: [{ buyerId: req.user!.id }, { sellerId: req.user!.id }],
      };
      if (role === 'buyer') where = { buyerId: req.user!.id };
      if (role === 'seller') where = { sellerId: req.user!.id };
      if (status) where.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        listing: { select: { id: true, title: true, type: true, images: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true, upiId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      transactions: transactions.map((t) => ({
        ...t,
        myRole: req.user!.role === 'admin' ? 'admin' : (t.buyerId === req.user!.id ? 'buyer' : 'seller'),
        sellerAmount: t.amount - t.platformMargin,
      })),
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
