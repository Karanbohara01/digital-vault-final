



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage'; // 1. Import the new landing page
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import './App.css';
import CreateProductPage from './pages/CreateProductPage';
import CreatorProtectedRoute from './components/CreatorProtectedRoute';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SettingsPage from './pages/SettingsPage';
import EditProductPage from './pages/EditProductPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminEditUserPage from './pages/AdminEditUserPage';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main style={{ padding: '1rem' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} /> {/* 2. Make landing page the root */}
            <Route path="/marketplace" element={<HomePage />} /> {/* 3. Move marketplace to /marketplace */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePasswordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-product"
              element={
                <CreatorProtectedRoute>
                  <CreateProductPage />
                </CreatorProtectedRoute>
              }
            />
            <Route
              path="/edit-product/:productId"
              element={
                <CreatorProtectedRoute>
                  <EditProductPage />
                </CreatorProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-user/:userId"
              element={<AdminProtectedRoute><AdminEditUserPage /></AdminProtectedRoute>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;