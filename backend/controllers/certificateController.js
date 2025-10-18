// backend/controllers/certificateController.js
const Certificate = require('../models/certificateModel');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary from .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to generate a PDF buffer
const generatePdfBuffer = (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- PDF Content ---
      doc.fontSize(40).font('Helvetica-Bold').text('Certificate of Completion', { align: 'center' });
      doc.moveDown(1.5);
      doc.fontSize(20).font('Helvetica').text('This is to certify that', { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(30).font('Helvetica-Bold').text(certificateData.studentName, { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(20).font('Helvetica').text(`has successfully completed the course`, { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(25).font('Helvetica-Bold').text(certificateData.course, { align: 'center' });
      doc.moveDown(1);
      doc.fontSize(20).font('Helvetica').text(`with a grade of "${certificateData.grade}".`, { align: 'center' });
      doc.moveDown(2);
      
      // THIS IS THE CORRECTED LINE
      doc.fontSize(16).text(`Issued on: ${new Date(certificateData.issueDate).toLocaleDateString()}`, 50, 450, { align: 'left' });
      
      doc.fontSize(16).text(`Issuing Authority: ${certificateData.universityName}`, 50, 450, { align: 'right' });
      doc.fontSize(10).text(`Credential ID: ${certificateData.credentialID}`, 50, 500, { align: 'center' });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to upload a buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      return reject(new Error("Cannot upload an empty buffer."));
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'certificates', resource_type: 'raw' }, 
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// --- Main Issue Certificate Function ---
const issueCertificate = async (req, res) => {
  try {
    const { studentName, course, grade, issueDate } = req.body;
    const universityName = req.user.name;

    if (!studentName || !course || !grade || !issueDate) {
      return res.status(400).json({ message: 'Please fill out all fields' });
    }

    const credentialID = uuidv4();
    const certificateDataString = `${studentName}${course}${grade}${issueDate}`;
    const certificateHash = crypto.createHash('sha256').update(certificateDataString).digest('hex');
    
    const pdfBuffer = await generatePdfBuffer({ studentName, course, grade, issueDate, universityName, credentialID });
    
    if (pdfBuffer.length === 0) throw new Error('PDF generation resulted in an empty buffer.');
    
    const uploadResult = await uploadToCloudinary(pdfBuffer);
    
    const newCertificate = await Certificate.create({
      studentName, course, grade, issueDate, credentialID, certificateHash,
      issuedBy: req.user.id,
      pdfUrl: uploadResult.secure_url,
    });

    res.status(201).json(newCertificate);
  } catch (error) {
    console.error('--- ERROR DURING CERTIFICATE ISSUANCE ---', error);
    res.status(500).json({ message: 'Failed to create or upload PDF.' });
  }
};

// --- Other Controller Functions ---
const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ credentialID: req.params.id }).populate('issuedBy', 'name');
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ issuedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  issueCertificate,
  verifyCertificate,
  getMyCertificates,
};