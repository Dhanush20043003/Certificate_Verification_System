// frontend/src/pages/DownloadCertificatePage.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Alert,
  Paper, Card, CardContent, Divider, CircularProgress
} from '@mui/material';
import { Download, Verified } from '@mui/icons-material';

const DownloadCertificatePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    dateOfBirth: '',
  });
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCertificate(null);

    try {
      const res = await axios.post('/api/certificates/fetch', formData);
      console.log('Certificate found:', res.data);
      setCertificate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (certificate?.pdfUrl) {
      console.log('Opening PDF:', certificate.pdfUrl);
      window.open(certificate.pdfUrl, '_blank');
    } else {
      alert('PDF not available');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#8B0000', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#FFF', fontWeight: 'bold', mb: 4 }}>
          Download Your Certificate
        </Typography>

        {/* Search Form */}
        <Paper elevation={12} sx={{ p: 4, mb: 4, backgroundColor: '#E8E8E8' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#8B0000', fontWeight: 'bold' }}>
            Enter details to find Your Certificate
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              margin="normal"
              placeholder="Dhanush N"
              sx={{ backgroundColor: '#FFF' }}
            />

            <TextField
              fullWidth
              required
              label="Admission Number"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={onChange}
              margin="normal"
              placeholder="1BC22CS012"
              sx={{ backgroundColor: '#FFF' }}
            />

            <TextField
              fullWidth
              required
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={onChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{ backgroundColor: '#FFF' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: '#8B0000',
                '&:hover': { backgroundColor: '#660000' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Fetch Certificate'}
            </Button>
          </Box>
        </Paper>

        {/* Certificate Preview */}
        {certificate && (
          <Paper elevation={12} sx={{ p: 4, backgroundColor: '#E8E8E8' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Verified sx={{ fontSize: 60, color: '#4caf50' }} />
              <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                Certificate Found!
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Card elevation={4} sx={{ mb: 3, backgroundColor: '#FFF', border: '3px solid #DAA520', p: 2 }}>
              <CardContent>
                <Typography variant="h5" align="center" sx={{ color: '#8B0000', fontWeight: 'bold', mb: 1 }}>
                  GALGOTIAS UNIVERSITY
                </Typography>
                <Typography variant="subtitle1" align="center" gutterBottom>
                  Certificate of Achievement
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" align="center">
                  This is to certify that
                </Typography>
                <Typography variant="h4" align="center" sx={{ color: '#8B0000', fontWeight: 'bold', my: 2 }}>
                  {certificate.fullName}
                </Typography>
                <Typography variant="body1" align="center">
                  has successfully completed the course <strong>{certificate.course}</strong>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Admission Number: <strong>{certificate.admissionNumber}</strong>
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  Certificate No: {certificate.credentialID}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                  Date of Issue: {new Date(certificate.issueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Download />}
              onClick={handleDownload}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#388e3c' },
              }}
            >
              Download Certificate (PDF)
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default DownloadCertificatePage;