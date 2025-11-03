// frontend/src/components/Navbar.js - FIXED (Safe user name access)
import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Avatar, Divider, ListItemIcon
} from '@mui/material';
import {
  Verified, Dashboard, Logout, HowToReg, Visibility, RocketLaunch
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Hide navigation buttons on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

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
    if (!user) return '#00baff';
    switch (user.role) {
      case 'University':
        return '#00baff';
      case 'Company':
        return '#6600ff';
      case 'Student':
        return '#00ff88';
      default:
        return '#00baff';
    }
  };

  // FIXED: Safe way to get user initial
  const getUserInitial = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(0, 10, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 186, 255, 0.2)',
        boxShadow: '0 0 30px rgba(0, 186, 255, 0.2)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
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
              width: 45,
              height: 45,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 186, 255, 0.5)',
              animation: 'glow 2s ease-in-out infinite',
            }}
          >
            <RocketLaunch sx={{ color: '#000', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#00baff',
                textShadow: '0 0 10px rgba(0, 186, 255, 0.5)',
                letterSpacing: '2px',
              }}
            >
              CERTICHAIN
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontFamily: '"Rajdhani", sans-serif',
                color: 'rgba(255, 255, 255, 0.6)',
                letterSpacing: '1px',
              }}
            >
              DIGITALLY VERIFIED
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links - Show only when NOT on auth pages */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isAuthPage && (
            <>
              {/* Register Certificate */}
              <Button
                component={RouterLink}
                to="/student-register"
                startIcon={<HowToReg />}
                sx={{
                  color: 'white',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 186, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)',
                  },
                  display: { xs: 'none', sm: 'flex' },
                  transition: 'all 0.3s ease',
                }}
              >
                REGISTER
              </Button>

              {/* View Certificate */}
              <Button
                component={RouterLink}
                to="/view-certificate"
                startIcon={<Visibility />}
                sx={{
                  color: 'white',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 186, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)',
                  },
                  display: { xs: 'none', sm: 'flex' },
                  transition: 'all 0.3s ease',
                }}
              >
                VIEW
              </Button>

              {/* Verify */}
              <Button
                component={RouterLink}
                to="/verify"
                startIcon={<Verified />}
                sx={{
                  color: 'white',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 186, 255, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                VERIFY
              </Button>
            </>
          )}

          {user ? (
            <>
              {/* Dashboard Button for Admin/Company */}
              {(user.role === 'University' || user.role === 'Company') && (
                <Button
                  onClick={handleDashboardClick}
                  startIcon={<Dashboard />}
                  sx={{
                    color: 'white',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 186, 255, 0.1)',
                      boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)',
                    },
                    display: { xs: 'none', md: 'flex' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  DASHBOARD
                </Button>
              )}

              {/* User Menu */}
              <IconButton
                onClick={handleMenu}
                sx={{
                  ml: 1,
                  border: `2px solid ${getRoleColor()}`,
                  padding: 0,
                  boxShadow: `0 0 15px ${getRoleColor()}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 25px ${getRoleColor()}80`,
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    background: `linear-gradient(135deg, ${getRoleColor()} 0%, ${getRoleColor()}CC 100%)`,
                    fontSize: '1.1rem',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {getUserInitial()}
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
                    minWidth: 240,
                    background: 'rgba(0, 10, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 186, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 186, 255, 0.2)',
                  },
                }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold"
                    sx={{ 
                      fontFamily: '"Orbitron", sans-serif',
                      color: getRoleColor(),
                    }}
                  >
                    {user.name || 'User'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontFamily: '"Rajdhani", sans-serif',
                    }}
                  >
                    {user.role || 'Student'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    display="block"
                    sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    {user.email || ''}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(0, 186, 255, 0.2)' }} />

                {/* Dashboard - Mobile */}
                {(user.role === 'University' || user.role === 'Company') && (
                  <MenuItem 
                    onClick={() => { handleDashboardClick(); handleClose(); }} 
                    sx={{ 
                      display: { md: 'none' },
                      fontFamily: '"Rajdhani", sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 186, 255, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Dashboard fontSize="small" sx={{ color: '#00baff' }} />
                    </ListItemIcon>
                    DASHBOARD
                  </MenuItem>
                )}

                {/* Logout */}
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 102, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  <Typography color="error.main" fontWeight={600}>LOGOUT</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            !isAuthPage && (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
                  color: '#000',
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  boxShadow: '0 0 20px rgba(0, 186, 255, 0.5)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #33c9ff 0%, #3388ff 100%)',
                    boxShadow: '0 0 30px rgba(0, 186, 255, 0.7)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                LOGIN
              </Button>
            )
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;