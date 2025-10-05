import mongoose from 'mongoose';

const securityEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: ['tab-switch', 'copy-attempt', 'paste-attempt', 'cut-attempt'],
  },
  details: {
    type: String,
  },
}, { timestamps: true });

const SecurityEvent = mongoose.model('SecurityEvent', securityEventSchema);
export default SecurityEvent;