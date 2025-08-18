import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './context/AuthContext';
import Main from './pages/Main';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const queryClient = new QueryClient();

const LoadingScreen: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <CircularProgress size={40} />
    <Box sx={{ textAlign: 'center' }}>
      Loading...
    </Box>
  </Box>
);

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login() // redirect to AWS Cognito login Form
    }
  }, [isLoading, isAuthenticated, login])

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Main /></ProtectedRoute>}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;