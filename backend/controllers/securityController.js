import SecurityEvent from '../models/SecurityEvents.js';

export const logSecurityEvent = async (req, res) => {
  try {
    const { eventType, details } = req.body;
    const userId = req.user.id;

    await SecurityEvent.create({
      userId,
      eventType,
      details,
    });

    res.status(201).json({ message: 'Event logged successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to log event.' });
  }
};