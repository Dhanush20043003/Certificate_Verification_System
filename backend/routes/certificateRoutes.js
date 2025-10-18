// routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
// IMPORTANT: Update your import
const { issueCertificate, verifyCertificate, getMyCertificates } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for issuing certificates (Private)
router.route('/').post(protect, authorize('University'), issueCertificate);

// Add the new route for getting a user's certificates (Private)
router.route('/mycertificates').get(protect, authorize('University'), getMyCertificates);

// Route for verifying a certificate (Public)
router.route('/verify/:id').get(verifyCertificate);

module.exports = router;