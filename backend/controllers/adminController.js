import User from '../models/User.js';
import Submission from '../models/Submission.js';
import { Parser } from 'json2csv';
import SecurityEvent from '../models/SecurityEvents.js';


//
export const getAllParticipants = async (req, res) => {
    console.log("AdminController: getAllParticipants called");
    try {
        const users = await User.find({ role: 'participant' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export const getSecurityLogs = async (req, res) => {
    console.log("AdminController: getSecurityLogs called");
    try {
        const logs = await SecurityEvent.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getAllSubmissions = async (req, res) => {
    console.log("AdminController: getAllSubmissions called");
    try {
        const submissions = await Submission.find({}).populate('userId', 'name email');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
export const exportSubmissions = async (req, res) => {
    console.log("AdminController: exportSubmissions called");
    try {
        const submissions = await Submission.find({}).populate('userId', 'name email').lean();
        
        const fields = [
            { label: 'Participant Name', value: 'userId.name' },
            { label: 'Participant Email', value: 'userId.email' },
            { label: 'Question', value: 'question' },
            { label: 'Language', value: 'language' },
            { label: 'Status', value: 'status' },
            { label: 'Submitted At', value: 'createdAt' },
            { label: 'Code', value: 'code' },
        ];
        
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(submissions);

        res.header('Content-Type', 'text/csv');
        res.attachment('submissions.csv');
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error exporting data' });
    }
};