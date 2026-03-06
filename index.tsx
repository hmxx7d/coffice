
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CafeInventoryProvider } from './context/CafeInventoryContext';
import { RoomProvider } from './context/RoomContext';
import { FinanceProvider } from './context/FinanceContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FinanceProvider>
      <CafeInventoryProvider>
        <RoomProvider>
          <App />
        </RoomProvider>
      </CafeInventoryProvider>
    </FinanceProvider>
  </React.StrictMode>
);
