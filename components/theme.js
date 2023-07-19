import { createTheme } from '@mui/material/styles';
import { cyan, orange, green, blue, yellow, red, blueGrey, indigo, pink, brown } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontSize: 14,
        fontFamily: [
          'Open Sans Variable',
          'Open Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
        h1: {
          fontFamily: [
              'Source Serif Variable',
              'Source Serif',
              'serif',
            ].join(','),
        },
        h2: {
          fontFamily: [
              'Source Serif Variable',
              'Source Serif',
              'serif',
            ].join(','),
        },
        h3: {
          fontFamily: [
              'Source Serif Variable',
              'Source Serif',
              'serif',
            ].join(','),
        },
        h4: {
          fontFamily: [
              'Source Serif Variable',
              'Source Serif',
              'serif',
            ].join(','),
        },
        h5: {
          fontFamily: [
              'Source Serif Variable',
              'Source Serif',
              'serif',
            ].join(','),
        },
        h6: {
          fontFamily: [
              'Source Serif Variable',
              'Source Serif',
              'serif',
            ].join(','),
        }
    },
    palette: {
        primary: {
          primary: yellow,
          main: 'rgb(217, 151, 0)',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
});
  
export default theme;