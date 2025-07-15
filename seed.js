import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Location from './models/Location.js';
import Event from './models/Event.js';
import EventRegistration from './models/EventRegistration.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Location.deleteMany({});
    await Event.deleteMany({});
    await EventRegistration.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Alice Admin',
        email: 'alice.admin@example.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'Bob User',
        email: 'bob.user@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Charlie User',
        email: 'charlie.user@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);

    console.log('Created users');

    // Create locations
    const locations = await Location.create([
      {
        name: 'Tech Park',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA'
      },
      {
        name: 'Convention Center',
        address: '456 Elm St',
        city: 'New York',
        state: 'NY',
        country: 'USA'
      },
      {
        name: 'Innovation Hub',
        address: '789 Oak Ave',
        city: 'Austin',
        state: 'TX',
        country: 'USA'
      }
    ]);

    console.log('Created locations');

    // Create events
    const events = await Event.create([
      {
        title: 'React Workshop',
        description: 'Learn React basics and build your first app',
        date: new Date('2025-02-01'),
        category: 'Workshop',
        location: locations[0]._id,
        createdBy: users[0]._id
      },
      {
        title: 'SQL Mastery',
        description: 'Advanced SQL techniques and database optimization',
        date: new Date('2025-02-15'),
        category: 'Seminar',
        location: locations[1]._id,
        createdBy: users[0]._id
      },
      {
        title: 'Node.js Deep Dive',
        description: 'Building scalable backend applications with Node.js',
        date: new Date('2025-03-01'),
        category: 'Conference',
        location: locations[2]._id,
        createdBy: users[0]._id
      },
      {
        title: 'MongoDB Workshop',
        description: 'NoSQL database design and implementation',
        date: new Date('2025-03-15'),
        category: 'Workshop',
        location: locations[0]._id,
        createdBy: users[0]._id
      }
    ]);

    console.log('Created events');

    // Create event registrations
    const registrations = await EventRegistration.create([
      {
        user: users[1]._id,
        event: events[0]._id,
        status: 'registered'
      },
      {
        user: users[1]._id,
        event: events[1]._id,
        status: 'registered'
      },
      {
        user: users[2]._id,
        event: events[0]._id,
        status: 'registered'
      },
      {
        user: users[2]._id,
        event: events[2]._id,
        status: 'registered'
      }
    ]);

    console.log('Created event registrations');

    console.log('Database seeded successfully!');
    console.log('\nSample Users:');
    console.log('Admin: alice.admin@example.com / password123');
    console.log('User: bob.user@example.com / password123');
    console.log('User: charlie.user@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
