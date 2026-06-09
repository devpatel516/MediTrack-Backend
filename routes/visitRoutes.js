const express = require('express');
const {create,history,extract,getDoctorVisits}=require('../controllers/visitController');
const authMiddleware=require('../middleware/auth');

const router=express.Router();
router.post('/create',authMiddleware,create);
router.get('/history/:patientId',authMiddleware,history);
router.post('/ai',authMiddleware,extract);
router.get('/doctor-visits', authMiddleware, getDoctorVisits);

module.exports=router;