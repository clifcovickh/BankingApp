import { useEffect, useState } from 'react';

import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

import { api } from '../services/api';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests/pending');

        setRequests(response.data);
      } catch (err) {
        setError('Unable to load requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });

      setRequests(requests.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update request.');
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pending Requests
        </Typography>

        {loading && <CircularProgress />}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && requests.length === 0 && <Typography>No pending requests.</Typography>}

        <Stack spacing={2} sx={{ mt: 2 }}>
          {requests.map((request) => (
            <Paper key={request.id} sx={{ p: 3 }}>
              <Typography>ID: {request.id}</Typography>

              <Typography>Type: {request.request_type}</Typography>

              <Typography>Customer ID: {request.customer_id}</Typography>

              <Typography>Account ID: {request.account_id || 'N/A'}</Typography>

              <Typography>Reason: {request.reason}</Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" onClick={() => handleDecision(request.id, 'APPROVED')}>
                  Approve
                </Button>

                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => handleDecision(request.id, 'REJECTED')}
                >
                  Reject
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default AdminRequests;
