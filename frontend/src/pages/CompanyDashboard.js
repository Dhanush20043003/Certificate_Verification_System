// frontend/src/pages/CompanyDashboard.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, TextField, Button, Card,
  CardContent, Grid, Alert, Chip, CircularProgress, Paper,
  Divider, InputAdornment
} from '@mui/material';
import {
  Search, Verified, Cancel, Download, Business,
  School, CalendarToday, Grade, Person
} from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const CompanyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [credentialID, setCredentialID] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!credentialID.trim()) {
      setError('Please enter a credential ID');
      return;
    }

    setLoading(true);
    setCertificate(null);
    setError('');

    try {
      const { data } = await axios.get(`/api/certificates/verify/${credentialID}`);
      setCertificate(data);
      
      // Add to search history
      setSearchHistory(prev => [
        {
          id: data.credentialID,
          studentName: data.studentName,
          course: data.course,
          timestamp: new Date(),
          verified: true
        },
        ...prev.slice(0, 4) // Keep last 5 searches
      ]);
    } catch (err) {
      setError(err.response?.data?.message || 'Certificate not found');
      setSearchHistory(prev => [
        {
          id: credentialID,
          timestamp: new Date(),
          verified: false
        },
        ...prev.slice(0, 4)
      ]);
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
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, rgba(255, 64, 129, 0.15) 0%, rgba(197, 17, 98, 0.15) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Business sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verify candidate certificates instantly
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          {/* Verification Panel */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Verify Certificate
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enter the credential ID to verify authenticity
              </Typography>

              <Box component="form" onSubmit={handleVerify}>
                <TextField
                  fullWidth
                  label="Credential ID"
                  value={credentialID}
                  onChange={(e) => setCredentialID(e.target.value)}
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
                    background: 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Certificate'}
                </Button>
              </Box>

              {/* Recent Searches */}
              {searchHistory.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Recent Verifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {searchHistory.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {item.id.substring(0, 20)}...
                          </Typography>
                          {item.studentName && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {item.studentName}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          size="small"
                          icon={item.verified ? <Verified /> : <Cancel />}
                          label={item.verified ? 'Valid' : 'Invalid'}
                          color={item.verified ? 'success' : 'error'}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} md={6}>
            {certificate ? (
              <Card
                elevation={8}
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  border: '2px solid #4caf50',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Verified sx={{ fontSize: 48, color: 'success.main' }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        Certificate Verified
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This certificate is authentic
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Student Name
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {certificate.studentName}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <School color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Course
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {certificate.course}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Grade color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Grade
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {certificate.grade}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarToday color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Issue Date
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Business color="primary" />
                        <Typography variant="caption" color="text.secondary">
                          Issued By
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {certificate.issuedBy?.name}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 1,
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
                        fontSize: '0.75rem',
                      }}
                    >
                      {certificate.credentialID}
                    </Typography>
                  </Box>

                  {certificate.pdfUrl && (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownload(certificate.pdfUrl)}
                      sx={{
                        mt: 3,
                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                      }}
                    >
                      Download Certificate
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : error ? (
              <Card
                elevation={8}
                sx={{
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  border: '2px solid #f44336',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Cancel sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                  <Typography variant="h5" fontWeight="bold" color="error.main" gutterBottom>
                    Certificate Not Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {error}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Please verify the credential ID and try again
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Search sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" color="text.secondary">
                  Enter a credential ID to verify
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Results will appear here
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CompanyDashboard;