// models/certificateModel.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  grade: { type: String, required: true },
  issueDate: { type: Date, required: true },
  credentialID: { type: String, required: true, unique: true },
  certificateHash: { type: String, required: true },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId, // A special type for IDs
    ref: 'User', // This links to the User model
    required: true,
  },
  certificateHash: { type: String, required: true },
  issuedBy: { /* ... */ },
  pdfUrl: { type: String, default: '' } // Add this line
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;