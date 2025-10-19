// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Avatar, Divider, ListItemIcon
} from '@mui/material';
import {
  School, Verified, Dashboard, Logout, Person,
  Business, Menu as MenuIcon
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

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'University':
        return '/dashboard';
      case 'Student':
        return '/student-dashboard';
      case 'Company':
        return '/company-dashboard';
      default:
        return '/';
    }
  };

  const getRoleIcon = () => {
    if (!user) return <Person />;
    switch (user.role) {
      case 'University':
        return <School />;
      case 'Student':
        return <Person />;
      case 'Company':
        return <Business />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = () => {
    if (!user) return 'default';
    switch (user.role) {
      case 'University':
        return '#3f51b5';
      case 'Student':
        return '#4caf50';
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
        backgroundColor: 'rgba(10, 14, 39, 0.95)',
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
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ 
                lineHeight: 1.2,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              CertiChain
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              Blockchain Certificate Verification
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Verify Button - Always Visible */}
          <Button
            component={RouterLink}
            to="/verify"
            startIcon={<Verified />}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Verify
          </Button>

          {user ? (
            <>
              {/* Dashboard Button */}
              <Button
                component={RouterLink}
                to={getDashboardRoute()}
                startIcon={<Dashboard />}
                sx={{
                  color: 'white',
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Dashboard
              </Button>

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
                    backgroundColor: 'rgba(26, 35, 126, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    {getRoleIcon()}
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Dashboard Link - Mobile */}
                <MenuItem
                  component={RouterLink}
                  to={getDashboardRoute()}
                  onClick={handleClose}
                  sx={{ display: { sm: 'none' } }}
                >
                  <ListItemIcon>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>

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
                background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)',
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