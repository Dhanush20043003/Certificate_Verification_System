// src/components/CertificateList.js
import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

// It receives the 'certificates' and 'loading' state as props
const CertificateList = ({ certificates, loading }) => {

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '2rem auto' }} />;
  }

  return (
    <Box sx={{ marginTop: 4, width: '100%' }}>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Previously Issued Certificates
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Credential ID</TableCell>
              <TableCell align="center">Certificate PDF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.length > 0 ? (
              certificates.map((cert) => (
                <TableRow key={cert._id}>
                  <TableCell>{cert.studentName}</TableCell>
                  <TableCell>{cert.course}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{cert.credentialID}</TableCell>
                  <TableCell align="center">
                    {cert.pdfUrl ? (
                      <Button variant="outlined" startIcon={<DownloadIcon />} component="a" href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                        Download
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">N/A</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">No certificates issued yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CertificateList;