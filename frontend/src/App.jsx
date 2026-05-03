import { useContext } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { UserContext, UserProvider } from './context/UserContext';

import Landing from './pages/Landing';

import Auth from './pages/Auth';

import Dashboard from './pages/Dashboard';

import AccountList from './pages/AccountList';

import OpenAccount from './pages/OpenAccount';

import AccountDetail from './pages/AccountDetail';

import Requests from './pages/Requests';

import AdminDashboard from './pages/AdminDashboard';

import AdminCustomers from './pages/AdminCustomers';

import AdminDepositoTypes from './pages/AdminDepositoTypes';

import AdminRequests from './pages/AdminRequests';

import AdminAccounts from './pages/AdminAccounts';

import theme from './theme';

const AppContent = () => {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />

        <Route path="/accounts" element={user ? <AccountList /> : <Navigate to="/auth" />} />

        <Route path="/open-account" element={user ? <OpenAccount /> : <Navigate to="/auth" />} />

        <Route
          path="/accounts/:accountId"
          element={user ? <AccountDetail /> : <Navigate to="/auth" />}
        />

        <Route path="/requests" element={user ? <Requests /> : <Navigate to="/auth" />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/customers" element={<AdminCustomers />} />

        <Route path="/admin/deposito-types" element={<AdminDepositoTypes />} />

        <Route path="/admin/requests" element={<AdminRequests />} />

        <Route path="/admin/accounts" element={<AdminAccounts />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
