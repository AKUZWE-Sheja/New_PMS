import { Router } from 'express';
import { createRequest, getRequests, updateRequest, deleteRequest, approveRequest, rejectRequest, exitRequest } from '../controllers/requestController';
import { authenticate, isAdmin } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/slot-requests:
 *   post:
 *     summary: Create a new slot request
 *     tags: [Slot Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicleId, startTime, endTime]
 *             properties:
 *               vehicleId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Slot request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     userId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     requestStatus: { type: string, enum: [pending, approved, rejected] }
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *                     cost: { type: number }
 *                     approvedAt: { type: string, format: date-time, nullable: true }
 *                     createdAt: { type: string, format: date-time }
 *       401: { description: Unauthorized }
 *       400: { description: Invalid startTime or endTime }
 *       404: { description: Vehicle not found }
 *       500: { description: Server error }
 */
router.post('/', authenticate, createRequest);

/**
 * @swagger
 * /api/slot-requests:
 *   get:
 *     summary: List slot requests
 *     tags: [Slot Requests]
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
 *       200:
 *         description: List of slot requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       userId: { type: integer }
 *                       vehicleId: { type: integer }
 *                       requestStatus: { type: string, enum: [pending, approved, rejected] }
 *                       startTime: { type: string, format: date-time }
 *                       endTime: { type: string, format: date-time }
 *                       cost: { type: number }
 *                       approvedAt: { type: string, format: date-time, nullable: true }
 *                       createdAt: { type: string, format: date-time }
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           plateNumber: { type: string }
 *                           vehicleType: { type: string }
 *                           size: { type: string }
 *                       user:
 *                         type: object
 *                         properties:
 *                           email: { type: string }
 *                       slot:
 *                         type: object
 *                         properties:
 *                           slotNumber: { type: string }
 *                           status: { type: string }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems: { type: integer }
 *                     currentPage: { type: integer }
 *                     totalPages: { type: integer }
 *                     limit: { type: integer }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.get('/', authenticate, getRequests);

/**
 * @swagger
 * /api/slot-requests/{id}:
 *   put:
 *     summary: Update a slot request
 *     tags: [Slot Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehicleId]
 *             properties:
 *               vehicleId: { type: integer }
 *               startTime: { type: string, format: date-time }
 *               endTime: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Slot request updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     userId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     requestStatus: { type: string, enum: [pending, approved, rejected] }
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *                     cost: { type: number }
 *                     approvedAt: { type: string, format: date-time, nullable: true }
 *                     createdAt: { type: string, format: date-time }
 *       401: { description: Unauthorized }
 *       404: { description: Request not found }
 *       500: { description: Server error }
 */
router.put('/:id', authenticate, updateRequest);

/**
 * @swagger
 * /api/slot-requests/{id}:
 *   delete:
 *     summary: Delete a slot request
 *     tags: [Slot Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Slot request deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message: { type: string }
 *       401: { description: Unauthorized }
 *       404: { description: Request not found }
 *       500: { description: Server error }
 */
router.delete('/:id', authenticate, deleteRequest);

/**
 * @swagger
 * /api/slot-requests/{id}/approve:
 *   post:
 *     summary: Approve a slot request (admin only)
 *     tags: [Slot Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Slot request approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     userId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     requestStatus: { type: string, enum: [pending, approved, rejected] }
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *                     cost: { type: number }
 *                     approvedAt: { type: string, format: date-time, nullable: true }
 *                     createdAt: { type: string, format: date-time }
 *       400: { description: No compatible slots }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Request not found }
 *       500: { description: Server error }
 */
router.post('/:id/approve', authenticate, isAdmin, approveRequest);

/**
 * @swagger
 * /api/slot-requests/{id}/reject:
 *   post:
 *     summary: Reject a slot request (admin only)
 *     tags: [Slot Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Slot request rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     userId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     requestStatus: { type: string, enum: [pending, approved, rejected] }
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *                     cost: { type: number }
 *                     approvedAt: { type: string, format: date-time, nullable: true }
 *                     createdAt: { type: string, format: date-time }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Request not found }
 *       500: { description: Server error }
 */
router.post('/:id/reject', authenticate, isAdmin, rejectRequest);

/**
 * @swagger
 * /api/slot-requests/{id}/exit:
 *   post:
 *     summary: Mark a car as exited, set end time, and calculate cost
 *     tags: [Slot Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the slot request
 *     responses:
 *       200:
 *         description: Exit processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     userId: { type: integer }
 *                     vehicleId: { type: integer }
 *                     slotId: { type: integer }
 *                     slotNumber: { type: string }
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *                     cost: { type: number }
 *                     requestStatus: { type: string }
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request or slot not found, or not started
 *       500:
 *         description: Server error
 */
router.post('/:id/exit', authenticate, exitRequest);


export default router;