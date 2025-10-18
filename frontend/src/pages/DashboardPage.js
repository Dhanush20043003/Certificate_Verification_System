// src/pages/DashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Box, Typography } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import IssueCertificateForm from '../components/IssueCertificateForm';
import CertificateList from '../components/CertificateList';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch the list of certificates from the server
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

  // This runs once when the page first loads
  useEffect(() => {
    fetchCertificates();
  }, []);

  // This function is passed to the form, which calls it after a new certificate is made
  const handleCertificateIssued = () => {
    fetchCertificates(); // Re-fetches the list to get the new data
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome, {user ? user.name : 'Guest'}!
        </Typography>

        {/* The form gets the handler function as a prop */}
        <IssueCertificateForm onCertificateIssued={handleCertificateIssued} />
        
        {/* The list gets the certificate data and loading state as props */}
        <CertificateList certificates={certificates} loading={loading} />
      </Box>
    </Container>
  );
};

export default DashboardPage;