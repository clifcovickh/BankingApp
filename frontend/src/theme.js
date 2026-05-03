import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f7f9',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#0d47a1',
        },
        h5: {
          color: '#0d47a1',
          fontWeight: 700,
        },
      },
    },
  },
});

export default theme;
