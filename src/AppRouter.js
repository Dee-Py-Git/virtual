import React from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import VerifyEmail from './components/VerifyEmail';
import CheckoutButton from './components/CheckoutButton';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentCancelled from './components/PaymentCancelled';
import PrivateRoute from './components/PrivateRoute'; // Protect your routes
import DashboardLayout from './layouts/dashboard'; // The layout for the dashboard
import UsersPage from './pages/UsersPage';
import TrainingenAdminPage from './pages/CreateTrainings.js';
import TrainingenPage from './pages/TrainingenPage.js';
import DashboardAppPage from './pages/DashboardAppPage';
import Page404 from './pages/Page404';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<SignIn />} />
        <Route path="/aanmelden" element={<SignUp />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/checkout/:amount" element={<CheckoutButtonWrapper />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />

        {/* Protect the entire /dashboard route with PrivateRoute */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          {/* Nested routing inside the dashboard */}
          <Route element={<DashboardLayout />}>
            <Route path="app" element={<DashboardAppPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="trainingen" element={<TrainingenPage />} />
            <Route index element={<Navigate to="/dashboard/app" />} />
          </Route>
        </Route>

        {/* Catch-all for 404 page */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

function CheckoutButtonWrapper() {
  const { amount } = useParams();
  return <CheckoutButton amount={amount} />;
}

export default AppRouter;
