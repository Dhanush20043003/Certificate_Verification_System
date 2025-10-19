// frontend/src/pages/VerifyPage.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Card,
  CardContent, CircularProgress, Chip, Grid, Paper,
  InputAdornment, Fade, Divider
} from '@mui/material';
import {
  Search, Verified, Cancel, School, Person,
  CalendarToday, Grade, Business, Download, Shield
} from '@mui/icons-material';

const VerifyPage = () => {
  const [credentialID, setCredentialID] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const onSearch = async (e) => {
    e.preventDefault();
    if (!credentialID.trim()) {
      setError('Please enter a credential ID');
      return;
    }

    setLoading(true);
    setCertificate(null);
    setError('');
    setSearched(true);

    try {
      const res = await axios.get(`/api/certificates/verify/${credentialID}`);
      setCertificate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a237e 100%)',
        pt: 8,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 40px rgba(63, 81, 181, 0.4)',
            }}
          >
            <Shield sx={{ fontSize: 56, color: 'white' }} />
          </Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Verify Certificate
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Enter the credential ID to instantly verify the authenticity of any certificate
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Box component="form" onSubmit={onSearch}>
            <TextField
              fullWidth
              label="Enter Credential ID"
              value={credentialID}
              onChange={(e) => {
                setCredentialID(e.target.value);
                setError('');
                setSearched(false);
              }}
              placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Certificate'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              The credential ID can be found on the certificate document
            </Typography>
          </Box>
        </Paper>

        {/* Results */}
        {searched && !loading && (
          <Fade in timeout={600}>
            <Box>
              {certificate ? (
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} md={10} lg={8}>
                    <Card
                      elevation={12}
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        border: '2px solid #4caf50',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        {/* Success Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                          <Verified sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                          <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
                            Certificate Verified
                          </Typography>
                          <Chip
                            label="AUTHENTIC"
                            color="success"
                            sx={{ fontSize: '1rem', px: 2, py: 0.5 }}
                          />
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Certificate Details */}
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Paper
                              sx={{
                                p: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Person sx={{ fontSize: 28, color: 'primary.main' }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Student Name
                                  </Typography>
                                  <Typography variant="h5" fontWeight="bold">
                                    {certificate.studentName}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <School sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Course
                                </Typography>
                                <Typography variant="h6">
                                  {certificate.course}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <Grade sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Grade
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  {certificate.grade}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <CalendarToday sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Issue Date
                                </Typography>
                                <Typography variant="h6">
                                  {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                              <Business sx={{ fontSize: 24, color: 'primary.main', mt: 0.5 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Issued By
                                </Typography>
                                <Typography variant="h6">
                                  {certificate.issuedBy?.name}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Paper
                              sx={{
                                p: 2,
                                backgroundColor: 'rgba(63, 81, 181, 0.1)',
                                border: '1px solid rgba(63, 81, 181, 0.3)',
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                Credential ID
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  wordBreak: 'break-all',
                                  mt: 0.5,
                                }}
                              >
                                {certificate.credentialID}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>

                        {certificate.pdfUrl && (
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<Download />}
                            onClick={() => handleDownload(certificate.pdfUrl)}
                            sx={{
                              mt: 4,
                              py: 1.5,
                              fontSize: '1.1rem',
                              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                            }}
                          >
                            Download Certificate
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : error && (
                <Grid container spacing={4} justifyContent="center">
                  <Grid item xs={12} md={8} lg={6}>
                    <Card
                      elevation={12}
                      sx={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        border: '2px solid #f44336',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="error.main" gutterBottom>
                          Certificate Not Found
                        </Typography>
                        <Chip
                          label="INVALID"
                          color="error"
                          sx={{ fontSize: '1rem', px: 2, py: 0.5, mb: 3 }}
                        />
                        <Typography variant="body1" color="text.secondary" paragraph>
                          {error}
                        </Typography>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="body2" color="text.secondary">
                          Please verify the credential ID and try again. If you believe this is an error, 
                          contact the issuing institution.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Fade>
        )}

        {/* Info Section */}
        {!searched && (
          <Grid container spacing={3} sx={{ mt: 6 }}>
            <Grid item xs={12} md={4}>
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'rgba(63, 81, 181, 0.1)',
                  border: '1px solid rgba(63, 81, 181, 0.3)',
                }}
              >
                <Shield sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Secure Verification
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All certificates are cryptographically secured and instantly verifiable
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                }}
              >
                <Verified sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Instant Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get verification results in seconds with detailed certificate information
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                }}
              >
                <School sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Trusted Source
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Certificates are issued by verified educational institutions
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default VerifyPage;