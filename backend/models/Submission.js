import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  output: { type: String },
  status: { type: String, default: 'In Queue' },
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;