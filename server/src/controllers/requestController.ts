import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { ParkingCostCalculator } from '../utils/parkingCostCalculator';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/email';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

// Create a slot request
export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { vehicleId, startTime, endTime } = req.body;

  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized: user ID missing' });
    return;
  }

  try {
    const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, userId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    // Validate startTime and endTime
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Invalid startTime or endTime' });
      return;
    }

    // Calculate cost
    const cost = ParkingCostCalculator.calculateCost(start, end);

    const request = await prisma.slotRequest.create({
      data: {
        userId,
        vehicleId,
        startTime: start,
        endTime: end,
        cost,
        requestStatus: 'pending',
      },
    });

    await prisma.log.create({
      data: { userId, action: `Slot request ${request.id} created for vehicle ${vehicle.plateNumber}` },
    });

    res.status(201).json({ data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

// Get slot requests
export const getRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  const { page = '1', limit = '10', search = '' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  const searchQuery = search as string;

  try {
    // Explicitly type the where clause with Prisma namespace
    const where: Prisma.SlotRequestWhereInput = isAdmin
      ? {
          OR: [
            {
              vehicle: {
                plateNumber: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            {
              slot: {
                is: {
                  slotNumber: { contains: searchQuery, mode: 'insensitive' },
                },
              },
            },
          ],
        }
      : {
          userId,
          OR: [
            {
              vehicle: {
                plateNumber: { contains: searchQuery, mode: 'insensitive' },
              },
            },
            {
              slot: {
                is: {
                  slotNumber: { contains: searchQuery, mode: 'insensitive' },
                },
              },
            },
          ],
        };

    const [requests, totalItems] = await Promise.all([
      prisma.slotRequest.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { id: 'asc' },
        include: {
          vehicle: {
            select: { plateNumber: true, vehicleType: true, size: true },
          },
          user: {
            select: { email: true },
          },
          slot: {
            select: { slotNumber: true, status: true },
          },
        },
      }),
      prisma.slotRequest.count({ where }),
    ]);

    await prisma.log.create({
      data: { userId, action: 'Slot requests list viewed' },
    });

    res.json({
      data: requests,
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

// Update a slot request
export const updateRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { vehicleId, startTime, endTime } = req.body;

  try {
    const request = await prisma.slotRequest.findFirst({
      where: { id: parseInt(id, 10), userId, requestStatus: 'pending' },
    });
    if (!request) {
      res.status(404).json({ error: 'Request not found or not editable' });
      return;
    }

    const vehicle = await prisma.vehicle.findFirst({ where: { id: vehicleId, userId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    // Validate and calculate cost if startTime or endTime provided
    let cost = request.cost;
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        res.status(400).json({ error: 'Invalid startTime or endTime' });
        return;
      }
      cost = ParkingCostCalculator.calculateCost(start, end);
    }

    const updatedRequest = await prisma.slotRequest.update({
      where: { id: parseInt(id, 10) },
      data: {
        vehicleId,
        startTime: startTime ? new Date(startTime) : request.startTime,
        endTime: endTime ? new Date(endTime) : request.endTime,
        cost,
      },
    });

    await prisma.log.create({
      data: { userId, action: `Slot request ${id} updated` },
    });

    res.json({ data: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

// Delete a slot request
export const deleteRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  try {
    const request = await prisma.slotRequest.findFirst({
      where: { id: parseInt(id, 10), userId, requestStatus: 'pending' },
    });
    if (!request) {
      res.status(404).json({ error: 'Request not/samples/43c28b1d-4e9d-48ea-8be1-fcd42fc1ca4e/2b3e4a7d-9f8c-4b2a-9e1d-6c8f7d4b3e2a/requestController.ts found or not deletable' });
      return;
    }

    await prisma.slotRequest.delete({ where: { id: parseInt(id, 10) } });
    await prisma.log.create({
      data: { userId, action: `Slot request ${id} deleted` },
    });

    res.json({ data: { message: 'Request deleted' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve a slot request
export const approveRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Unauthorized: Admin access required' });
    return;
  }

  try {
    const request = await prisma.slotRequest.findFirst({
      where: { id: parseInt(id, 10), requestStatus: 'pending' },
      include: { vehicle: true, user: true },
    });
    if (!request) {
      res.status(404).json({ error: 'Request not found or already processed' });
      return;
    }

    const slot = await prisma.parkingSlot.findFirst({
      where: {
        status: 'available',
        vehicleType: request.vehicle.vehicleType,
        size: request.vehicle.size,
      },
    });
    if (!slot) {
      res.status(400).json({ error: 'No compatible slots available' });
      return;
    }

    const updatedRequest = await prisma.slotRequest.update({
      where: { id: parseInt(id, 10) },
      data: {
        requestStatus: 'approved',
        slotId: slot.id,
        slotNumber: slot.slotNumber,
        approvedAt: new Date(),
      },
      include: {
        user: { select: { email: true } },
        vehicle: { select: { plateNumber: true } },
        slot: { select: { slotNumber: true } },
      },
    });

    await prisma.parkingSlot.update({
      where: { id: slot.id },
      data: { status: 'occupied' },
    });

    if (updatedRequest.user?.email) {
      const emailStatus = await sendApprovalEmail(
        updatedRequest.user.email,
        updatedRequest.slotNumber!,
        updatedRequest.vehicle.plateNumber,
        updatedRequest.startTime,
        updatedRequest.endTime,
        updatedRequest.cost!
      );
      if (emailStatus === 'failed') {
        console.error(`Failed to send approval email for request ${id}`);
        await prisma.log.create({
          data: { userId, action: `Failed to send approval email for request ${id}` },
        });
      }
    }

    await prisma.log.create({
      data: { userId, action: `Slot request ${id} approved for slot ${slot.slotNumber}` },
    });

    res.json({ data: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reject a slot request
export const rejectRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { reason } = req.body;

  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Unauthorized: Admin access required' });
    return;
  }

  try {
    const request = await prisma.slotRequest.findFirst({
      where: { id: parseInt(id, 10), requestStatus: 'pending' },
      include: { user: true },
    });
    if (!request) {
      res.status(404).json({ error: 'Request not found or already processed' });
      return;
    }

    const updatedRequest = await prisma.slotRequest.update({
      where: { id: parseInt(id, 10) },
      data: { requestStatus: 'rejected' },
    });

    if (request.user?.email) {
      const emailStatus = await sendRejectionEmail(request.user.email, reason || 'No reason provided');
      if (emailStatus === 'failed') {
        console.error(`Failed to send rejection email for request ${id}`);
        await prisma.log.create({
          data: { userId, action: `Failed to send rejection email for request ${id}` },
        });
      }
    }

    await prisma.log.create({
      data: { userId, action: `Slot request ${id} rejected${reason ? ` with reason: ${reason}` : ''}` },
    });

    res.json({ data: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};