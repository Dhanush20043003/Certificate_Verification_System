// frontend/src/pages/AdminDashboard.js - COMPLETE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, IconButton, Tooltip, TextField, InputAdornment
} from '@mui/material';
import {
  Download, Verified, Search, CheckCircle, School
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllCertificates();
  }, []);

  useEffect(() => {
    const filtered = certificates.filter(cert => {
      const search = searchTerm.toLowerCase();
      const name = (cert.fullName || '').toLowerCase();
      const admission = (cert.admissionNumber || '').toLowerCase();
      const course = (cert.course || '').toLowerCase();
      
      return name.includes(search) || admission.includes(search) || course.includes(search);
    });
    setFilteredCerts(filtered);
  }, [searchTerm, certificates]);

  const fetchAllCertificates = async () => {
    try {
      console.log('Fetching all certificates...');
      const { data } = await axios.get('/api/certificates/all');
      console.log('Certificates received:', data.length);
      setCertificates(data);
      setFilteredCerts(data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      if (error.response?.status === 401) {
        alert('Please login as University admin');
      } else {
        alert('Failed to load certificates');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.put(`/api/certificates/verify-status/${id}`);
      alert('Certificate verified!');
      fetchAllCertificates();
    } catch (error) {
      alert('Failed to verify');
    }
  };

  const handleDownload = (pdfUrl, studentName) => {
    if (pdfUrl) {
      console.log('Downloading:', pdfUrl);
      window.open(pdfUrl, '_blank');
    } else {
      alert('PDF not available for ' + studentName);
    }
  };

  const stats = {
    total: certificates.length,
    verified: certificates.filter(c => c.isVerified).length,
    pending: certificates.filter(c => !c.isVerified).length,
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #1a237e 100%)', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={8} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.15) 0%, rgba(92, 107, 192, 0.15) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <School sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
              <Typography variant="body1" color="text.secondary">Certificate Management System</Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="primary.main">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Certificates</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="success.main">{stats.verified}</Typography>
              <Typography variant="body2" color="text.secondary">Verified</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight="bold" color="warning.main">{stats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Verification</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Search */}
        <Paper elevation={6} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
          <TextField 
            fullWidth 
            placeholder="Search by name, admission number, or course..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ 
              startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) 
            }} 
          />
        </Paper>

        {/* Table */}
        <Paper elevation={6} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold">All Certificates</Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : filteredCerts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <School sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {certificates.length === 0 ? 'No certificates registered yet' : 'No results found'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {certificates.length === 0 ? 'Students can register at /student-register' : 'Try different search terms'}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>Admission No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>College</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>Issue Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'rgba(63, 81, 181, 0.1)' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCerts.map((cert) => (
                    <TableRow key={cert._id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{cert.fullName}</Typography>
                        <Typography variant="caption" color="text.secondary">{cert.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {cert.admissionNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{cert.course}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sem {cert.semester} | Sec {cert.section}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{cert.collegeName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {cert.isVerified ? (
                          <Chip icon={<CheckCircle />} label="Verified" color="success" size="small" />
                        ) : (
                          <Chip label="Pending" color="warning" size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          {!cert.isVerified && (
                            <Tooltip title="Mark as Verified">
                              <IconButton color="success" size="small" onClick={() => handleVerify(cert._id)}>
                                <Verified />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={cert.pdfUrl ? "Download PDF" : "PDF Not Available"}>
                            <span>
                              <IconButton 
                                color="primary" 
                                size="small"
                                onClick={() => handleDownload(cert.pdfUrl, cert.fullName)} 
                                disabled={!cert.pdfUrl}
                              >
                                <Download />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;