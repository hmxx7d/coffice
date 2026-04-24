import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, where, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../context/OrderContext';

export type OrderStatus = 'جديد' | 'قيد التحضير' | 'جاهز' | 'تم التسليم' | 'ملغي';

export interface FirestoreOrder {
  id?: string;
  customerId: string;
  clientName: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  source: 'in-store' | 'online';
  createdAt: Timestamp;
}

export const useOrdersFirestore = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch today's active orders for Admin
  useEffect(() => {
    if (!user || user.isAnonymous) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', Timestamp.fromDate(today)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreOrder[];
      
      // Filter out completed/canceled on client side if needed, or keep them for history
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const submitOrder = async (orderData: Omit<FirestoreOrder, 'id' | 'createdAt' | 'status' | 'customerId'>) => {
    if (!user) throw new Error("User not authenticated");

    const newOrder = {
      ...orderData,
      customerId: user.uid,
      status: 'جديد' as OrderStatus,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    return docRef.id;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  };

  return { orders, loading, submitOrder, updateOrderStatus };
};

// Hook for customer to track their specific order
export const useCustomerOrder = (orderId: string | undefined) => {
  const [order, setOrder] = useState<FirestoreOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as FirestoreOrder);
      } else {
        setOrder(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customer order:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  return { order, loading };
};
