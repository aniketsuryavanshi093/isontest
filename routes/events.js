import { body } from 'express-validator';
import express from 'express';
import { adminOnly, authenticateToken } from '../middleware/auth.js';
import { getEventsService, getEvent, createEvent, updateEvent, deleteEvent } from '../service/eventServices.js';
const router = express.Router();

// GET /api/events - Fetch all events with optional filters
router.get('/', getEventsService);

// GET /api/events/:id - Get single event
router.get('/:id',getEvent );

// POST /api/events - Create new event (admin only)
router.post('/', authenticateToken, adminOnly, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Please provide a valid date'),
  body('category').trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be less than 50 characters'),
  body('locationId').isMongoId().withMessage('Valid location ID is required')
],createEvent );

// PUT /api/events/:id - Update event (admin only)
router.put('/:id', authenticateToken, adminOnly, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('date').optional().isISO8601().withMessage('Please provide a valid date'),
  body('category').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Category must be less than 50 characters'),
  body('locationId').optional().isMongoId().withMessage('Valid location ID is required')
], updateEvent);

// DELETE /api/events/:id - Delete event (admin only)
router.delete('/:id', authenticateToken, adminOnly, deleteEvent);

export default router;
