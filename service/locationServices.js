import { validationResult } from 'express-validator';
import Location from '../models/Location.js';

// GET /api/locations - Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/locations - Create new location (admin only)
export const createLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, city, state, country } = req.body;

    const location = new Location({
      name,
      address,
      city,
      state,
      country
    });

    await location.save();

    res.status(201).json({
      message: 'Location created successfully',
      location
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
