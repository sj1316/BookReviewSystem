import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Container, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Login from './components/Login';
import Register from './components/Register';
import ReviewList from './components/ReviewList';
import ReviewForm from './components/ReviewForm';
import ReviewDetail from './components/ReviewDetail';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Navigation />
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/all-reviews" element={<ReviewList userOnly={false} />} />
              <Route path="/review/:id" element={<ReviewDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/my-reviews"
                element={
                  <ProtectedRoute>
                    <ReviewList userOnly={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-review"
                element={
                  <ProtectedRoute>
                    <ReviewForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-review/:id"
                element={
                  <ProtectedRoute>
                    <ReviewForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
