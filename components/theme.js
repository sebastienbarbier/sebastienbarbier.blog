import { createTheme } from '@mui/material/styles';
import { cyan, orange, green, blue, red, blueGrey, indigo, pink, brown } from '@mui/material/colors';


// Create a theme instance.
const theme = createTheme({
    typography: {
        fontSize: 14,
        fontFamily: [
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
    },
    palette: {
        primary: {
          primary: blue,
          main: blue[600],
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