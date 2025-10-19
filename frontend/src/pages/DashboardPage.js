// frontend/src/pages/DashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Grid, Paper, Card, CardContent,
  TextField, Button, Alert, CircularProgress, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, InputAdornment, Fade
} from '@mui/material';
import {
  School, Add, Download, Visibility, Assessment,
  CalendarToday, Person, Grade as GradeIcon
} from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    studentName: '',
    course: '',
    grade: '',
    issueDate: '',
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get('/api/certificates/mycertificates');
      setCertificates(data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/certificates', formData);
      setMessage(`Certificate issued successfully! ID: ${res.data.credentialID}`);
      setFormData({ studentName: '', course: '', grade: '', issueDate: '' });
      fetchCertificates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue certificate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const stats = {
    total: certificates.length,
    thisMonth: certificates.filter(cert => {
      const certDate = new Date(cert.createdAt);
      const now = new Date();
      return certDate.getMonth() === now.getMonth() && 
             certDate.getFullYear() === now.getFullYear();
    }).length,
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
      <Container maxWidth="xl">
        {/* Header with Stats */}
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
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <School sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Certificate Management Portal
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card elevation={4} sx={{ backgroundColor: 'rgba(63, 81, 181, 0.2)' }}>
                    <CardContent>
                      <Assessment color="primary" sx={{ mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Certificates
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card elevation={4} sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}>
                    <CardContent>
                      <CalendarToday color="success" sx={{ mb: 1 }} />
                      <Typography variant="h4" fontWeight="bold">
                        {stats.thisMonth}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This Month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Issue Certificate Form */}
          <Grid item xs={12} lg={5}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'sticky',
                top: 20,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Add color="primary" />
                <Typography variant="h5" fontWeight="bold">
                  Issue New Certificate
                </Typography>
              </Box>

              {message && (
                <Fade in>
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
                    {message}
                  </Alert>
                </Fade>
              )}

              {error && (
                <Fade in>
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={onSubmit}>
                <TextField
                  fullWidth
                  label="Student Full Name"
                  name="studentName"
                  value={formData.studentName}
                  onChange={onChange}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Course Name"
                  name="course"
                  value={formData.course}
                  onChange={onChange}
                  required
                  placeholder="e.g., B.E. in Computer Science"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Grade or Class"
                  name="grade"
                  value={formData.grade}
                  onChange={onChange}
                  required
                  placeholder="e.g., First Class with Distinction"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GradeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={onChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Issue Certificate'
                  )}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Certificates List */}
          <Grid item xs={12} lg={7}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Issued Certificates
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : certificates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <School sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" color="text.secondary">
                    No certificates issued yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issue your first certificate using the form
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>
                          Student
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>
                          Course
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>
                          Grade
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>
                          Date
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {certificates.map((cert) => (
                        <TableRow
                          key={cert._id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {cert.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                              {cert.credentialID.substring(0, 8)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {cert.course}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={cert.grade}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Download Certificate">
                              <IconButton
                                color="primary"
                                onClick={() => handleDownload(cert.pdfUrl)}
                                disabled={!cert.pdfUrl}
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Details">
                              <IconButton color="info">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;