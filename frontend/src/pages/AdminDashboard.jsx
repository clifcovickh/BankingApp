import { useEffect, useState } from 'react';

import { Container, Paper, Stack, Button, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});

  useEffect(() => {
    setStats({});
  }, []);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Manage customers, deposito types, accounts, and pending requests.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" onClick={() => navigate('/admin/customers')}>
            Customers
          </Button>

          <Button variant="contained" onClick={() => navigate('/admin/deposito-types')}>
            Deposito Types
          </Button>

          <Button variant="contained" onClick={() => navigate('/admin/requests')}>
            Pending Requests
          </Button>

          <Button variant="contained" onClick={() => navigate('/admin/accounts')}>
            Accounts
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
