import { adminOnly, authenticateToken } from '../middleware/auth.js';
import { cancelRegisteration, createEventRegistration, getAllRegistration, getuserEventRegistration, isUserRegisteredForEvent } from "../service/eventServices.js";
import express from "express";

const router = express.Router();


// GET /api/register - Get user's registrations
router.get('/', authenticateToken , getuserEventRegistration );

// GET /api/register - Get user's registrations
router.post('/getall', authenticateToken , adminOnly , getAllRegistration );

// GET /api/register - chec user's registrations
router.get('/:id', authenticateToken , isUserRegisteredForEvent );

// POST /api/register/:id - Register for an event
router.post('/:id', authenticateToken , createEventRegistration );

// POST /api/register/:id/cancel - cancel register for an event
router.post('/:id/cancel', authenticateToken , cancelRegisteration );

export default router;
