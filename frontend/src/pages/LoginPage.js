// frontend/src/pages/LoginPage.js - ROLE-BASED REDIRECT AFTER LOGIN
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  Container, Box, Typography, TextField, Button, Link,
  InputAdornment, IconButton, Alert, Paper, Fade, Chip
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock, RocketLaunch, Stars
} from '@mui/icons-material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/users/login', { email, password });
      console.log('✓ Login successful:', res.data);
      
      login(res.data);
      
      // 🔹 ROLE-BASED REDIRECT
      if (res.data.role === 'University') {
        console.log('→ Redirecting to Admin Dashboard');
        navigate('/admin-dashboard');
      } else if (res.data.role === 'Company') {
        console.log('→ Redirecting to Company Dashboard');
        navigate('/company-dashboard');
      } else if (res.data.role === 'Student') {
        console.log('→ Redirecting to View Certificate');
        navigate('/view-certificate');
      } else {
        // Fallback
        navigate('/verify');
      }
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (err.response) {
        errorMessage = err.response.data.message || 'Invalid credentials.';
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Please ensure backend is running.';
      }
      setError(errorMessage);
      console.error('✗ Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 186, 255, 0.15) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 0, 255, 0.15) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '2s',
          zIndex: 0,
        }}
      />

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              background: 'rgba(10, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 186, 255, 0.3)',
              borderRadius: 4,
              boxShadow: '0 0 40px rgba(0, 186, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
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
            {/* Logo and Title */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 0 40px rgba(0, 186, 255, 0.6)',
                  animation: 'glow 2s ease-in-out infinite',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2px solid rgba(0, 186, 255, 0.3)',
                    animation: 'pulse-ring 2s ease-out infinite',
                  },
                }}
              >
                <RocketLaunch sx={{ fontSize: 45, color: '#000' }} />
              </Box>

              <Typography 
                component="h1" 
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
                CERTICHAIN
              </Typography>

              <Chip 
                icon={<Stars sx={{ color: '#00baff !important' }} />}
                label="VERIFIED"
                sx={{
                  background: 'rgba(0, 186, 255, 0.1)',
                  border: '1px solid rgba(0, 186, 255, 0.3)',
                  color: '#00baff',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}
              />
            </Box>

            <Typography 
              variant="h5" 
              align="center"
              sx={{
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 600,
                mb: 1,
              }}
            >
              WELCOME BACK
            </Typography>
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                mb: 3,
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              Sign in to access your secure portal
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  background: 'rgba(255, 0, 102, 0.1)',
                  border: '1px solid rgba(255, 0, 102, 0.3)',
                  '& .MuiAlert-icon': {
                    color: '#ff0066',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="EMAIL ADDRESS"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#00baff' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: '0.85rem',
                    letterSpacing: '1px',
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="PASSWORD"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#00baff' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            color: '#00baff',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
                  color: '#000',
                  boxShadow: '0 0 30px rgba(0, 186, 255, 0.5)',
                  position: 'relative',
                  overflow: 'hidden',
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
                {loading ? 'INITIATING...' : 'SIGN IN'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    color: '#00baff',
                    textDecoration: 'none',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      textShadow: '0 0 10px rgba(0, 186, 255, 0.8)',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Don't have an account? Register here →
                </Link>
              </Box>
            </Box>

            {/* Security Badge */}
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: '1px solid rgba(0, 186, 255, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'rgba(0, 255, 136, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #00ff88',
                  boxShadow: '0 0 15px rgba(0, 255, 136, 0.5)',
                }}
              >
                <Lock sx={{ fontSize: 16, color: '#00ff88' }} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: '"Rajdhani", sans-serif',
                  letterSpacing: '0.5px',
                }}
              >
                256-BIT ENCRYPTED CONNECTION
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <style>
        {`
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

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

export default LoginPage;