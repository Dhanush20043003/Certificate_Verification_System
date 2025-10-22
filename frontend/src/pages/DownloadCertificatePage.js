// frontend/src/pages/DownloadCertificatePage.js - FIXED PDF DOWNLOAD + SPACE THEME
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Alert,
  Paper, Card, CardContent, Divider, CircularProgress, Chip
} from '@mui/material';
import { Download, Verified, Search, RocketLaunch, Shield } from '@mui/icons-material';

const DownloadCertificatePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    dateOfBirth: '',
  });
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownload = async () => {
    if (!certificate?.credentialID) {
      alert('No certificate to download');
      return;
    }

    setDownloading(true);
    try {
      // Use the credential ID to download the PDF
      const response = await axios.get(
        `/api/certificates/download/${certificate.credentialID}`,
        {
          responseType: 'blob', // Important for binary data
        }
      );

      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${certificate.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✓ PDF Download successful');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 0 40px rgba(0, 186, 255, 0.6)',
              animation: 'glow 2s ease-in-out infinite',
            }}
          >
            <Download sx={{ fontSize: 40, color: '#000' }} />
          </Box>
          <Typography 
            variant="h3" 
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 800,
              color: '#00baff',
              textShadow: '0 0 20px rgba(0, 186, 255, 0.7)',
              letterSpacing: '2px',
              mb: 1,
            }}
          >
            DOWNLOAD CERTIFICATE
          </Typography>
          <Typography 
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '"Rajdhani", sans-serif',
            }}
          >
            Retrieve your verified blockchain certificate
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper 
          elevation={12} 
          sx={{ 
            p: 4, 
            mb: 4,
            background: 'rgba(10, 20, 40, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 186, 255, 0.3)',
            boxShadow: '0 0 40px rgba(0, 186, 255, 0.2)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #00baff 0%, #6600ff 50%, #00baff 100%)',
              backgroundSize: '200% 100%',
              animation: 'energy-flow 2s linear infinite',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Search sx={{ color: '#00baff', fontSize: 28 }} />
            <Typography 
              variant="h6" 
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                color: '#00baff',
                letterSpacing: '1px',
              }}
            >
              SEARCH CERTIFICATE
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                background: 'rgba(255, 0, 102, 0.1)',
                border: '1px solid rgba(255, 0, 102, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <TextField
              fullWidth
              required
              label="FULL NAME"
              name="fullName"
              value={formData.fullName}
              onChange={onChange}
              margin="normal"
              placeholder="Enter your full name"
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                },
              }}
            />

            <TextField
              fullWidth
              required
              label="ADMISSION NUMBER"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={onChange}
              margin="normal"
              placeholder="e.g., 1BC22CS012"
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                },
              }}
            />

            <TextField
              fullWidth
              required
              type="date"
              label="DATE OF BIRTH"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={onChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                },
              }}
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
                fontSize: '1.1rem',
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 700,
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
                color: '#000',
                boxShadow: '0 0 30px rgba(0, 186, 255, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #33c9ff 0%, #3388ff 100%)',
                  boxShadow: '0 0 40px rgba(0, 186, 255, 0.7)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#000' }} />
                  SEARCHING...
                </Box>
              ) : (
                'FETCH CERTIFICATE'
              )}
            </Button>
          </Box>
        </Paper>

        {/* Certificate Preview */}
        {certificate && (
          <Paper 
            elevation={12} 
            sx={{ 
              p: 4,
              background: 'rgba(10, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(0, 255, 136, 0.5)',
              boxShadow: '0 0 50px rgba(0, 255, 136, 0.3)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #00ff88 0%, #00baff 50%, #00ff88 100%)',
                backgroundSize: '200% 100%',
                animation: 'energy-flow 2s linear infinite',
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Verified sx={{ fontSize: 70, color: '#00ff88', mb: 1 }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#00ff88', 
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textShadow: '0 0 15px rgba(0, 255, 136, 0.7)',
                }}
              >
                CERTIFICATE FOUND
              </Typography>
              <Chip 
                label="VERIFIED ✓"
                sx={{
                  mt: 1,
                  background: 'rgba(0, 255, 136, 0.2)',
                  border: '1px solid #00ff88',
                  color: '#00ff88',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                }}
              />
            </Box>

            <Divider sx={{ my: 3, borderColor: 'rgba(0, 186, 255, 0.2)' }} />

            <Card 
              elevation={4} 
              sx={{ 
                mb: 3,
                background: 'rgba(0, 20, 40, 0.6)',
                border: '2px solid rgba(218, 165, 32, 0.5)',
                p: 3,
              }}
            >
              <CardContent>
                <Typography 
                  variant="h5" 
                  align="center" 
                  sx={{ 
                    color: '#DAA520',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 800,
                    mb: 1,
                    letterSpacing: '2px',
                  }}
                >
                  GALGOTIAS UNIVERSITY
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  align="center" 
                  gutterBottom
                  sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Certificate of Achievement
                </Typography>
                <Divider sx={{ my: 2, borderColor: 'rgba(218, 165, 32, 0.3)' }} />
                
                <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                  This is to certify that
                </Typography>
                <Typography 
                  variant="h4" 
                  align="center" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 700,
                    my: 2,
                    textShadow: '0 0 15px rgba(0, 186, 255, 0.5)',
                  }}
                >
                  {certificate.fullName}
                </Typography>
                <Typography variant="body1" align="center">
                  has successfully completed the course{' '}
                  <strong style={{ color: '#00baff' }}>{certificate.course}</strong>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Admission Number:{' '}
                  <strong style={{ fontFamily: 'monospace', color: '#00ff88' }}>
                    {certificate.admissionNumber}
                  </strong>
                </Typography>
                <Divider sx={{ my: 2, borderColor: 'rgba(218, 165, 32, 0.3)' }} />
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}>
                  <Typography variant="caption">
                    Certificate No: {certificate.credentialID?.substring(0, 15)}...
                  </Typography>
                  <Typography variant="caption">
                    Issue Date: {new Date(certificate.issueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={downloading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : <Download />}
              onClick={handleDownload}
              disabled={downloading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 700,
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #00ff88 0%, #00baff 100%)',
                color: '#000',
                boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #33ffaa 0%, #33c9ff 100%)',
                  boxShadow: '0 0 40px rgba(0, 255, 136, 0.7)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(0, 255, 136, 0.2)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {downloading ? 'DOWNLOADING...' : 'DOWNLOAD CERTIFICATE (PDF)'}
            </Button>

            {/* Security Note */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                background: 'rgba(0, 186, 255, 0.1)',
                border: '1px solid rgba(0, 186, 255, 0.3)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Shield sx={{ color: '#00baff', fontSize: 28 }} />
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    display: 'block',
                  }}
                >
                  BLOCKCHAIN SECURED
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  This certificate is cryptographically verified and tamper-proof
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>

      <style>
        {`
          @keyframes energy-flow {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default DownloadCertificatePage;