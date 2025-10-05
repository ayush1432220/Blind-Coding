import Submission from '../models/Submission.js';
import { submissionQueue } from '../config/queue.js';

export const submitCode = async (req, res) => {
  const { code, language, questionId } = req.body;
  const userId = req.user.id;

  if (!questionId) {
    return res.status(400).json({ message: 'Question ID is required.' });
  }

  try {
    const newSubmission = await Submission.create({
      userId,
      questionId,
      code,
      language,
      status: 'In Queue', 
    });

    await submissionQueue.add('process-submission', {
      submissionId: newSubmission._id,
      code,
      language,
    });
    
    res.status(202).json({
      message: 'Submission received and is being processed.',
      submissionId: newSubmission._id
    });

  } catch (error) {
    console.error('Submission Error:', error);
    res.status(500).json({ message: 'Failed to accept submission.' });
  }
};

export const getSubmissionStatus = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        if (submission.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this submission' });
        }
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};