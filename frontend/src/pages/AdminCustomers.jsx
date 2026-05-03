import { useEffect, useState } from 'react';

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
  TextField,
} from '@mui/material';

import { api } from '../services/api';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({ name: '', username: '', password: '' });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get('/customers');

        setCustomers(response.data);
      } catch (err) {
        setError('Unable to load customers.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const reloadCustomers = async () => {
    setLoading(true);

    try {
      const response = await api.get('/customers');

      setCustomers(response.data);
    } catch (err) {
      setError('Unable to refresh customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);

    setFormData({ name: customer.name, username: customer.username, password: '' });

    setMessage('');
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/customers/${selectedCustomer.id}`, {
        name: formData.name,

        username: formData.username,

        password: formData.password || undefined,
      });

      setMessage('Customer updated successfully.');

      setSelectedCustomer(null);

      reloadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update customer.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);

      setCustomers(customers.filter((c) => c.id !== id));

      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete customer.');
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Customers
        </Typography>

        {loading && <CircularProgress />}

        {error && <Alert severity="error">{error}</Alert>}

        {message && <Alert severity="success">{message}</Alert>}

        {!loading && customers.length === 0 && <Typography>No customers found.</Typography>}

        {!loading && customers.length > 0 && (
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>

                  <TableCell>Name</TableCell>

                  <TableCell>Username</TableCell>

                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.id}</TableCell>

                    <TableCell>{customer.name}</TableCell>

                    <TableCell>{customer.username}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => handleEdit(customer)}>
                          Edit
                        </Button>

                        <Button color="error" onClick={() => handleDelete(customer.id)}>
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

        {selectedCustomer && (
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Edit Customer {selectedCustomer.id}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <TextField
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />

              <TextField
                label="New Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helperText="Leave blank to keep current password"
              />

              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleUpdate}>
                  Save Changes
                </Button>

                <Button variant="outlined" onClick={() => setSelectedCustomer(null)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default AdminCustomers;
