import { useContext } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';

import { UserContext } from '../context/UserContext';

const Dashboard = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>
            Welcome back
          </Typography>

          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Hello, {user?.name || 'Valued Customer'}.
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Your customer ID is {user?.id || 'N/A'}.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Button variant="contained" color="primary" component={RouterLink} to="/accounts">
            My Accounts
          </Button>

          <Button variant="outlined" component={RouterLink} to="/requests">
            Requests
          </Button>

          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>

          <Button component={RouterLink} to="/" variant="outlined">
            Home
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Account overview
              </Typography>

              <Typography color="text.secondary">
                Track balances, monitor transaction history, and stay on top of your account
                activity.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Quick actions
              </Typography>

              <Typography color="text.secondary">
                Soon you’ll be able to deposit, withdraw, and request support directly from the
                dashboard.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
