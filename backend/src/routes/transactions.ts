import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const PLATFORM_MARGIN_RATE = 0.05; // 5%

// Admin UPI details (set in .env or hardcoded here)
const ADMIN_UPI_ID = process.env.ADMIN_UPI_ID || '7579958087@axl';
const ADMIN_UPI_QR_URL = process.env.ADMIN_UPI_QR_URL || '/qr.jpeg';

// Helper for admin check
const requireAdmin = (req: AuthRequest, res: Response, next: Function) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// POST /api/transactions/checkout — Initiate a deal (UPI manual flow)
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId, agreedPrice } = req.body;

    if (!listingId) {
      res.status(400).json({ error: 'listingId is required' });
      return;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: { select: { id: true, alias: true } },
      },
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
      include: {
        listing: { select: { id: true, title: true, type: true, images: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true } },
      },
    });

    // Return transaction + admin UPI details so buyer can pay
    res.status(201).json({
      transaction,
      upiDetails: {
        upiId: ADMIN_UPI_ID,
        qrUrl: ADMIN_UPI_QR_URL,
        amount: finalAmount,
        note: `MujMart-${transaction.id.slice(0, 8)}`,
      },
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to initiate checkout' });
  }
});

// POST /api/transactions/:id/submit-upi-payment
// Buyer submits: screenshot URL + UTR/Transaction ID
router.post('/:id/submit-upi-payment', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { utrNumber, paymentScreenshotUrl } = req.body;

    if (!utrNumber || !paymentScreenshotUrl) {
      res.status(400).json({ error: 'Transaction ID (UTR) and payment screenshot are required' });
      return;
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true, type: true, images: true, category: true, condition: true, price: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true } },
      },
    });

    if (!transaction || transaction.buyerId !== req.user!.id) {
      res.status(404).json({ error: 'Transaction not found or unauthorized' });
      return;
    }

    if (transaction.status !== 'pending_payment') {
      res.status(400).json({ error: 'Payment already submitted or transaction is not awaiting payment' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        utrNumber,
        paymentScreenshotUrl,
        status: 'verifying_payment',
      },
      include: {
        listing: { select: { id: true, title: true, type: true, images: true, category: true, condition: true, price: true } },
        buyer: { select: { id: true, alias: true } },
        seller: { select: { id: true, alias: true } },
      },
    });

    // Notify admin about new payment to verify
    const admins = await prisma.user.findMany({ where: { role: 'admin' } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'PAYMENT_SUBMITTED',
          content: `Payment submitted by ${req.user!.alias} for "${transaction.listing?.title}" — UTR: ${utrNumber}. Please verify the screenshot and approve.`,
          relatedId: id,
        },
      });
    }

    res.json({ transaction: updated, message: 'Payment submitted for verification. Admin will verify within 24 hours.' });
  } catch (error) {
    console.error('Submit UPI payment error:', error);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
});

// POST /api/transactions/:id/verify-payment — Admin verifies manual UPI payment
router.post('/:id/verify-payment', authMiddleware, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    if (transaction.status !== 'verifying_payment') {
      res.status(400).json({ error: 'Transaction is not pending verification' });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: 'escrow' },
    });

    // Mark listing as sold
    await prisma.listing.update({
      where: { id: transaction.listingId },
      data: { status: 'sold' },
    });

    // Notify the buyer that payment is confirmed
    await prisma.notification.create({
      data: {
        userId: transaction.buyerId,
        type: 'PAYMENT_VERIFIED',
        content: `Your payment has been verified! ✅ Your order is now secured. We will deliver the item shortly.`,
        relatedId: id,
      },
    });

    res.json({ transaction: updated, message: 'Payment verified successfully. Listing marked as sold.' });
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
      // Admin sees everything
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
        listing: { select: { id: true, title: true, type: true, images: true, category: true, condition: true } },
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

// GET /api/transactions/upi-details — returns admin UPI for payment
router.get('/upi-details', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    upiId: ADMIN_UPI_ID,
    qrUrl: ADMIN_UPI_QR_URL,
  });
});

export default router;
