// backend/routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
const { 
  registerCertificate,
  fetchCertificate,
  verifyCertificate,
  getAllCertificates,
  verifyCertificateStatus
} = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

// PUBLIC ROUTES (No login required)
// Students register for certificate
router.post('/register', registerCertificate);

// Students fetch their certificate by details
router.post('/fetch', fetchCertificate);

// Anyone can verify certificate by credential ID
router.get('/verify/:id', verifyCertificate);

// PROTECTED ROUTES (Login required)
// Admin: Get all certificates
router.get('/all', protect, authorize('University'), getAllCertificates);

// Admin: Verify a certificate status
router.put('/verify-status/:id', protect, authorize('University'), verifyCertificateStatus);

module.exports = router;