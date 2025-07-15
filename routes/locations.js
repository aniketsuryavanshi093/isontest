import express from 'express';
import { body } from 'express-validator';
import { adminOnly, authenticateToken } from '../middleware/auth.js';
import { createLocation, getLocations } from '../service/locationServices.js';
const router = express.Router();

// GET /api/locations - Get all locations
router.get('/',getLocations);

// POST /api/locations - Create new location (admin only)
router.post('/', authenticateToken, adminOnly, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().isLength({ min: 1, max: 50 }).withMessage('City is required and must be less than 50 characters'),
  body('state').trim().isLength({ min: 1, max: 50 }).withMessage('State is required and must be less than 50 characters'),
  body('country').trim().isLength({ min: 1, max: 50 }).withMessage('Country is required and must be less than 50 characters')
], createLocation);

export default router;
