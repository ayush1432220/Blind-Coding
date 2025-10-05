import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { questions } from './db/firstyear.js';
import Question from './models/Question.js';


dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeder');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        await Question.deleteMany();
        await Question.insertMany(questions);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();