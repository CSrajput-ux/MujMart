import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Create a new project request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { listingId } = req.body;
    const requesterId = req.user!.id;

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (listing.sellerId === requesterId) {
      return res.status(400).json({ error: "Cannot request your own project" });
    }

    // Check if request already exists
    const existing = await prisma.projectRequest.findFirst({
      where: { listingId, requesterId }
    });

    if (existing) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const request = await prisma.projectRequest.create({
      data: {
        listingId,
        requesterId,
        ownerId: listing.sellerId,
        status: "pending"
      }
    });

    // Create a notification for the owner
    await prisma.notification.create({
      data: {
        userId: listing.sellerId,
        type: "PROJECT_REQUEST",
        content: `${req.user!.name || 'Someone'} requested access to your project: ${listing.title}`,
        relatedId: request.id
      }
    });

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get incoming requests
router.get("/incoming", authMiddleware, async (req, res) => {
  try {
    const requests = await prisma.projectRequest.findMany({
      where: { ownerId: req.user!.id },
      include: {
        listing: true,
        requester: {
          select: { id: true, name: true, alias: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Accept or Reject request
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "accepted" | "rejected"
    const ownerId = req.user!.id;

    const request = await prisma.projectRequest.findUnique({ where: { id }, include: { listing: true } });
    if (!request) return res.status(404).json({ error: "Request not found" });
    if (request.ownerId !== ownerId) return res.status(403).json({ error: "Unauthorized" });

    const updated = await prisma.projectRequest.update({
      where: { id },
      data: { status }
    });

    // Notify the requester
    await prisma.notification.create({
      data: {
        userId: request.requesterId,
        type: "REQUEST_ACCEPTED",
        content: `Your request for ${request.listing.title} was ${status}.`,
        relatedId: request.id
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
