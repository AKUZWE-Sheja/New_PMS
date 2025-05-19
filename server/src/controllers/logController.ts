import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = '1', limit = '10', search = '' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  const searchQuery = search as string;

  try {
    const where = {
      OR: [
        { action: { contains: searchQuery, mode: 'insensitive' as const } },
        // Only add userId filter if search is a valid number
        ...(isNaN(Number(searchQuery)) ? [] : [{ userId: Number(searchQuery) }]),
      ],
    };

    const [logs, totalItems] = await Promise.all([
      prisma.log.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { id: 'asc' },
      }),
      prisma.log.count({ where }),
    ]);

    res.json({
      data: logs,
      meta: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};