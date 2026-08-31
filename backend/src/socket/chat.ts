import { Server as SocketIOServer, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { containsBlockedContent, sanitizeMessage } from '../middleware/contentFilter';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'mujmart_dev_secret';

interface AuthSocket extends Socket {
  userId?: string;
  userAlias?: string;
  userRole?: string;
}

// Anonymous animal pairs for buyer/seller
const BUYER_ANIMALS = ['🐻 Bear', '🐼 Panda', '🦊 Fox', '🐺 Wolf', '🦁 Lion', '🐯 Tiger', '🐨 Koala', '🦝 Raccoon'];
const SELLER_ANIMALS = ['🦅 Eagle', '🦉 Owl', '🦜 Parrot', '🐦 Falcon', '🦚 Peacock', '🦋 Butterfly', '🦎 Gecko', '🐉 Dragon'];

function getAnonymousAlias(role: 'buyer' | 'seller'): string {
  const list = role === 'buyer' ? BUYER_ANIMALS : SELLER_ANIMALS;
  return list[Math.floor(Math.random() * list.length)];
}

export function initSocket(io: SocketIOServer): void {
  // Auth middleware for socket
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        alias: string;
        role: string;
      };
      socket.userId = decoded.id;
      socket.userAlias = decoded.alias;
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`Socket connected: ${socket.userId} (${socket.userAlias})`);

    // Join a chat room (thread)
    socket.on('join_thread', async (threadId: string) => {
      try {
        const thread = await prisma.thread.findUnique({
          where: { id: threadId },
        });

        if (!thread) {
          socket.emit('error', { message: 'Thread not found' });
          return;
        }

        // Verify user is a participant
        if (thread.buyerId !== socket.userId && thread.sellerId !== socket.userId) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.join(threadId);

        const myRole = thread.buyerId === socket.userId ? 'buyer' : 'seller';
        const anonymousAlias = getAnonymousAlias(myRole);

        socket.emit('joined_thread', {
          threadId,
          myRole,
          myAnonymousAlias: anonymousAlias,
          threadStatus: thread.status,
        });

        console.log(`${socket.userId} joined thread ${threadId} as ${myRole}`);
      } catch (error) {
        console.error('Join thread error:', error);
        socket.emit('error', { message: 'Failed to join thread' });
      }
    });

    // Send a message
    socket.on('send_message', async (data: { threadId: string; content: string; senderAlias: string }) => {
      try {
        const { threadId, content, senderAlias } = data;

        if (!content?.trim()) return;

        const thread = await prisma.thread.findUnique({ where: { id: threadId } });

        if (!thread) {
          socket.emit('error', { message: 'Thread not found' });
          return;
        }

        if (thread.buyerId !== socket.userId && thread.sellerId !== socket.userId) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        if (thread.status === 'closed' || thread.status === 'rejected') {
          socket.emit('error', { message: 'This conversation is closed' });
          return;
        }

        // Content filtering
        const isBlocked = containsBlockedContent(content);
        const sanitized = isBlocked ? sanitizeMessage(content) : content;

        const message = await prisma.message.create({
          data: {
            threadId,
            senderId: socket.userId!,
            content: sanitized,
            isFiltered: isBlocked,
          },
        });

        const myRole = thread.buyerId === socket.userId ? 'buyer' : 'seller';

        const messagePayload = {
          id: message.id,
          content: sanitized,
          isFiltered: isBlocked,
          createdAt: message.createdAt,
          role: myRole,
          senderAlias: senderAlias || `${myRole} anonymous`,
          threadId,
        };

        // Broadcast to everyone in the room
        io.to(threadId).emit('new_message', messagePayload);

        if (isBlocked) {
          socket.emit('message_filtered', {
            message: '⚠️ Your message contained external contact info and was filtered. Keep negotiations on MUJMart!',
          });
        }
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { threadId: string; isTyping: boolean; role: string }) => {
      socket.to(data.threadId).emit('user_typing', {
        role: data.role,
        isTyping: data.isTyping,
      });
    });

    // Deal status update
    socket.on('deal_update', async (data: { threadId: string; status: 'accepted' | 'rejected' }) => {
      try {
        const thread = await prisma.thread.findUnique({ where: { id: data.threadId } });

        if (!thread || thread.sellerId !== socket.userId) {
          socket.emit('error', { message: 'Only the seller can update deal status' });
          return;
        }

        await prisma.thread.update({
          where: { id: data.threadId },
          data: { status: data.status },
        });

        if (data.status === 'accepted') {
          await prisma.listing.update({
            where: { id: thread.listingId },
            data: { status: 'sold' },
          });
        }

        io.to(data.threadId).emit('deal_status_changed', {
          threadId: data.threadId,
          status: data.status,
        });
      } catch (error) {
        console.error('Deal update error:', error);
        socket.emit('error', { message: 'Failed to update deal' });
      }
    });

    socket.on('leave_thread', (threadId: string) => {
      socket.leave(threadId);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });
}
