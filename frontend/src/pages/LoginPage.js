// frontend/src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  Container, Box, Typography, TextField, Button, Link,
  InputAdornment, IconButton, Alert, Paper, Fade
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock, School
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
      console.log('Login response:', res.data); // Debug log
      
      login(res.data); // Save to context and localStorage
      
      // Redirect based on role
      if (res.data.role === 'University') {
        console.log('Redirecting to admin dashboard');
        navigate('/admin-dashboard');
      } else if (res.data.role === 'Company') {
        console.log('Redirecting to company dashboard');
        navigate('/company-dashboard');
      } else {
        console.log('Redirecting to student register');
        navigate('/student-register');
      }
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (err.response) {
        errorMessage = err.response.data.message || 'Invalid credentials.';
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Please ensure backend is running.';
      }
      setError(errorMessage);
      console.error('Login error:', err);
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
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a237e 50%, #283593 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
            }}
          >
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

            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom align="center">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
              Sign in to access your account
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                id="password"
                autoComplete="current-password"
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
                  background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    color: 'primary.light',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Don't have an account? Register here
                </Link>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;