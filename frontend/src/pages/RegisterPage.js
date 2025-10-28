// frontend/src/pages/RegisterPage.js - UNIVERSITY REMOVED FROM REGISTRATION
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Link,
  Paper, Fade, Alert, InputAdornment, IconButton,
  ToggleButtonGroup, ToggleButton, Card, CardContent
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock, Person,
  School, Business, CheckCircle
} from '@mui/icons-material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student'  // Default to Student since University is removed
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setFormData({ ...formData, role: newRole });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/users/register', { name, email, password, role });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response 
        ? err.response.data.message 
        : 'Cannot connect to server.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Only Student and Company roles
  const roleInfo = {
    Student: {
      icon: <Person sx={{ fontSize: 40 }} />,
      color: '#4caf50',
      description: 'View, verify, and download your certificates',
      features: ['View certificates', 'Download PDFs', 'Verify authenticity']
    },
    Company: {
      icon: <Business sx={{ fontSize: 40 }} />,
      color: '#ff4081',
      description: 'Verify candidate certificates instantly',
      features: ['Verify certificates', 'Download PDFs', 'View candidate details']
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a237e 50%, #283593 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 80% 50%, rgba(63, 81, 181, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container component="main" maxWidth="md">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 24px rgba(63, 81, 181, 0.4)',
                }}
              >
                <School sx={{ fontSize: 40, color: 'white' }} />
              </Box>

              <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join our certificate verification platform
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Role Selection - ONLY STUDENT AND COMPANY */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                I am registering as:
              </Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={handleRoleChange}
                fullWidth
                sx={{
                  '& .MuiToggleButton-root': {
                    py: 2,
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(63, 81, 181, 0.2)',
                      borderColor: roleInfo[role]?.color,
                      '&:hover': {
                        backgroundColor: 'rgba(63, 81, 181, 0.3)',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="Student">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Person />
                    <Typography variant="body2">Student</Typography>
                  </Box>
                </ToggleButton>
                <ToggleButton value="Company">
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Business />
                    <Typography variant="body2">Company</Typography>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>

              {/* Role Info Card */}
              <Card
                sx={{
                  mt: 2,
                  backgroundColor: `${roleInfo[role].color}15`,
                  border: `1px solid ${roleInfo[role].color}40`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ color: roleInfo[role].color }}>
                      {roleInfo[role].icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {role} Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {roleInfo[role].description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    {roleInfo[role].features.map((feature, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 16, color: roleInfo[role].color }} />
                        <Typography variant="caption">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={onSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                autoFocus
                value={name}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: `linear-gradient(135deg, ${roleInfo[role].color} 0%, ${roleInfo[role].color}CC 100%)`,
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: 'primary.light',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Already have an account? Login here
                </Link>
              </Box>
            </Box>

            {/* Admin Note */}
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                University admins should use the dedicated admin login credentials
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default RegisterPage;