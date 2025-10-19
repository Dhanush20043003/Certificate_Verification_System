// frontend/src/pages/StudentDashboard.js
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Card, CardContent, Grid,
  Button, Chip, CircularProgress, Alert, Paper, Divider
} from '@mui/material';
import {
  Download, Verified, School, CalendarToday, Grade
} from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCertificates();
  }, []);

  const fetchMyCertificates = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/certificates/student?studentName=${user.name}`);
      setCertificates(data);
      setError('');
    } catch (err) {
      setError('Failed to load certificates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (pdfUrl, studentName, course) => {
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
            background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.15) 0%, rgba(92, 107, 192, 0.15) 100%)',
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
                background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <School sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Welcome, {user.name}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and download your certificates
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                {certificates.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Certificates
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Certificates List */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          My Certificates
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : certificates.length === 0 ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No certificates found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your certificates will appear here once issued
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {certificates.map((cert) => (
              <Grid item xs={12} md={6} key={cert._id}>
                <Card
                  elevation={6}
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(63, 81, 181, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        icon={<Verified />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {cert.course}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Grade fontSize="small" color="primary" />
                        <Typography variant="body2">
                          Grade: <strong>{cert.grade}</strong>
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School fontSize="small" color="primary" />
                        <Typography variant="body2" noWrap>
                          {cert.issuedBy?.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="primary" />
                        <Typography variant="body2">
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        backgroundColor: 'rgba(63, 81, 181, 0.1)',
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
                        {cert.credentialID}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleDownload(cert.pdfUrl, cert.studentName, cert.course)}
                      disabled={!cert.pdfUrl}
                      sx={{ mt: 2 }}
                    >
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default StudentDashboard;