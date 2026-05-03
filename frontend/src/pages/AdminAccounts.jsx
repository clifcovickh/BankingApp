import { useEffect, useState } from 'react';

import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from '@mui/material';

import { api } from '../services/api';

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [depositoTypes, setDepositoTypes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    customer_id: '',
    deposit_value: '',
    deposito_type_id: '',
  });

  const [editMode, setEditMode] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);

    try {
      const [accountsResponse, typesResponse, customersResponse] = await Promise.all([
        api.get('/accounts'),

        api.get('/deposito-types'),

        api.get('/customers'),
      ]);

      setAccounts(accountsResponse.data);

      setDepositoTypes(typesResponse.data);

      setCustomers(customersResponse.data);

      setError('');
    } catch (err) {
      setError('Unable to load admin account data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleEdit = (account) => {
    setFormData({
      id: account.id,

      customer_id: account.customer_id || account.Customer?.id || '',

      deposit_value: account.balance,

      deposito_type_id: account.deposito_type_id || account.DepositoType?.id || '',
    });

    setEditMode(true);

    setError('');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/accounts/${id}`);

      setAccounts(accounts.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete account.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    try {
      if (!formData.id) {
        setError('Select an account to edit before saving.');

        return;
      }

      await api.put(`/accounts/${formData.id}`, {
        customer_id: Number(formData.customer_id),

        balance: Number(formData.deposit_value),

        deposito_type: Number(formData.deposito_type_id),
      });

      setFormData({ id: '', customer_id: '', deposit_value: '', deposito_type_id: '' });

      setEditMode(false);

      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update account.');
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Accounts
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Edit an account to adjust balance, customer, or deposito type.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start">
            <TextField
              label="Customer"
              select
              value={formData.customer_id}
              onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
              required
              sx={{ minWidth: 240 }}
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.id} — {customer.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Balance"
              value={formData.deposit_value}
              onChange={(e) => setFormData({ ...formData, deposit_value: e.target.value })}
              type="number"
              required
              sx={{ minWidth: 200 }}
            />

            <TextField
              label="Deposito Type"
              select
              value={formData.deposito_type_id}
              onChange={(e) => setFormData({ ...formData, deposito_type_id: e.target.value })}
              required
              sx={{ minWidth: 240 }}
            >
              {depositoTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.type}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" disabled={!editMode}>
                Save Changes
              </Button>

              {editMode && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);

                    setFormData({
                      id: '',
                      customer_id: '',
                      deposit_value: '',
                      deposito_type_id: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>

        {loading && <CircularProgress sx={{ mt: 3 }} />}

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Accounts List
        </Typography>

        {!loading && accounts.length === 0 && <Typography>No accounts found.</Typography>}

        {!loading && accounts.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>

                    <TableCell>{account.Customer?.name || account.customer_id}</TableCell>

                    <TableCell>{account.DepositoType?.type || account.deposito_type}</TableCell>

                    <TableCell>{Number(account.balance).toFixed(2)}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => handleEdit(account)}>
                          Edit
                        </Button>

                        <Button color="error" onClick={() => handleDelete(account.id)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default AdminAccounts;
