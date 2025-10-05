import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Submission from './models/Submission.js';
import Question from './models/Question.js';

dotenv.config();

const redisConnection = new IORedis(process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

mongoose.connect(process.env.MONGO_URI);

const languageMap = {
  javascript: 63,
  python: 71,
  java: 62,
  c: 50,
};

const submissionProcessor = async (job) => {
  const { submissionId, code, language } = job.data;
  console.log(`Processing submission with Judge0: ${submissionId}`);

  try {
    await Submission.findByIdAndUpdate(submissionId, { status: 'Processing' });
    
    const submission = await Submission.findById(submissionId);
    if (!submission) throw new Error(`Submission not found: ${submissionId}`);
    
    const question = await Question.findById(submission.questionId);
    if (!question || !question.testCases || question.testCases.length === 0) {
      throw new Error(`Question or test cases not found for submission: ${submissionId}`);
    }

    for (const testCase of question.testCases) {
      const language_id = languageMap[language] || 71;

      const options = {
        method: 'POST',
        url: `${process.env.JUDGE0_API_URL}/submissions`,
        params: { base64_encoded: 'true', wait: 'true', fields: '*' },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
          language_id,
          source_code: Buffer.from(code).toString('base64'),
          stdin: Buffer.from(testCase.input || "").toString('base64'),
          expected_output: Buffer.from(testCase.expectedOutput).toString('base64'),
        }
      };
      
      const { data: result } = await axios.request(options);
      
      const statusId = result.status.id;
      // Judge0 status ID 3 is "Accepted"

      if (statusId !== 3) {
        const rawOutput = result.stdout || result.stderr || result.compile_output || '';
        const decodedOutput = rawOutput ? Buffer.from(rawOutput, 'base64').toString('ascii') : 'No output produced.';

        await Submission.findByIdAndUpdate(submissionId, {
          status: result.status.description,
          output: decodedOutput
        });
        console.log(`Submission ${submissionId} failed with status: ${result.status.description}`);
        return; // Stop processing further test cases
      }
    }

    // If all test cases pass
    await Submission.findByIdAndUpdate(submissionId, {
      status: 'Accepted',
      output: 'All test cases passed!'
    });
    console.log(`Finished submission: ${submissionId} with status: Accepted`);

  } catch (error) {
    console.error(`Error processing submission ${submissionId}:`, error.response ? error.response.data : error.message);
    await Submission.findByIdAndUpdate(submissionId, { status: 'System Error' });
  }
};

new Worker('submission', submissionProcessor, { connection: redisConnection });

console.log('Worker is listening for submission jobs...');