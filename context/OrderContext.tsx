import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras: { name: string; price: number }[];
}

interface OrderContextType {
  customerOrderId: string | null;
  setCustomerOrderId: (id: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customerOrderId, setCustomerOrderId] = useState<string | null>(localStorage.getItem('customerOrderId'));

  const handleSetCustomerOrderId = (id: string | null) => {
    setCustomerOrderId(id);
    if (id) {
      localStorage.setItem('customerOrderId', id);
    } else {
      localStorage.removeItem('customerOrderId');
    }
  };

  return (
    <OrderContext.Provider value={{ customerOrderId, setCustomerOrderId: handleSetCustomerOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
