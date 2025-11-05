// frontend/src/pages/VerifyPage.js - FIXED DETAILS DISPLAY
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Card,
  CardContent, CircularProgress, Chip, Grid, Paper,
  InputAdornment, Fade, Divider
} from '@mui/material';
import {
  Search, Verified, Cancel, School, Person,
  CalendarToday, Business, Shield
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
      console.log('✓ Certificate found:', res.data);
      setCertificate(res.data);
    } catch (err) {
      console.error('✗ Verification failed:', err);
      setError(err.response?.data?.message || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
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
              background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 50px rgba(0, 186, 255, 0.6)',
              animation: 'glow 2s ease-in-out infinite',
            }}
          >
            <Shield sx={{ fontSize: 56, color: '#000' }} />
          </Box>
          <Typography 
            variant="h3" 
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 800,
              color: '#00baff',
              textShadow: '0 0 20px rgba(0, 186, 255, 0.7)',
              letterSpacing: '3px',
              mb: 1,
            }}
          >
            VERIFY CERTIFICATE
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '"Rajdhani", sans-serif',
            }}
          >
            Enter the credential ID to instantly verify authenticity
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            mb: 4,
            background: 'rgba(10, 20, 40, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 186, 255, 0.3)',
            maxWidth: 700,
            mx: 'auto',
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
          <Box component="form" onSubmit={onSearch}>
            <TextField
              fullWidth
              label="CREDENTIAL ID"
              value={credentialID}
              onChange={(e) => {
                setCredentialID(e.target.value);
                setError('');
                setSearched(false);
              }}
              placeholder="e.g., GU-1762356292086-75085560"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#00baff' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 2,
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
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'VERIFY CERTIFICATE'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
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
                      <CardContent sx={{ p: 4 }}>
                        {/* Success Header */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                          <Verified sx={{ fontSize: 80, color: '#00ff88', mb: 2 }} />
                          <Typography 
                            variant="h4" 
                            sx={{
                              fontFamily: '"Orbitron", sans-serif',
                              fontWeight: 800,
                              color: '#00ff88',
                              textShadow: '0 0 20px rgba(0, 255, 136, 0.7)',
                              letterSpacing: '2px',
                              mb: 1,
                            }}
                          >
                            CERTIFICATE VERIFIED
                          </Typography>
                          <Chip
                            label="AUTHENTIC"
                            sx={{
                              background: 'rgba(0, 255, 136, 0.2)',
                              border: '1px solid #00ff88',
                              color: '#00ff88',
                              fontFamily: '"Orbitron", sans-serif',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              px: 2,
                              py: 0.5,
                              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
                            }}
                          />
                        </Box>

                        <Divider sx={{ mb: 4, borderColor: 'rgba(0, 186, 255, 0.3)' }} />

                        {/* Certificate Details - FIXED */}
                        <Grid container spacing={3}>
                          {/* Student Name - LARGE */}
                          <Grid item xs={12}>
                            <Paper
                              sx={{
                                p: 3,
                                background: 'rgba(0, 20, 40, 0.6)',
                                border: '2px solid rgba(0, 186, 255, 0.3)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Person sx={{ fontSize: 36, color: '#00baff' }} />
                                <Box sx={{ flex: 1 }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontFamily: '"Orbitron", sans-serif',
                                      fontSize: '0.75rem',
                                      letterSpacing: '1px',
                                    }}
                                  >
                                    STUDENT NAME
                                  </Typography>
                                  <Typography 
                                    variant="h4" 
                                    sx={{
                                      fontFamily: '"Orbitron", sans-serif',
                                      fontWeight: 700,
                                      color: '#00baff',
                                      textShadow: '0 0 15px rgba(0, 186, 255, 0.5)',
                                      mt: 0.5,
                                    }}
                                  >
                                    {certificate.fullName || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Paper>
                          </Grid>

                          {/* Course */}
                          <Grid item xs={12} md={6}>
                            <Box 
                              sx={{ 
                                p: 2.5,
                                background: 'rgba(0, 20, 40, 0.4)',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 186, 255, 0.2)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <School sx={{ fontSize: 28, color: '#00baff', mt: 0.5 }} />
                                <Box>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontFamily: '"Orbitron", sans-serif',
                                      fontSize: '0.7rem',
                                      letterSpacing: '1px',
                                    }}
                                  >
                                    COURSE
                                  </Typography>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: '#ffffff',
                                      fontWeight: 600,
                                      mt: 0.5,
                                    }}
                                  >
                                    {certificate.course || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Issue Date */}
                          <Grid item xs={12} md={6}>
                            <Box 
                              sx={{ 
                                p: 2.5,
                                background: 'rgba(0, 20, 40, 0.4)',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 186, 255, 0.2)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <CalendarToday sx={{ fontSize: 28, color: '#00baff', mt: 0.5 }} />
                                <Box>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontFamily: '"Orbitron", sans-serif',
                                      fontSize: '0.7rem',
                                      letterSpacing: '1px',
                                    }}
                                  >
                                    ISSUE DATE
                                  </Typography>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: '#ffffff',
                                      fontWeight: 600,
                                      mt: 0.5,
                                    }}
                                  >
                                    {certificate.issueDate 
                                      ? new Date(certificate.issueDate).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })
                                      : 'N/A'
                                    }
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          {/* College Name */}
                          <Grid item xs={12}>
                            <Box 
                              sx={{ 
                                p: 2.5,
                                background: 'rgba(0, 20, 40, 0.4)',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 186, 255, 0.2)',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Business sx={{ fontSize: 28, color: '#00baff', mt: 0.5 }} />
                                <Box>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'rgba(255, 255, 255, 0.6)',
                                      fontFamily: '"Orbitron", sans-serif',
                                      fontSize: '0.7rem',
                                      letterSpacing: '1px',
                                    }}
                                  >
                                    COLLEGE / ISSUED BY
                                  </Typography>
                                  <Typography 
                                    variant="h6" 
                                    sx={{ 
                                      color: '#ffffff',
                                      fontWeight: 600,
                                      mt: 0.5,
                                    }}
                                  >
                                    {certificate.collegeName || 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          {/* Credential ID */}
                          <Grid item xs={12}>
                            <Paper
                              sx={{
                                p: 2.5,
                                background: 'rgba(0, 186, 255, 0.1)',
                                border: '1px solid rgba(0, 186, 255, 0.3)',
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontFamily: '"Orbitron", sans-serif',
                                  fontSize: '0.7rem',
                                  letterSpacing: '1px',
                                }}
                              >
                                CREDENTIAL ID
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontFamily: 'monospace',
                                  wordBreak: 'break-all',
                                  mt: 1,
                                  color: '#00baff',
                                  fontWeight: 600,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {certificate.credentialID || 'N/A'}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
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
                        background: 'rgba(10, 20, 40, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '2px solid rgba(255, 0, 102, 0.5)',
                        boxShadow: '0 0 50px rgba(255, 0, 102, 0.3)',
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Cancel sx={{ fontSize: 80, color: '#ff0066', mb: 2 }} />
                        <Typography 
                          variant="h4" 
                          sx={{
                            fontFamily: '"Orbitron", sans-serif',
                            fontWeight: 800,
                            color: '#ff0066',
                            letterSpacing: '2px',
                            mb: 1,
                          }}
                        >
                          CERTIFICATE NOT FOUND
                        </Typography>
                        <Chip
                          label="INVALID"
                          sx={{
                            background: 'rgba(255, 0, 102, 0.2)',
                            border: '1px solid #ff0066',
                            color: '#ff0066',
                            fontFamily: '"Orbitron", sans-serif',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            px: 2,
                            py: 0.5,
                            mb: 3,
                          }}
                        />
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {error}
                        </Typography>
                        <Divider sx={{ my: 3, borderColor: 'rgba(255, 0, 102, 0.3)' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Please verify the credential ID and try again
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
                  background: 'rgba(10, 20, 40, 0.6)',
                  border: '1px solid rgba(0, 186, 255, 0.3)',
                }}
              >
                <Shield sx={{ fontSize: 48, color: '#00baff', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Secure Verification
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
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
                  background: 'rgba(10, 20, 40, 0.6)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                }}
              >
                <Verified sx={{ fontSize: 48, color: '#00ff88', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Instant Results
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
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
                  background: 'rgba(10, 20, 40, 0.6)',
                  border: '1px solid rgba(102, 0, 255, 0.3)',
                }}
              >
                <School sx={{ fontSize: 48, color: '#6600ff', mb: 2 }} />
                <Typography 
                  variant="h6" 
                  sx={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Trusted Source
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Certificates are issued by verified educational institutions
                </Typography>
              </Card>
            </Grid>
          </Grid>
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

export default VerifyPage;