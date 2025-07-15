
import express from 'express';
import { body } from 'express-validator';
import { loginService, registerService } from '../service/authServices.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Role must be either admin or user')
], registerService);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], loginService);

export default router;
