import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 10 }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ShieldCheck size={48} color="#1976d2" />
          </Box>

          <Typography
            variant="overline"
            color="primary"
            sx={{ letterSpacing: 4, fontWeight: 'bold' }}
          >
            Belimbing Bank
          </Typography>

          <Typography variant="h3" component="h1" sx={{ mt: 2, fontWeight: 800, color: '#1e293b' }}>
            A modern banking experience.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 3, maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}
          >
            Securely access your account, manage deposits, and track transactions from one simple,
            resilient dashboard.
          </Typography>
        </Box>

        {/* Centering Wrapper */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              alignItems: 'center',
            }}
          >
            <Button
              component={RouterLink}
              to="/auth?mode=login"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                minWidth: '160px',
              }}
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/auth?mode=register"
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem',
                minWidth: '160px',
              }}
            >
              Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Landing;
