// backend/models/certificateModel.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  // Student Personal Details
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String, required: true },
  
  // Academic Details
  collegeName: { type: String, required: true },
  course: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  
  // Certificate Details
  credentialID: { type: String, required: true, unique: true },
  certificateHash: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  
  // PDF Storage - Base64 encoded
  pdfData: { type: String, default: '' }, // Store PDF as Base64
  
  // Verification Status
  isVerified: { type: Boolean, default: false },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;