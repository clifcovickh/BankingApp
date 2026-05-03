import { useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

import { UserContext } from '../context/UserContext';

import { api } from '../services/api';

const OpenAccount = () => {
  const { user } = useContext(UserContext);

  const [depositoTypes, setDepositoTypes] = useState([]);

  const [formData, setFormData] = useState({ deposito_type: '', balance: '' });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepositoTypes = async () => {
      try {
        const response = await api.get('/deposito-types');

        setDepositoTypes(response.data);
      } catch (err) {
        setError('Unable to load deposito types.');
      }
    };

    fetchDepositoTypes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    setSuccess('');

    setLoading(true);

    try {
      await api.post('/accounts', {
        customer_id: user.id,

        deposito_type: formData.deposito_type,

        balance: Number(formData.balance),
      });

      setSuccess('Account opened successfully.');

      setFormData({ deposito_type: '', balance: '' });

      setTimeout(() => navigate('/accounts'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to open account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Open New Account
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Choose a deposito type and initial balance.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              label="Deposito Type"
              value={formData.deposito_type}
              onChange={(e) => setFormData({ ...formData, deposito_type: e.target.value })}
              required
            >
              {depositoTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.type} — {type.yearly_return}% yearly
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Initial Balance"
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />

            {error && <Alert severity="error">{error}</Alert>}

            {success && <Alert severity="success">{success}</Alert>}

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Open Account'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default OpenAccount;
