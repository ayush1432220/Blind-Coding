import Question from '../models/Question.js';
import Submission from '../models/Submission.js';

export const getAssignedQuestion = async (req, res) => {
  try {
    const user = req.user;
    let easyQuestionId = user.assignedEasyQuestion;
    let hardQuestionId = user.assignedHardQuestion;

    // Agar user ko questions assign nahi hain (first time visit)
    if (!easyQuestionId || !hardQuestionId) {
      const [easyQuestions, hardQuestions] = await Promise.all([
        Question.aggregate([{ $match: { difficulty: 'Easy' } }, { $sample: { size: 1 } }]),
        Question.aggregate([{ $match: { difficulty: 'Medium' } }, { $sample: { size: 1 } }])
      ]);
      
      if (!easyQuestions?.length || !hardQuestions?.length) {
        return res.status(404).json({ message: 'Could not find enough questions to assign.' });
      }

      easyQuestionId = easyQuestions[0]._id;
      hardQuestionId = hardQuestions[0]._id;

      user.assignedEasyQuestion = easyQuestionId;
      user.assignedHardQuestion = hardQuestionId;
      await user.save();
    }
    
    // Ab jab humare paas question IDs hain, to saara data ek saath fetch karein
    const [
      easyQuestion,
      hardQuestion,
      easySubmission,
      hardSubmission
    ] = await Promise.all([
        Question.findById(easyQuestionId),
        Question.findById(hardQuestionId),
        Submission.findOne({ userId: user._id, questionId: easyQuestionId }),
        Submission.findOne({ userId: user._id, questionId: hardQuestionId })
    ]);
    
    // Frontend ko hamesha sahi format mein data bhejein
    res.json({
        easy: { question: easyQuestion, submission: easySubmission },
        hard: { question: hardQuestion, submission: hardSubmission }
    });

  } catch (error) {
    console.error("Error assigning or fetching questions:", error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
};