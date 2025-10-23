// frontend/src/pages/AdminDashboard.js - CERTIFICATE ID COLUMN (NO DOWNLOAD)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip,
  CircularProgress, IconButton, Tooltip, TextField, InputAdornment
} from '@mui/material';
import {
  Verified, Search, CheckCircle, School, ContentCopy
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState('');

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

  const handleCopyCredentialID = (credentialID) => {
    navigator.clipboard.writeText(credentialID);
    setCopiedId(credentialID);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const stats = {
    total: certificates.length,
    verified: certificates.filter(c => c.isVerified).length,
    pending: certificates.filter(c => !c.isVerified).length,
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper elevation={8} sx={{ p: 4, mb: 4, background: 'rgba(10, 20, 40, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 186, 255, 0.3)', boxShadow: '0 0 40px rgba(0, 186, 255, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0, 186, 255, 0.5)' }}>
              <School sx={{ fontSize: 32, color: '#000' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, color: '#00baff', letterSpacing: '2px' }}>
                ADMIN DASHBOARD
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Certificate Management System
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, color: '#00baff' }}>{stats.total}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Total Certificates</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, color: '#00ff88' }}>{stats.verified}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Verified</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, color: '#ffaa00' }}>{stats.pending}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Pending Verification</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Search */}
        <Paper elevation={6} sx={{ p: 3, mb: 3, background: 'rgba(10, 20, 40, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 186, 255, 0.3)' }}>
          <TextField 
            fullWidth 
            placeholder="Search by name, admission number, or course..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ 
              startAdornment: (<InputAdornment position="start"><Search sx={{ color: '#00baff' }} /></InputAdornment>) 
            }}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: '"Orbitron", sans-serif',
              },
            }}
          />
        </Paper>

        {/* Table */}
        <Paper elevation={6} sx={{ background: 'rgba(10, 20, 40, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 186, 255, 0.3)' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 700, color: '#00baff' }}>
              ALL CERTIFICATES
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#00baff' }} />
            </Box>
          ) : filteredCerts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <School sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {certificates.length === 0 ? 'No certificates registered yet' : 'No results found'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1 }}>
                {certificates.length === 0 ? 'Students can register at /student-register' : 'Try different search terms'}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Admission No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>College</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Issue Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', background: 'rgba(0, 20, 40, 0.9)', color: '#00baff', borderBottom: '2px solid rgba(0, 186, 255, 0.3)' }}>Certificate ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCerts.map((cert) => (
                    <TableRow key={cert._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 186, 255, 0.05)' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{cert.fullName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{cert.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#00ff88' }}>
                          {cert.admissionNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{cert.course}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
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
                          <Chip icon={<CheckCircle />} label="VERIFIED" size="small" sx={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', border: '1px solid #00ff88', fontFamily: '"Orbitron", sans-serif', fontWeight: 600 }} />
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label="PENDING" size="small" sx={{ background: 'rgba(255, 170, 0, 0.2)', color: '#ffaa00', border: '1px solid #ffaa00', fontFamily: '"Orbitron", sans-serif', fontWeight: 600 }} />
                            <Tooltip title="Mark as Verified">
                              <IconButton size="small" onClick={() => handleVerify(cert._id)} sx={{ color: '#00ff88', '&:hover': { background: 'rgba(0, 255, 136, 0.1)' } }}>
                                <Verified />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontFamily: 'monospace', 
                              color: '#00baff',
                              maxWidth: '150px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cert.credentialID}
                          </Typography>
                          <Tooltip title={copiedId === cert.credentialID ? "Copied!" : "Copy Certificate ID"}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleCopyCredentialID(cert.credentialID)}
                              sx={{ 
                                color: copiedId === cert.credentialID ? '#00ff88' : '#00baff',
                                '&:hover': { 
                                  background: 'rgba(0, 186, 255, 0.1)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
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