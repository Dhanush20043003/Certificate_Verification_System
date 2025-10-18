// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Link,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Student' }); // Added role to state
  const navigate = useNavigate();
  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the selected role to the backend
      await axios.post('/api/users/register', { name, email, password, role });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response ? err.response.data.message : 'Cannot connect to server.';
      alert('Error: ' + errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ /* ... your existing styling ... */ }}>
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined" margin="normal" required fullWidth
            label={role === 'University' ? 'University Name' : 'Full Name'} // Dynamic label
            name="name" autoFocus value={name} onChange={onChange}
          />
          <TextField
            variant="outlined" margin="normal" required fullWidth
            label="Email Address" name="email" value={email} onChange={onChange}
          />
          <TextField
            variant="outlined" margin="normal" required fullWidth
            name="password" label="Password" type="password" value={password} onChange={onChange}
          />
          {/* --- ROLE SELECTOR --- */}
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">I am a:</FormLabel>
            <RadioGroup row name="role" value={role} onChange={onChange}>
              <FormControlLabel value="Student" control={<Radio />} label="Student" />
              <FormControlLabel value="Company" control={<Radio />} label="Company" />
              <FormControlLabel value="University" control={<Radio />} label="University (Admin)" />
            </RadioGroup>
          </FormControl>
          {/* --- END ROLE SELECTOR --- */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            {"Already have an account? Login"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;