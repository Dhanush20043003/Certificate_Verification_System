// frontend/src/pages/StudentRegisterPage.js - FIXED (Removed unused import)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Alert,
  Paper, Grid, CircularProgress
} from '@mui/material';
import { HowToReg } from '@mui/icons-material';

const StudentRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    address: '',
    collegeName: '',
    course: '',
    admissionNumber: '',
    section: '',
    semester: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/certificates/register', formData);
      setMessage('Certificate registered successfully! Redirecting to view page...');
      console.log('Registration success:', res.data);
      
      setTimeout(() => {
        navigate('/view-certificate');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
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
            <HowToReg sx={{ fontSize: 40, color: '#000' }} />
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
            REGISTER CERTIFICATE
          </Typography>
          <Typography 
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '"Rajdhani", sans-serif',
            }}
          >
            Submit your details for secure verification
          </Typography>
        </Box>

        <Paper 
          elevation={12} 
          sx={{ 
            p: 4,
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
          {message && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 2,
                background: 'rgba(0, 255, 136, 0.1)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                '& .MuiAlert-icon': {
                  color: '#00ff88',
                },
              }}
            >
              {message}
            </Alert>
          )}
          
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
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  FULL NAME:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChange}
                  placeholder="Enter your full name"
                />
              </Grid>

              {/* Mobile */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  MOBILE:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="mobile"
                  value={formData.mobile}
                  onChange={onChange}
                  placeholder="Enter your mobile number"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  EMAIL:
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="Enter your email address"
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  DATE OF BIRTH:
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* College Name */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  COLLEGE NAME:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={onChange}
                  placeholder="Enter your college name"
                />
              </Grid>

              {/* Course */}
              <Grid item xs={12}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  COURSE:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="course"
                  value={formData.course}
                  onChange={onChange}
                  placeholder="Enter your course name"
                />
              </Grid>

              {/* Admission Number */}
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  ADMISSION NUMBER:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={onChange}
                  placeholder="Enter your admission number"
                />
              </Grid>

              {/* Section */}
              <Grid item xs={12} md={3}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  SECTION:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="section"
                  value={formData.section}
                  onChange={onChange}
                  placeholder="e.g., A"
                />
              </Grid>

              {/* Semester */}
              <Grid item xs={12} md={3}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  SEMESTER:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="semester"
                  value={formData.semester}
                  onChange={onChange}
                  placeholder="e.g., 6"
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00baff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    mb: 0.5,
                    letterSpacing: '1px',
                  }}
                >
                  ADDRESS:
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  placeholder="Enter your full address"
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
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
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 186, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={24} sx={{ color: '#000' }} />
                      SUBMITTING...
                    </Box>
                  ) : (
                    'SUBMIT & REGISTER'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
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

export default StudentRegisterPage;