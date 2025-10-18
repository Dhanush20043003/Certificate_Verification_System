// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // This enables a dark theme by default
    primary: {
      main: '#90caf9', // A nice light blue for primary elements in dark mode
    },
    secondary: {
      main: '#f48fb1', // A pinkish accent color
    },
    background: {
      default: '#121212', // Standard dark background
      paper: '#1e1e1e',   // Background for cards, boxes, etc.
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
  },
});

export default theme;