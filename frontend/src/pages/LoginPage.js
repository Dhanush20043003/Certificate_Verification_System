// src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Import MUI components
import { Container, Box, Typography, TextField, Button, Link } from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      // --- START: UPDATED ERROR HANDLING ---
      let errorMessage = 'An unexpected error occurred.';
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data.message || 'Invalid credentials.';
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please ensure the backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = err.message;
      }
      console.error('Login Error:', err);
      alert('Error: ' + errorMessage);
      // --- END: UPDATED ERROR HANDLING ---
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // --- UPDATED STYLES START ---
          backgroundColor: 'rgba(255, 255, 255, 0.05)', // Semi-transparent white
          backdropFilter: 'blur(10px)', // The "frosty glass" effect
          padding: 4,
          borderRadius: 4, // More rounded corners
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          // --- UPDATED STYLES END ---
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {/* The rest of your form remains the same */}
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
         {/* ...TextFields, Button, etc... */}
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Link component={RouterLink} to="/register" variant="body2">
            {"Don't have an account? Register here"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;