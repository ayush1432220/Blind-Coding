import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, default: "Easy" },
    testCases: [
      {
        input: { type: String, default: "" }, 
        expectedOutput: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
