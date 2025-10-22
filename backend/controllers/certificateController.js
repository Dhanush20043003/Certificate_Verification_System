// backend/controllers/certificateController.js - FIXED PDF DOWNLOAD
const Certificate = require('../models/certificateModel');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');

// Generate Certificate PDF - EXACT GALGOTIAS DESIGN
const generatePdfBuffer = (certData) => {
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

      // OUTER GOLD BORDER
      doc.lineWidth(8)
         .strokeColor('#DAA520')
         .rect(25, 25, width - 50, height - 50)
         .stroke();
      
      // INNER BORDER
      doc.lineWidth(2)
         .strokeColor('#8B4513')
         .rect(35, 35, width - 70, height - 70)
         .stroke();

      // TOP - UNIVERSITY NAME
      doc.fontSize(32)
         .fillColor('#8B0000')
         .font('Helvetica-Bold')
         .text('GALGOTIAS UNIVERSITY', 0, 85, { align: 'center' });

      // NAAC Grade
      doc.fontSize(10)
         .fillColor('#8B0000')
         .text('NAAC GRADE A+', width - 150, 65, { width: 100, align: 'center' });
      
      doc.fontSize(9)
         .text('Accredited University', width - 150, 78, { width: 100, align: 'center' });

      // CERTIFICATE TITLE
      doc.fontSize(26)
         .fillColor('#000')
         .font('Helvetica-Bold')
         .text('Certificate of Achievement', 0, 145, { align: 'center' });

      // DECORATIVE LINE
      doc.moveTo(width / 2 - 120, 180)
         .lineTo(width / 2 + 120, 180)
         .strokeColor('#DAA520')
         .lineWidth(2)
         .stroke();

      // BODY TEXT
      doc.fontSize(14)
         .fillColor('#000')
         .font('Helvetica')
         .text('This is to certify that', 0, 210, { align: 'center' });

      // STUDENT NAME
      doc.fontSize(28)
         .fillColor('#8B0000')
         .font('Helvetica-BoldOblique')
         .text(certData.fullName, 0, 245, { align: 'center' });

      // COURSE DESCRIPTION
      doc.fontSize(13)
         .fillColor('#000')
         .font('Helvetica')
         .text(`has successfully completed the course ${certData.course} - demonstrating dedication, academic`, 0, 295, { align: 'center' })
         .text('excellence, and commitment to learning.', 0, 313, { align: 'center' });

      // DETAILED TEXT
      doc.fontSize(11)
         .fillColor('#333')
         .text('Throughout the duration of the course, he has fulfilled all academic requirements, completed', 0, 345, { align: 'center' })
         .text('assigned coursework, and participated in relevant academic activities as per the standards', 0, 360, { align: 'center' })
         .text('prescribed by Galgotias University.', 0, 375, { align: 'center' });

      // ADMISSION NUMBER
      doc.fontSize(13)
         .fillColor('#000')
         .font('Helvetica-Bold')
         .text(`Admission Number: ${certData.admissionNumber}`, 0, 415, { align: 'center' });

      // SIGNATURE SECTION
      const sigY = height - 130;
      
      doc.fontSize(12)
         .font('Helvetica')
         .text('_________________', 120, sigY, { width: 150, align: 'center' });
      doc.fontSize(10)
         .text('Signature of Dean', 120, sigY + 20, { width: 150, align: 'center' });

      doc.fontSize(12)
         .text('_________________', width - 270, sigY, { width: 150, align: 'center' });
      doc.fontSize(10)
         .text('Signature of HOD', width - 270, sigY + 20, { width: 150, align: 'center' });

      // FOOTER
      doc.fontSize(9)
         .fillColor('#666')
         .font('Courier')
         .text(`Certificate No: ${certData.credentialID}`, 60, height - 70, { width: 300 });

      const issueDate = new Date(certData.issueDate).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      
      doc.fontSize(9)
         .text(`Date of Issue: ${issueDate}`, width - 360, height - 70, { width: 300, align: 'right' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// 1. REGISTER CERTIFICATE
const registerCertificate = async (req, res) => {
  try {
    const { fullName, mobile, email, dateOfBirth, address, collegeName, course, admissionNumber, section, semester } = req.body;

    if (!fullName || !mobile || !email || !dateOfBirth || !address || !collegeName || !course || !admissionNumber || !section || !semester) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await Certificate.findOne({ admissionNumber });
    if (exists) {
      return res.status(400).json({ message: 'Certificate already exists for this admission number' });
    }

    const credentialID = `GU-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
    const certificateHash = crypto.createHash('sha256').update(`${fullName}${admissionNumber}${Date.now()}`).digest('hex');
    
    console.log('Generating PDF for:', fullName);
    
    const pdfBuffer = await generatePdfBuffer({ fullName, course, admissionNumber, credentialID, issueDate: new Date() });
    const pdfBase64 = pdfBuffer.toString('base64');
    
    const certificate = await Certificate.create({
      fullName, mobile, email, dateOfBirth, address, collegeName, course, admissionNumber, section, semester,
      credentialID, certificateHash, pdfData: pdfBase64
    });

    console.log('✓ Certificate saved with PDF');

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully!',
      certificate: {
        credentialID: certificate.credentialID,
        fullName: certificate.fullName,
        hasPDF: true
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Failed to generate certificate', error: error.message });
  }
};

// 2. FETCH CERTIFICATE
const fetchCertificate = async (req, res) => {
  try {
    const { fullName, admissionNumber, dateOfBirth } = req.body;

    const certificate = await Certificate.findOne({ 
      admissionNumber: admissionNumber.trim() 
    });

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (certificate.fullName.toLowerCase() !== fullName.trim().toLowerCase()) {
      return res.status(404).json({ message: 'Name does not match' });
    }

    const inputDate = new Date(dateOfBirth).toDateString();
    const certDate = new Date(certificate.dateOfBirth).toDateString();
    if (inputDate !== certDate) {
      return res.status(404).json({ message: 'Date of birth does not match' });
    }

    // Don't send pdfData in response (too large)
    const certCopy = certificate.toObject();
    delete certCopy.pdfData;

    res.json(certCopy);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. DOWNLOAD PDF - FIXED VERSION
const downloadPDF = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ credentialID: req.params.id });
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (!certificate.pdfData) {
      return res.status(404).json({ message: 'PDF not available for this certificate' });
    }

    // Convert Base64 back to Buffer
    const pdfBuffer = Buffer.from(certificate.pdfData, 'base64');
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${certificate.fullName.replace(/\s+/g, '_')}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log('✓ PDF Downloaded:', certificate.credentialID);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download PDF', error: error.message });
  }
};

// 4. VERIFY BY CREDENTIAL ID
const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ credentialID: req.params.id });
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    const certCopy = certificate.toObject();
    delete certCopy.pdfData;
    
    res.json(certCopy);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. GET ALL (Admin)
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .select('-pdfData')
      .sort({ createdAt: -1 });
    
    console.log(`✓ Fetched ${certificates.length} certificates`);
    res.json(certificates);
  } catch (error) {
    console.error('Get all error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. VERIFY STATUS (Admin)
const verifyCertificateStatus = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    certificate.isVerified = true;
    certificate.verifiedBy = req.user.id;
    await certificate.save();

    res.json({ success: true, message: 'Verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerCertificate,
  fetchCertificate,
  downloadPDF,
  verifyCertificate,
  getAllCertificates,
  verifyCertificateStatus
};