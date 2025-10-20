// frontend/src/pages/StudentRegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Alert,
  Paper, Grid, CircularProgress
} from '@mui/material';

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
      setMessage('Certificate registered successfully! Redirecting...');
      console.log('Registration success:', res.data);
      
      setTimeout(() => {
        navigate('/download-certificate');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#8B0000', py: 6 }}>
      <Container maxWidth="md">
        <Paper elevation={12} sx={{ p: 4, backgroundColor: '#E8E8E8' }}>
          <Typography variant="h4" align="center" sx={{ color: '#8B0000', fontWeight: 'bold', mb: 4 }}>
            Register for Your Certificate
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Full Name:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' },
                      '& fieldset': { borderColor: '#555' }
                    }
                  }}
                />
              </Grid>

              {/* Mobile */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Mobile:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="mobile"
                  value={formData.mobile}
                  onChange={onChange}
                  placeholder="Enter your mobile number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Email:
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="Enter your email address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Date of Birth:
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* College Name */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  College Name:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={onChange}
                  placeholder="Enter your college name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Course */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Course:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="course"
                  value={formData.course}
                  onChange={onChange}
                  placeholder="Enter your course name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Admission Number */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Admission Number:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={onChange}
                  placeholder="Enter your admission number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Section */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Section:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="section"
                  value={formData.section}
                  onChange={onChange}
                  placeholder="Enter your section"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Semester */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Semester:
                </Typography>
                <TextField
                  fullWidth
                  required
                  name="semester"
                  value={formData.semester}
                  onChange={onChange}
                  placeholder="Enter your semester"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& input': { color: '#FFF', padding: '12px' }
                    }
                  }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#000', fontWeight: 600, mb: 0.5 }}>
                  Address:
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C2C2C',
                      '& textarea': { color: '#FFF', padding: '12px' }
                    }
                  }}
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
                    fontWeight: 'bold',
                    backgroundColor: '#8B0000',
                    '&:hover': { backgroundColor: '#660000' },
                    '&:disabled': { backgroundColor: '#999' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default StudentRegisterPage;