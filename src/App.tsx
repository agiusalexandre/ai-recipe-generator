// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/HomePage';
import PersistPage from './pages/PersistPage';
import UploadPage from './pages/UploadPage';
import RecognitionPage from './pages/RecognitionPage';


const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Green color
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
      // this is to be used in complex animations
      complex: 375,
      // recommended when something is entering screen
      enteringScreen: 225,
      // recommended when something is leaving screen
      leavingScreen: 195,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              Recipe AI
            </Typography>
            <div>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  mx: 1,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-2px)' }
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/Upload"
                sx={{
                  mx: 1,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-2px)' }
                }}
              >
                Upload
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/Persist"
                sx={{
                  mx: 1,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-2px)' }
                }}
              >
                Persist
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/Recognition"
                sx={{
                  mx: 1,
                  fontWeight: 'bold',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-2px)' }
                }}
              >
                Recognition
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4, p: 4, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Upload" element={<UploadPage />} />
            <Route path="/Persist" element={<PersistPage />} />
            <Route path="/Recognition" element={<RecognitionPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
