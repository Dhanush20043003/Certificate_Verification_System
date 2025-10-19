// backend/controllers/certificateController.js
const Certificate = require('../models/certificateModel');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Enhanced PDF generation with better design
const generatePdfBuffer = (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        layout: 'landscape',
        margin: 50 
      });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const width = doc.page.width;
      const height = doc.page.height;

      // Border decoration
      doc.lineWidth(3)
         .strokeColor('#1a237e')
         .rect(30, 30, width - 60, height - 60)
         .stroke();
      
      doc.lineWidth(1)
         .strokeColor('#3f51b5')
         .rect(35, 35, width - 70, height - 70)
         .stroke();

      // Certificate Title
      doc.fontSize(48)
         .fillColor('#1a237e')
         .font('Helvetica-Bold')
         .text('CERTIFICATE', 0, 80, { align: 'center' });

      doc.fontSize(20)
         .fillColor('#666')
         .font('Helvetica')
         .text('OF COMPLETION', 0, 140, { align: 'center' });

      // Decorative line
      doc.moveTo(width / 2 - 100, 170)
         .lineTo(width / 2 + 100, 170)
         .strokeColor('#3f51b5')
         .lineWidth(2)
         .stroke();

      // Content
      doc.fontSize(16)
         .fillColor('#333')
         .text('This is to certify that', 0, 200, { align: 'center' });

      doc.fontSize(32)
         .fillColor('#1a237e')
         .font('Helvetica-Bold')
         .text(certificateData.studentName, 0, 230, { align: 'center' });

      doc.fontSize(16)
         .fillColor('#333')
         .font('Helvetica')
         .text('has successfully completed the course', 0, 280, { align: 'center' });

      doc.fontSize(24)
         .fillColor('#3f51b5')
         .font('Helvetica-Bold')
         .text(certificateData.course, 0, 310, { align: 'center' });

      doc.fontSize(16)
         .fillColor('#333')
         .font('Helvetica')
         .text(`with a grade of "${certificateData.grade}"`, 0, 355, { align: 'center' });

      // Date and Authority
      const issueDate = new Date(certificateData.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.fontSize(14)
         .fillColor('#666')
         .text(`Issued on: ${issueDate}`, 70, height - 120);

      doc.fontSize(14)
         .text(`Issuing Authority: ${certificateData.universityName}`, width - 300, height - 120);

      // Credential ID at bottom
      doc.fontSize(10)
         .fillColor('#999')
         .font('Courier')
         .text(`Credential ID: ${certificateData.credentialID}`, 0, height - 60, { 
           align: 'center' 
         });

      // QR Code placeholder text
      doc.fontSize(8)
         .text('Verify at: yourwebsite.com/verify', 0, height - 40, { 
           align: 'center' 
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      return reject(new Error("Cannot upload an empty buffer."));
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'certificates', 
        resource_type: 'raw',
        format: 'pdf'
      }, 
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

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
    
    const pdfBuffer = await generatePdfBuffer({ 
      studentName, 
      course, 
      grade, 
      issueDate, 
      universityName, 
      credentialID 
    });
    
    if (pdfBuffer.length === 0) {
      throw new Error('PDF generation resulted in an empty buffer.');
    }
    
    const uploadResult = await uploadToCloudinary(pdfBuffer);
    
    const newCertificate = await Certificate.create({
      studentName, 
      course, 
      grade, 
      issueDate, 
      credentialID, 
      certificateHash,
      issuedBy: req.user.id,
      pdfUrl: uploadResult.secure_url,
    });

    res.status(201).json(newCertificate);
  } catch (error) {
    console.error('Certificate issuance error:', error);
    res.status(500).json({ 
      message: 'Failed to create or upload PDF.',
      error: error.message 
    });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      credentialID: req.params.id 
    }).populate('issuedBy', 'name');
    
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
    const certificates = await Certificate.find({ 
      issuedBy: req.user.id 
    }).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// New: Get certificates for a specific student
const getStudentCertificates = async (req, res) => {
  try {
    const { studentName } = req.query;
    
    if (!studentName) {
      return res.status(400).json({ message: 'Student name is required' });
    }

    const certificates = await Certificate.find({ 
      studentName: new RegExp(studentName, 'i') 
    })
    .populate('issuedBy', 'name')
    .sort({ createdAt: -1 });
    
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  issueCertificate,
  verifyCertificate,
  getMyCertificates,
  getStudentCertificates,
};