import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

const MUJ_EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@(muj\.edu\.in|jaipur\.manipal\.edu)$/;

// Generate a random campus-style alias
function generateAlias(): string {
  const adjectives = ['Silent', 'Swift', 'Clever', 'Bold', 'Bright', 'Cool', 'Calm', 'Sharp'];
  const nouns = ['Fox', 'Owl', 'Bear', 'Wolf', 'Eagle', 'Tiger', 'Panda', 'Hawk'];
  const num = Math.floor(Math.random() * 999) + 1;
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${num}`;
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    // Enforce MUJ email (Disabled by user request)
    // if (!MUJ_EMAIL_REGEX.test(email)) {
    //   res.status(400).json({ error: 'Only @muj.edu.in email addresses are allowed' });
    //   return;
    // }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique alias
    let alias = generateAlias();
    let aliasExists = await prisma.user.findUnique({ where: { alias } });
    while (aliasExists) {
      alias = generateAlias();
      aliasExists = await prisma.user.findUnique({ where: { alias } });
    }

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, alias, role: 'student' },
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role, alias: user.alias });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        alias: user.alias,
        role: user.role,
        repScore: user.repScore,
        dealCount: user.dealCount,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({ error: 'Your account has been suspended. Contact admin.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, alias: user.alias });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        alias: user.alias,
        role: user.role,
        repScore: user.repScore,
        dealCount: user.dealCount,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name = 'Student' } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email is required from Google account' });
      return;
    }

    // Enforce MUJ email policy (Disabled by user request)
    // if (!MUJ_EMAIL_REGEX.test(email)) {
    //   res.status(400).json({ error: 'Only @muj.edu.in email addresses are allowed' });
    //   return;
    // }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    // If not, create them
    if (!user) {
      // Generate unique alias
      let alias = generateAlias();
      let aliasExists = await prisma.user.findUnique({ where: { alias } });
      while (aliasExists) {
        alias = generateAlias();
        aliasExists = await prisma.user.findUnique({ where: { alias } });
      }

      // We use a dummy random password for OAuth users
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);
      
      user = await prisma.user.create({
        data: { name, email, password: randomPassword, alias, role: 'student' },
      });
    }

    if (user.isBanned) {
      res.status(403).json({ error: 'Your account has been suspended. Contact admin.' });
      return;
    }

    // Generate our own JWT token
    const token = generateToken({ id: user.id, email: user.email, role: user.role, alias: user.alias });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        alias: user.alias,
        role: user.role,
        repScore: user.repScore,
        dealCount: user.dealCount,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        alias: true,
        upiId: true,
        phone: true,
        role: true,
        repScore: true,
        dealCount: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            listings: true,
            buyerTxns: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/auth/me
router.put('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { upiId, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { upiId, phone },
      select: {
        id: true,
        name: true,
        email: true,
        alias: true,
        upiId: true,
        phone: true,
        role: true,
        repScore: true,
        dealCount: true,
      }
    });
    res.json({ user });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;
