import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  // Create a custom theme
  const theme = createTheme({
    typography: {
      fontFamily: 'Raleway, Arial',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      button: {
        textTransform: 'none'
      }
    },
    palette: {
      primary: {
        main: '#020617', // Your primary color
      },
      secondary: {
        main: '#f1f5f9', // Your secondary color
      },
      // You can customize other colors like success, warning, error, etc. here
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div className="app-layout-container">
        <Header></Header>
        <Body></Body>
        <Footer></Footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
