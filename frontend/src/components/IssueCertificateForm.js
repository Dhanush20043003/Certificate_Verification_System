// src/components/IssueCertificateForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

// The component now accepts a prop called 'onCertificateIssued'
const IssueCertificateForm = ({ onCertificateIssued }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    grade: '',
    issueDate: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post('/api/certificates', formData);
      setMessage(`Success! Certificate issued with ID: ${res.data.credentialID}`);
      setFormData({ studentName: '', course: '', grade: '', issueDate: '' });
      
      // After success, call the function to tell the Dashboard to refresh the list
      onCertificateIssued(); 
    } catch (err) {
      setError(err.response.data.message || 'Something went wrong!');
    }
  };

  return (
    <Box sx={{
        marginTop: 4, padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', width: '100%', maxWidth: '600px',
      }}
    >
      <Typography component="h2" variant="h5" align="center">
        Issue a New Certificate
      </Typography>
      <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 2 }}>
        <TextField margin="normal" required fullWidth label="Student Full Name" name="studentName" value={formData.studentName} onChange={onChange}/>
        <TextField margin="normal" required fullWidth label="Course Name (e.g., B.E. in Computer Science)" name="course" value={formData.course} onChange={onChange}/>
        <TextField margin="normal" required fullWidth label="Grade or Class (e.g., First Class with Distinction)" name="grade" value={formData.grade} onChange={onChange}/>
        <TextField margin="normal" required fullWidth label="Issue Date" name="issueDate" type="date" InputLabelProps={{ shrink: true }} value={formData.issueDate} onChange={onChange}/>
        <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2 }}>Issue Certificate</Button>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Box>
  );
};

export default IssueCertificateForm;