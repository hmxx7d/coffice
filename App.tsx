import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Components
import AdminLayout from './components/AdminLayout';
import Dashboard from './components/Dashboard';
import RoomManager from './components/RoomManager';
import ClientManager from './components/ClientManager';
import SubscriptionManager from './components/SubscriptionManager';
import BookingCalendar from './components/BookingCalendar';
import CafeSystem from './components/CafeSystem';
import FinancialReports from './components/FinancialReports';
import InventoryManager from './components/InventoryManager';

// Customer Components
import CustomerPortal from './components/customer/CustomerPortal';
import CustomerMenu from './components/customer/CustomerMenu';
import CustomerCart from './components/customer/CustomerCart';
import PaymentGateway from './components/customer/PaymentGateway';
import OrderTracking from './components/customer/OrderTracking';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerPortal />}>
          <Route index element={<CustomerMenu />} />
          <Route path="cart" element={<CustomerCart />} />
          <Route path="checkout" element={<PaymentGateway />} />
          <Route path="tracking/:orderId" element={<OrderTracking />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<RoomManager />} />
            <Route path="clients" element={<ClientManager />} />
            <Route path="subscriptions" element={<SubscriptionManager />} />
            <Route path="bookings" element={<BookingCalendar />} />
            <Route path="cafe" element={<CafeSystem />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="finance" element={<FinancialReports />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
