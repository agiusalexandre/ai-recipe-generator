// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, Typography, Container, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/HomePage';
import PersistPage from './pages/PersistPage';
import UploadPage from './pages/UploadPage';
import RecognitionPage from './pages/RecognitionPage';
import ChatPage from './pages/ChatPage';
import ChatAgentPage from './pages/ChatAgentPage';


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo color
    },
    secondary: {
      main: '#f50057', // Pink color
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" elevation={2} sx={{ backgroundColor: 'primary.main' }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'white', textDecoration: 'none' }}>
                Vehicule AI
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {['Home', 'Upload', 'Persist', 'Recognition', 'Chat', 'ChatAgent'].map((text, index) => (
                  <Button
                    key={text}
                    color="inherit"
                    component={Link}
                    to={index === 0 ? '/' : `/${text}`}
                    sx={{
                      mx: 1,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      transition: 'all 0.3s',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {text}
                  </Button>
                ))}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
          <Box sx={{ 
            p: 4, 
            backgroundColor: 'background.paper', 
            borderRadius: 4, 
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              transform: 'translateY(-4px)'
            }
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Upload" element={<UploadPage />} />
              <Route path="/Persist" element={<PersistPage />} />
              <Route path="/Recognition" element={<RecognitionPage />} />
              <Route path="/Chat" element={<ChatPage />} />
              <Route path="/ChatAgent" element={<ChatAgentPage />} />
            </Routes>
          </Box>
        </Container>
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Vehicule AI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
