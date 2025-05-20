import { Request, Response } from 'express';
import { PrismaClient, Prisma, VehicleSize, VehicleType } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

interface SlotInput {
  slotNumber: string;
  size: VehicleSize; // Use enum instead of string
  vehicleType: VehicleType; // Use enum instead of string
  location: string;
  costPerHour: number;
}

export const bulkCreateSlots = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  let { slots }: { slots: SlotInput[] } = req.body;

  // Normalize input to uppercase for enums
  slots = slots.map(slot => ({
    ...slot,
    size: typeof slot.size === 'string' ? (slot.size.toUpperCase() as VehicleSize) : slot.size,
    vehicleType: typeof slot.vehicleType === 'string' ? (slot.vehicleType.toUpperCase() as VehicleType) : slot.vehicleType,
    costPerHour: Number(slot.costPerHour), 
  }));

  const validSizes = ['SMALL', 'MEDIUM', 'LARGE'];
  const validVehicleTypes = ['CAR', 'TRUCK', 'MOTORBIKE', 'VAN'];
  for (const slot of slots) {
    if (!validSizes.includes(slot.size)) {
      res.status(400).json({ error: `Invalid size: ${slot.size}. Must be one of ${validSizes.join(', ')}` });
      return;
    }
    if (!validVehicleTypes.includes(slot.vehicleType)) {
      res.status(400).json({ error: `Invalid vehicleType: ${slot.vehicleType}. Must be one of ${validVehicleTypes.join(', ')}` });
      return;
    }
  }

  try {
    const createdSlots = await prisma.parkingSlot.createMany({
      data: slots.map(slot => ({
        slotNumber: slot.slotNumber,
        size: slot.size as VehicleSize,
        vehicleType: slot.vehicleType as VehicleType,
        location: slot.location,
        costPerHour: slot.costPerHour,
        status: 'available',
      })),
    });

    await prisma.log.create({
      data: { userId, action: `Bulk created ${slots.length} slots` },
    });

    const newSlots = await prisma.parkingSlot.findMany({
      where: { slotNumber: { in: slots.map(s => s.slotNumber) } },
    });

    res.status(201).json(newSlots);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Slot number already exists or server error' });
  }
};

export const getSlots = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === 'admin';
  const { page = '1', limit = '10', search = '' } = req.query;
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;
  const searchQuery = search as string;

  try {
    // Use type assertion to bypass TS2322
    const where = {
      OR: [
        { slotNumber: { contains: searchQuery, mode: 'insensitive' } },
        // Add vehicleType filtering only if searchQuery matches an enum value
        ...(searchQuery && ['CAR', 'TRUCK', 'MOTORBIKE', 'VAN'].includes(searchQuery.toUpperCase())
          ? [{ vehicleType: { equals: searchQuery.toUpperCase() as VehicleType } }]
          : []),
      ],
      // Only show available slots to non-admins
      ...(isAdmin ? {} : { status: 'available' }),
    } as Prisma.ParkingSlotWhereInput;

    const [slots, totalItems] = await Promise.all([
      prisma.parkingSlot.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { id: 'asc' },
      }),
      prisma.parkingSlot.count({ where }),
    ]);

    await prisma.log.create({
      data: { userId, action: 'Slots list viewed' },
    });

    res.json({
      data: slots,
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

export const updateSlot = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  let { slotNumber, size, vehicleType, location } = req.body;

  // Normalize input to uppercase for enums
  size = typeof size === 'string' ? size.toUpperCase() : size;
  vehicleType = typeof vehicleType === 'string' ? vehicleType.toUpperCase() : vehicleType;

  // Validate enum values
  const validSizes = ['SMALL', 'MEDIUM', 'LARGE'];
  const validVehicleTypes = ['CAR', 'TRUCK', 'MOTORBIKE', 'VAN'];
  if (size && !validSizes.includes(size)) {
    res.status(400).json({ error: `Invalid size: ${size}. Must be one of ${validSizes.join(', ')}` });
    return;
  }
  if (vehicleType && !validVehicleTypes.includes(vehicleType)) {
    res.status(400).json({ error: `Invalid vehicleType: ${vehicleType}. Must be one of ${validVehicleTypes.join(', ')}` });
    return;
  }

  try {
    const slot = await prisma.parkingSlot.update({
      where: { id: parseInt(id, 10) },
      data: { slotNumber, size: size as VehicleSize, vehicleType: vehicleType as VehicleType, location },
    });

    await prisma.log.create({
      data: { userId, action: `Slot ${slotNumber} updated` },
    });

    res.json(slot);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Slot number already exists or server error' });
  }
};

export const deleteSlot = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  try {
    const slot = await prisma.parkingSlot.delete({
      where: { id: parseInt(id, 10) },
      select: { slotNumber: true },
    });

    await prisma.log.create({
      data: { userId, action: `Slot ${slot.slotNumber} deleted` },
    });

    res.json({ message: 'Slot deleted' });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Slot not found' });
  }
};