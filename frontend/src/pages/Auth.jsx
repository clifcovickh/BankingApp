import { useState, useContext, useEffect } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';

import {
  Container,
  Button,
  Paper,
  Box,
  Typography,
  Stack,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';

import { UserContext } from '../context/UserContext';

import { api } from '../services/api';

const Auth = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [mode, setMode] = useState('login');

  const [formData, setFormData] = useState({ name: '', username: '', password: '' });

  const [feedback, setFeedback] = useState({ message: '', severity: 'info' });

  const [loading, setLoading] = useState(false);

  const { login } = useContext(UserContext);

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFeedback({ message: '', severity: 'info' });

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/login' : '/register';

      const response = await api.post(endpoint, formData);

      if (mode === 'login') {
        login(response.data.user);

        navigate('/dashboard');
      } else {
        setFeedback({
          message: `Registration successful! Your ID is ${response.data.customer_id}. Please sign in.`,

          severity: 'success',
        });

        navigate('/auth?mode=login');
      }
    } catch (err) {
      setFeedback({
        message: err.response?.data?.message || 'Unable to complete request. Please try again.',

        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" variant="h5">
            {mode === 'login' ? 'Sign in to Belimbing Bank' : 'Create a Belimbing Bank account'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            {mode === 'login'
              ? 'Enter your username and password to continue.'
              : 'Use your details to register for a new account.'}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            {mode === 'register' && (
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
            )}

            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              fullWidth
            />

            {feedback.message && <Alert severity={feedback.severity}>{feedback.message}</Alert>}

            <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Register'
              )}
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            gap: 1,
          }}
        >
          <Button
            size="small"
            onClick={() => setMode((prev) => (prev === 'login' ? 'register' : 'login'))}
          >
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Sign in'}
          </Button>

          <Button variant="text" size="small" onClick={() => navigate('/')}>
            Back to home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
