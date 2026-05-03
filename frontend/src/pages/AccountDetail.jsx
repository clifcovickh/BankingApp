import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';

import { api } from '../services/api';

const AccountDetail = () => {
  const { accountId } = useParams();

  const [account, setAccount] = useState(null);

  const [transactions, setTransactions] = useState([]);

  const [transactionType, setTransactionType] = useState('DEPOSIT');

  const [amount, setAmount] = useState('');

  const [transactionDate, setTransactionDate] = useState('');

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/accounts/${accountId}`);

        setAccount(response.data);
      } catch (err) {
        setFeedback({
          type: 'error',
          message: err.response?.data?.message || 'Unable to load account.',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await api.get(`/transactions/${accountId}`);

        setTransactions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccount();

    fetchTransactions();
  }, [accountId]);

  const handleTransaction = async () => {
    setFeedback({ type: '', message: '' });

    try {
      const response = await api.post('/transactions', {
        account_id: accountId,

        type: transactionType,

        amount: Number(amount),

        transaction_date: transactionDate || undefined,
      });

      setFeedback({ type: 'success', message: response.data.message });

      setAmount('');

      setTransactionDate('');

      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Transaction failed.' });
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 6 }}>
      {loading && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Paper>
      )}

      {!loading && account && (
        <Stack spacing={3}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Account {account.id}
            </Typography>

            <Typography>Balance: {Number(account.balance).toFixed(2)}</Typography>

            <Typography>
              Deposito Type: {account.DepositoType?.type || account.deposito_type}
            </Typography>

            <Typography>Yearly return: {account.DepositoType?.yearly_return}%</Typography>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Deposit / Withdraw
            </Typography>

            <Stack spacing={2}>
              <TextField
                select
                label="Type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <MenuItem value="DEPOSIT">Deposit</MenuItem>

                <MenuItem value="WITHDRAW">Withdraw</MenuItem>
              </TextField>

              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <TextField
                label="Transaction date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />

              {feedback.message && <Alert severity={feedback.type}>{feedback.message}</Alert>}

              <Button variant="contained" onClick={handleTransaction}>
                Submit
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Transaction History
            </Typography>

            {transactions.length === 0 ? (
              <Typography>No transactions yet.</Typography>
            ) : (
              transactions.map((tx) => (
                <Paper key={tx.id} sx={{ p: 2, mb: 2 }}>
                  <Typography>Type: {tx.action_type}</Typography>

                  <Typography>Amount: {Number(tx.amount).toFixed(2)}</Typography>

                  <Typography>Date: {new Date(tx.transaction_date).toLocaleString()}</Typography>
                </Paper>
              ))
            )}
          </Paper>
        </Stack>
      )}
    </Container>
  );
};

export default AccountDetail;
