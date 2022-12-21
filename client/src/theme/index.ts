import { createTheme } from '@mui/material';

// create custom MUI theme
export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#f06292',
      light: '#ff94c2',
      dark: '#ba2d65',
    },
    secondary: {
      main: '#9c27b0',
      light: '#d05ce3',
      dark: '#6a0080',
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          position: 'absolute',
          bottom: '-1.8em',
        },
      },
    },
  },
});
