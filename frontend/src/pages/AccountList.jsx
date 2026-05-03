import { useContext, useEffect, useState } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';

import { UserContext } from '../context/UserContext';

import { api } from '../services/api';

const AccountList = () => {
  const { user } = useContext(UserContext);

  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;

      setLoading(true);

      setError('');

      try {
        const response = await api.get(`/accounts/customer/${user.id}`);

        setAccounts(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setAccounts([]);
        } else {
          setError(err.response?.data?.message || 'Unable to load accounts.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Paper sx={{ p: 4 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <div>
              <Typography variant="h4" gutterBottom>
                My Accounts
              </Typography>

              <Typography color="text.secondary">
                View all accounts opened under your profile.
              </Typography>
            </div>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" onClick={() => navigate('/open-account')}>
                Open Account
              </Button>

              <Button variant="outlined" onClick={() => navigate('/requests')}>
                Request Action
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {loading && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Paper>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && accounts.length === 0 && (
          <Paper sx={{ p: 4 }}>
            <Typography>No accounts found yet.</Typography>

            <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/open-account')}>
              Open your first account
            </Button>
          </Paper>
        )}

        {!loading && accounts.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account ID</TableCell>

                  <TableCell>Deposito Type</TableCell>

                  <TableCell>Balance</TableCell>

                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>

                    <TableCell>{account.DepositoType?.type || account.deposito_type}</TableCell>

                    <TableCell>{Number(account.balance).toFixed(2)}</TableCell>

                    <TableCell>
                      <Button component={RouterLink} to={`/accounts/${account.id}`} size="small">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Container>
  );
};

export default AccountList;
