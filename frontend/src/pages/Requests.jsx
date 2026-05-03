import { useContext, useState } from 'react';

import {
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';

import { UserContext } from '../context/UserContext';

import { api } from '../services/api';

const Requests = () => {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    request_type: 'CLOSE_ACCOUNT',
    account_id: '',
    reason: '',
  });

  const [success, setSuccess] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess('');

    setError('');

    try {
      await api.post('/requests', {
        customer_id: user.id,

        account_id: formData.account_id || null,

        request_type: formData.request_type,

        reason: formData.reason,
      });

      setSuccess('Request submitted. Admin will review it soon.');

      setFormData({ request_type: 'CLOSE_ACCOUNT', account_id: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit request.');
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Submit a Request
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Request account closure or profile deletion.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              select
              label="Request Type"
              value={formData.request_type}
              onChange={(e) => setFormData({ ...formData, request_type: e.target.value })}
            >
              <MenuItem value="CLOSE_ACCOUNT">Close Account</MenuItem>

              <MenuItem value="DELETE_PROFILE">Delete Profile</MenuItem>
            </TextField>

            <TextField
              label="Account ID (for close account)"
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
            />

            <TextField
              label="Reason"
              multiline
              minRows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />

            {error && <Alert severity="error">{error}</Alert>}

            {success && <Alert severity="success">{success}</Alert>}

            <Button type="submit" variant="contained">
              Submit Request
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Requests;
