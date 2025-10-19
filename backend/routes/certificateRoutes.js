// backend/routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
const { 
  issueCertificate, 
  verifyCertificate, 
  getMyCertificates,
  getStudentCertificates 
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

// University: Issue certificates
router.post('/', protect, authorize('University'), issueCertificate);

// University: Get all certificates issued by them
router.get('/mycertificates', protect, authorize('University'), getMyCertificates);

// Student: Get their own certificates
router.get('/student', protect, authorize('Student', 'Company'), getStudentCertificates);

// Public: Verify a certificate by credential ID
router.get('/verify/:id', verifyCertificate);

module.exports = router;