// frontend/src/components/Navbar.js - COMPLETE FIXED VERSION
import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Avatar, Divider, ListItemIcon
} from '@mui/material';
import {
  School, Verified, Dashboard, Logout, HowToReg, Download
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (user) {
      if (user.role === 'University') {
        navigate('/admin-dashboard');
      } else if (user.role === 'Company') {
        navigate('/company-dashboard');
      }
    }
  };

  const getRoleColor = () => {
    if (!user) return '#757575';
    switch (user.role) {
      case 'University':
        return '#3f51b5';
      case 'Company':
        return '#ff4081';
      default:
        return '#757575';
    }
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: 'rgba(139, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo & Title */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ color: '#8B0000' }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ lineHeight: 1.2 }}
            >
              CertiChain
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Certificate Verification
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Register Certificate */}
          <Button
            component={RouterLink}
            to="/student-register"
            startIcon={<HowToReg />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Register
          </Button>

          {/* Download */}
          <Button
            component={RouterLink}
            to="/download-certificate"
            startIcon={<Download />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Download
          </Button>

          {/* Verify */}
          <Button
            component={RouterLink}
            to="/verify"
            startIcon={<Verified />}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Verify
          </Button>

          {user ? (
            <>
              {/* Dashboard Button for Admin/Company */}
              {(user.role === 'University' || user.role === 'Company') && (
                <Button
                  onClick={handleDashboardClick}
                  startIcon={<Dashboard />}
                  sx={{
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    display: { xs: 'none', md: 'flex' }
                  }}
                >
                  Dashboard
                </Button>
              )}

              {/* User Menu */}
              <IconButton
                onClick={handleMenu}
                sx={{
                  ml: 1,
                  border: `2px solid ${getRoleColor()}`,
                  padding: 0,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: getRoleColor(),
                    fontSize: '1rem',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    backgroundColor: 'rgba(139, 0, 0, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {user.email}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Dashboard - Mobile */}
                {(user.role === 'University' || user.role === 'Company') && (
                  <MenuItem onClick={() => { handleDashboardClick(); handleClose(); }} sx={{ display: { md: 'none' } }}>
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                )}

                {/* Logout */}
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error.main">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #DAA520 0%, #FFD700 100%)',
                color: '#8B0000',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;