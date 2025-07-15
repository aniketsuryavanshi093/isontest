import { validationResult } from 'express-validator';
import Event from '../models/Event.js';
import EventRegistration from '../models/EventRegistration.js';
import Location from '../models/Location.js';

// GET /api/events - Fetch all events with optional filters
export const getEventsService = async (req, res) => {
  try {
    const { date, category, location, startDate, endDate, page = 1, limit = 9 } = req.query;
    let filter = {};

    // Date filtering
    if (date) {
      filter.date = new Date(date);
    }
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Category filtering
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Location filtering by location name
    if (location) {
      const locations = await Location.find({
        $or: [
          { name: { $regex: location, $options: 'i' } },
          { city: { $regex: location, $options: 'i' } },
          { state: { $regex: location, $options: 'i' } }
        ]
      });
      const locationIds = locations.map(loc => loc._id);
      filter.location = { $in: locationIds };
    }

    // Calculate pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Get total count for pagination
    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / pageSize);

    const events = await Event.find(filter)
      .populate('location', 'name address city state country')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json({
      events,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalEvents,
        pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/events/:id - Get single event
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('location', 'name address city state country')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/events - Create new event (admin only)
export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, category, locationId , capacity } = req.body;

    // Verify location exists
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const event = new Event({
      title,
      description,
      date,
      category,
      capacity,
      location: locationId,
      createdBy: req.user._id
    });

    await event.save();
    await event.populate('location', 'name address city state country');
    await event.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/events/:id - Update event (admin only)
export const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, category, locationId } = req.body;

    // Verify location exists if provided
    if (locationId) {
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = date;
    if (category) updateData.category = category;
    if (locationId) updateData.location = locationId;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('location', 'name address city state country')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/events/:id - Delete event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Delete all registrations for this event
    await EventRegistration.deleteMany({ event: req.params.id });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/register/:id - Register for an event
export const createEventRegistration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      user: userId,
      event: eventId
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'registered') {
        return res.status(400).json({ error: 'Already registered for this event' });
      }
      
      // If cancelled, reactivate registration
      existingRegistration.status = 'registered';
      await existingRegistration.save();
      
      // Increment registration count
      await Event.findByIdAndUpdate(eventId, { $inc: { registrationCount: 1 } });
      
      return res.json({
        message: 'Registration reactivated successfully',
        registration: existingRegistration
      });
    }

    // Create new registration
    const registration = new EventRegistration({
      user: userId,
      event: eventId,
      status: 'registered'
    });

    await registration.save();
    
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
    
    await registration.populate('event', 'title date');

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/register - Get user's registrations
export const getuserEventRegistration = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({
      user: req.user._id
    })
      .populate('event', 'title description date category')
      .populate({
        path: 'event',
        populate: {
          path: 'location',
          select: 'name address city state country'
        }
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllRegistration = async(req, res) => {
  try {
    const registrations = await EventRegistration.find()
      .populate('user', 'name email')
      .populate('event', 'title date')
      .populate({
        path: 'event',
        populate: {
          path: 'location',
          select: 'name address city state country'
        }
      })
      .sort({ createdAt: -1 });
      res.json(registrations);
     } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
export const isUserRegisteredForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    const registration = await EventRegistration.findOne({
      user: userId,
      event: eventId
    });
    if (registration) {
      res.json({ isRegistered: true });
    } else {
      res.json({ isRegistered: false });
    }
  }
    catch (error) {
      nsole.error(error);
    res.status(500).json({ error: 'Server error' });
  };
}
// PUT /api/register/:id/cancel - Register for an event
export const cancelRegisteration = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    await EventRegistration.findOneAndDelete({
      user: userId,
      event: eventId
    })
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};