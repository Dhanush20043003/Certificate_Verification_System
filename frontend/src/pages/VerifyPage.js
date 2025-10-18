// src/pages/VerifyPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, TextField, Button, CircularProgress, Card, CardContent, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel'; // This is now used

const VerifyPage = () => {
  const [credentialID, setCredentialID] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Track if a search has been performed

  const onSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCertificate(null);
    setError('');
    setSearched(true); // Mark that a search was made

    try {
      const res = await axios.get(`/api/certificates/verify/${credentialID}`);
      setCertificate(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 8, textAlign: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Verify Certificate Authenticity
        </Typography>
        <Box component="form" onSubmit={onSearch} sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <TextField
            variant="outlined"
            label="Enter Credential ID"
            value={credentialID}
            onChange={(e) => setCredentialID(e.target.value)}
            required
            sx={{ width: '400px' }}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
          </Button>
        </Box>

        {/* --- IMPROVED RESULT DISPLAY --- */}
        {searched && !loading && (
          <>
            {certificate && (
              <Card sx={{ mt: 4, textAlign: 'left', backgroundColor: 'rgba(0, 200, 83, 0.1)', border: '1px solid #00c853' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" color="success.main">Certificate Verified</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {/* ... (Grid items for student details remain the same) ... */}
                    <Grid item xs={12} sm={6}><Typography><strong>Student Name:</strong></Typography><Typography variant="h6">{certificate.studentName}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><strong>Course:</strong></Typography><Typography variant="h6">{certificate.course}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><strong>Grade:</strong></Typography><Typography variant="h6">{certificate.grade}</Typography></Grid>
                    <Grid item xs={12} sm={6}><Typography><strong>Issue Date:</strong></Typography><Typography variant="h6">{new Date(certificate.issueDate).toLocaleDateString()}</Typography></Grid>
                    <Grid item xs={12}><Typography><strong>Issued By:</strong></Typography><Typography variant="h6">{certificate.issuedBy.name}</Typography></Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            {error && (
              <Card sx={{ mt: 4, textAlign: 'left', backgroundColor: 'rgba(211, 47, 47, 0.1)', border: '1px solid #d32f2f' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CancelIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h5" color="error.main">Certificate Invalid</Typography>
                      <Typography variant="body1">{error}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default VerifyPage;