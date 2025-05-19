import { Request, Response } from 'express';
import { PrismaClient, VehicleType, VehicleSize, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized: user ID missing' });
    return;
  }

  // Validate req.body
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'Request body is missing or invalid' });
    return;
  }

  const { plateNumber, vehicleType, size } = req.body;

  // Validate required fields
  if (!plateNumber || !vehicleType || !size) {
    res.status(400).json({ error: 'Missing required fields: plateNumber, vehicleType, size' });
    return;
  }

  // Validate enum values
  const validVehicleTypes = Object.values(VehicleType); // ['CAR', 'TRUCK', 'MOTORBIKE', 'VAN']
  const validSizes = Object.values(VehicleSize); // ['SMALL', 'MEDIUM', 'LARGE']
  if (!validVehicleTypes.includes(vehicleType)) {
    res.status(400).json({ error: `Invalid vehicleType: ${vehicleType}. Must be one of ${validVehicleTypes.join(', ')}` });
    return;
  }
  if (!validSizes.includes(size)) {
    res.status(400).json({ error: `Invalid size: ${size}. Must be one of ${validSizes.join(', ')}` });
    return;
  }

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        plateNumber,
        vehicleType: vehicleType as VehicleType,
        size: size as VehicleSize,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    await prisma.log.create({
      data: { userId, action: `Vehicle ${plateNumber} created` },
    });

    res.status(201).json({ data: vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const getVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  const { page = '1', limit = '10', search = '' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  const searchQuery = search as string;

  try {
    const where = isAdmin
      ? { plateNumber: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } }
      : { userId, plateNumber: { contains: searchQuery, mode: Prisma.QueryMode.insensitive } };

    const [vehicles, totalItems] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { id: 'asc' },
        include: { user: { select: { email: true } } },
      }),
      prisma.vehicle.count({ where }),
    ]);

    await prisma.log.create({
      data: { userId, action: 'Vehicles list viewed' },
    });

    res.json({
      data: vehicles,
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

export const updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { plateNumber, vehicleType, size } = req.body;

  if (typeof userId !== 'number') {
    res.status(401).json({ error: 'Unauthorized: user ID missing' });
    return;
  }

  // Validate req.body
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'Request body is missing or invalid' });
    return;
  }

  // Validate enum values if provided
  const validVehicleTypes = Object.values(VehicleType);
  const validSizes = Object.values(VehicleSize);
  if (vehicleType && !validVehicleTypes.includes(vehicleType)) {
    res.status(400).json({ error: `Invalid vehicleType: ${vehicleType}. Must be one of ${validVehicleTypes.join(', ')}` });
    return;
  }
  if (size && !validSizes.includes(size)) {
    res.status(400).json({ error: `Invalid size: ${size}. Must be one of ${validSizes.join(', ')}` });
    return;
  }

  try {
    const vehicle = await prisma.vehicle.findFirst({ where: { id: parseInt(id, 10), userId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(id, 10) },
      data: { plateNumber, vehicleType: vehicleType as VehicleType, size: size as VehicleSize },
      include: { user: { select: { email: true } } },
    });

    await prisma.log.create({
      data: { userId, action: `Vehicle ${id} updated` },
    });

    res.json({ data: updatedVehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  try {
    const vehicle = await prisma.vehicle.findFirst({ where: { id: parseInt(id, 10), userId } });
    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found' });
      return;
    }

    await prisma.vehicle.delete({ where: { id: parseInt(id, 10) } });
    await prisma.log.create({
      data: { userId, action: `Vehicle ${id} deleted` },
    });

    res.json({ data: { message: 'Vehicle deleted' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};