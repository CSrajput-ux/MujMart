import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // in paise
      currency: "INR",
      receipt: transaction.id,
    });

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transaction.id },
      data: { razorpayOrderId: order.id },
    });

    // Mark listing as sold so others can't buy it simultaneously
    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'sold' },
    });

    res.status(201).json({ transaction: updatedTransaction });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to initiate checkout' });
  }
});

// POST /api/transactions/:id/verify-razorpay — Buyer submits Razorpay payment signature
router.post('/:id/verify-razorpay', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ error: 'Missing payment details' });
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

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      const updated = await prisma.transaction.update({
        where: { id },
        data: { 
          status: 'escrow',
          razorpayPaymentId: razorpay_payment_id 
        },
      });
      res.json({ transaction: updated });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Verify razorpay error:', error);
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
