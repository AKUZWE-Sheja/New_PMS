import { Router } from 'express';
import { createVehicle, getVehicles } from "../controllers/vehicleController";
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [plate_number, vehicle_type, size]
 *             properties:
 *               plateNumber: { type: string }
 *               vehicleType: { type: string }
 *               size: { type: string }
 *               otherAttributes: { type: object }
 *     responses:
 *       201: { description: Vehicle created }
 *       400: { description: Plate number exists }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, createVehicle);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: List vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200: { description: List of vehicles }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.get('/', authenticate, getVehicles);

export default router;