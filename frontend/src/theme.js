// frontend/src/theme.js - SPACE THEME
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00baff',
      light: '#33c9ff',
      dark: '#0088cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#6600ff',
      light: '#8833ff',
      dark: '#4400cc',
    },
    success: {
      main: '#00ff88',
      light: '#33ffaa',
      dark: '#00cc66',
    },
    error: {
      main: '#ff0066',
      light: '#ff3388',
      dark: '#cc0044',
    },
    warning: {
      main: '#ffaa00',
      light: '#ffbb33',
      dark: '#cc8800',
    },
    info: {
      main: '#0066ff',
      light: '#3388ff',
      dark: '#0044cc',
    },
    background: {
      default: '#000000',
      paper: 'rgba(10, 20, 40, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Rajdhani", "Orbitron", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '2px',
      textShadow: '0 0 20px rgba(0, 186, 255, 0.5)',
    },
    h2: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '2.75rem',
      letterSpacing: '1.5px',
    },
    h3: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '2.25rem',
      letterSpacing: '1px',
    },
    h4: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '1.875rem',
      letterSpacing: '0.5px',
    },
    h5: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 400,
      fontSize: '1.1rem',
    },
    body2: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
    },
    button: {
      fontFamily: '"Orbitron", sans-serif',
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 0 10px rgba(0, 186, 255, 0.2)',
    '0 0 20px rgba(0, 186, 255, 0.3)',
    '0 0 30px rgba(0, 186, 255, 0.4)',
    '0 0 40px rgba(0, 186, 255, 0.5)',
    '0 0 50px rgba(0, 186, 255, 0.6)',
    '0 0 60px rgba(0, 186, 255, 0.7)',
    '0 0 70px rgba(0, 186, 255, 0.8)',
    '0 0 80px rgba(0, 186, 255, 0.9)',
    ...Array(16).fill('0 0 90px rgba(0, 186, 255, 1)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 28px',
          fontSize: '1rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #00baff 0%, #0066ff 100%)',
          border: '1px solid rgba(0, 186, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 186, 255, 0.3)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px rgba(0, 186, 255, 0.5)',
            background: 'linear-gradient(135deg, #33c9ff 0%, #3388ff 100%)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            transition: 'left 0.5s ease',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(10, 20, 40, 0.6)',
          border: '1px solid rgba(0, 186, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(0, 186, 255, 0.5)',
            boxShadow: '0 12px 40px rgba(0, 186, 255, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 20, 40, 0.5)',
            '& fieldset': {
              borderColor: 'rgba(0, 186, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 186, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00baff',
              boxShadow: '0 0 10px rgba(0, 186, 255, 0.5)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#00baff',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(10, 20, 40, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 186, 255, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
          border: '1px solid currentColor',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '1.1rem',
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '0.5px',
        },
      },
    },
  },
});

export default theme;