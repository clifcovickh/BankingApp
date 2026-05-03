import { useEffect, useState } from 'react';

import {
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

import { api } from '../services/api';

const AdminDepositoTypes = () => {
  const [types, setTypes] = useState([]);

  const [formData, setFormData] = useState({ id: '', type: '', yearly_return: '' });

  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/deposito-types');

        setTypes(response.data);
      } catch (err) {
        setFeedback({ type: 'error', message: 'Unable to load deposito types.' });
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const reloadTypes = async () => {
    setLoading(true);

    try {
      const response = await api.get('/deposito-types');

      setTypes(response.data);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Unable to refresh deposito types.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFeedback({ type: '', message: '' });

    try {
      if (editMode) {
        await api.put(`/deposito-types/${formData.id}`, {
          type: formData.type,

          yearly_return: Number(formData.yearly_return),
        });

        setFeedback({ type: 'success', message: 'Deposito type updated.' });
      } else {
        const response = await api.post('/deposito-types', {
          type: formData.type,

          yearly_return: Number(formData.yearly_return),
        });

        setTypes([...types, response.data]);

        setFeedback({ type: 'success', message: 'Deposito type created.' });
      }

      setFormData({ id: '', type: '', yearly_return: '' });

      setEditMode(false);

      reloadTypes();
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Save failed.' });
    }
  };

  const handleEdit = (item) => {
    setFormData({ id: item.id, type: item.type, yearly_return: item.yearly_return });

    setEditMode(true);

    setFeedback({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deposito-types/${id}`);

      setTypes(types.filter((item) => item.id !== id));
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Delete failed.' });
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Deposito Types
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Add, edit or remove deposito types.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />

            <TextField
              label="Yearly Return (%)"
              type="number"
              value={formData.yearly_return}
              onChange={(e) => setFormData({ ...formData, yearly_return: e.target.value })}
              required
            />

            {feedback.message && <Alert severity={feedback.type}>{feedback.message}</Alert>}

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">
                {editMode ? 'Update Deposito Type' : 'Add Deposito Type'}
              </Button>

              {editMode && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);

                    setFormData({ id: '', type: '', yearly_return: '' });
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>

        {loading && <CircularProgress sx={{ mt: 3 }} />}

        {!loading && types.length === 0 && (
          <Typography sx={{ mt: 3 }}>No deposito types available.</Typography>
        )}

        {!loading && types.length > 0 && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            {types.map((item) => (
              <Paper
                key={item.id}
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Typography>{item.type}</Typography>

                  <Typography color="text.secondary">{item.yearly_return}% yearly</Typography>
                </div>

                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>

                  <Button color="error" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDepositoTypes;
