import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled'],
    default: 'registered'
  }
}, {
  timestamps: true
});

// Ensure a user can only register once per event
eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('EventRegistration', eventRegistrationSchema);
