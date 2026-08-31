import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminGuard, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(adminGuard);

// GET /api/admin/stats — dashboard KPIs
router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalTransactions,
      openDisputes,
      revenueAgg,
      todayDeals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'active' } }),
      prisma.transaction.count(),
      prisma.dispute.count({ where: { status: 'open' } }),
      prisma.transaction.aggregate({ _sum: { platformMargin: true } }),
      prisma.transaction.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalListings,
        activeListings,
        totalTransactions,
        openDisputes,
        totalRevenue: revenueAgg._sum.platformMargin || 0,
        todayDeals,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users — all users with search
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { q, role, banned, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q as string } },
        { email: { contains: q as string } },
        { alias: { contains: q as string } },
      ];
    }
    if (role) where.role = role;
    if (banned !== undefined) where.isBanned = banned === 'true';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          alias: true,
          role: true,
          repScore: true,
          dealCount: true,
          isBanned: true,
          createdAt: true,
          _count: { select: { listings: true, buyerTxns: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/admin/users/:id/ban — ban or unban user
router.post('/users/:id/ban', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ban = true } = req.body;

    const user = await prisma.user.findUnique({ where: { id: (req.params.id as string) } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role === 'admin') {
      res.status(400).json({ error: 'Cannot ban an admin user' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: (req.params.id as string) },
      data: { isBanned: ban },
      select: { id: true, name: true, email: true, isBanned: true },
    });

    res.json({ user: updated, message: ban ? 'User banned' : 'User unbanned' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to update user ban status' });
  }
});

// GET /api/admin/listings — all listings
router.get('/listings', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, q, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { title: { contains: q as string } },
        { description: { contains: q as string } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { id: true, alias: true, email: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ listings, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    console.error('Admin get listings error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// PATCH /api/admin/listings/:id — approve, remove
router.patch('/listings/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'removed', 'sold', 'expired'];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const updated = await prisma.listing.update({
      where: { id: (req.params.id as string) },
      data: { status },
    });

    res.json({ listing: updated });
  } catch (error) {
    console.error('Admin update listing error:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// GET /api/admin/disputes — all disputes
router.get('/disputes', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status) where.status = status;

    const [disputes, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, alias: true, email: true } },
          thread: {
            include: {
              listing: { select: { id: true, title: true } },
              buyer: { select: { id: true, alias: true } },
              seller: { select: { id: true, alias: true } },
            },
          },
        },
      }),
      prisma.dispute.count({ where }),
    ]);

    res.json({ disputes, pagination: { page: pageNum, limit: limitNum, total } });
  } catch (error) {
    console.error('Admin get disputes error:', error);
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

// PATCH /api/admin/disputes/:id — resolve or dismiss
router.patch('/disputes/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['resolved', 'dismissed'].includes(status)) {
      res.status(400).json({ error: 'Status must be resolved or dismissed' });
      return;
    }

    const updated = await prisma.dispute.update({
      where: { id: (req.params.id as string) },
      data: { status },
    });

    res.json({ dispute: updated });
  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({ error: 'Failed to update dispute' });
  }
});

// GET /api/admin/transactions — revenue and margins
router.get('/transactions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    const [transactions, total, totals] = await Promise.all([
      prisma.transaction.findMany({
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          listing: { select: { id: true, title: true, type: true } },
          buyer: { select: { id: true, alias: true } },
          seller: { select: { id: true, alias: true } },
        },
      }),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        _sum: { amount: true, platformMargin: true },
        _avg: { amount: true },
      }),
    ]);

    res.json({
      transactions,
      pagination: { page: pageNum, limit: limitNum, total },
      totals: {
        totalRevenue: totals._sum.amount || 0,
        totalMargins: totals._sum.platformMargin || 0,
        avgDealSize: totals._avg.amount || 0,
      },
    });
  } catch (error) {
    console.error('Admin get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
