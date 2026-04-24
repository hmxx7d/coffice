
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CafeInventoryProvider } from './context/CafeInventoryContext';
import { RoomProvider } from './context/RoomContext';
import { FinanceProvider } from './context/FinanceContext';
import { OrderProvider } from './context/OrderContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FinanceProvider>
        <CafeInventoryProvider>
          <RoomProvider>
            <OrderProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </OrderProvider>
          </RoomProvider>
        </CafeInventoryProvider>
      </FinanceProvider>
    </AuthProvider>
  </React.StrictMode>
);
