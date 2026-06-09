const axios=require('axios');
const User = require('../models/User');
const Visit = require('../models/Visit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const create=async(req,res)=>{
    try{
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ error: 'Only doctors can create visit records.' });
        }
        const { patientEmail, notes, medicines, nextVisitDate } = req.body;

        const patient=await User.findOne({email:patientEmail,role:'patient'});
        const visit = new Visit({
            doctorId: req.user.id,
            patientId: patient._id,
            notes: notes,
            medicines: medicines,
            nextVisitDate: nextVisitDate
        });
        await visit.save();
        res.status(201).json({ message: 'Visit saved successfully', visit });
        console.log('here create');
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const history=async(req,res)=>{
    try{
        if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
            return res.status(403).json({ error: 'You can only view your own medical history.' });
        }

        const history = await Visit.find({ patientId: req.params.patientId })
            .sort({ createdAt: -1 })
            .populate('doctorId', 'name email');
        console.log('here history');
        res.json(history);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const extract=async(req,res)=>{
    try{
        const { transcript } = req.body;

        if (!transcript) {
            return res.status(400).json({ error: 'No transcript provided.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
        You are a highly intelligent medical assistant. Read the following doctor's dictation transcript and extract the patient's diagnosis and the doctor's general notes.

        Return ONLY a raw JSON object with this exact structure. Do not include any markdown formatting like \`\`\`json or \`\`\`. 

        {
            "diagnosis": "The specific medical diagnosis (e.g., Viral Pharyngitis)",
            "notes": "A summary of the doctor's observations and advice"
        }

        Doctor's Transcript: "${transcript}"
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const structuredData = JSON.parse(cleanJsonString);
        res.status(200).json(structuredData);
    }catch(e){
        res.status(500).json({error:'Error in extract service'});
    }
}

const getDoctorVisits = async (req, res) => {
    try {
        const visits = await Visit.find().populate('patientId','name email').sort({ nextVisitDate: 1 }); 
        res.status(200).json(visits);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctor visits' });
    }
};

module.exports={create,history,extract,getDoctorVisits};