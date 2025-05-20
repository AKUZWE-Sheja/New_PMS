import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Kick things off with a Prisma client to talk to the DB
const prisma = new PrismaClient();

// Extend the Request type to include user info (ID and role)
interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const getOutgoingCars = async (req: AuthRequest, res: Response): Promise<void> => {
  const { from, to } = req.query;
  const fromDate = from ? new Date(from as string) : new Date(Date.now() - 24 * 60 * 60 * 1000);
  const toDate = to ? new Date(to as string) : new Date();

  try {
    const requests = await prisma.slotRequest.findMany({
      where: {
        requestStatus: 'approved',
        endTime: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        vehicle: true,
        slot: true,
      },
      orderBy: { endTime: 'desc' },
    });

    // Optionally, sum cost per car
    // Or just return the requests as is
    res.json({ data: requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch outgoing cars' });
  }
};