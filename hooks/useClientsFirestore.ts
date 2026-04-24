import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Client } from '../types';

export const useClientsFirestore = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setClients([]);
      return;
    }

    const q = query(collection(db, 'clients'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData: Client[] = [];
      snapshot.forEach((doc) => {
        clientsData.push({ id: doc.id, ...doc.data() } as Client);
      });
      // Sort by creation time (optional)
      clientsData.sort((a, b) => {
        const dateA = (a as any).createdAt?.toMillis() || 0;
        const dateB = (b as any).createdAt?.toMillis() || 0;
        return dateB - dateA;
      });
      setClients(clientsData);
    }, (error) => {
      console.error("Error fetching clients:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    if (!user) throw new Error('User must be authenticated to add a client');

    const newClient = {
      ...clientData,
      customerId: user.uid,
      balance: clientData.balance || 0,
      totalUsageHours: clientData.totalUsageHours || 0,
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'clients'), newClient);
      return docRef.id;
    } catch (error) {
      console.error("Error adding client: ", error);
      throw error;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    const docRef = doc(db, 'clients', clientId);
    await updateDoc(docRef, updates);
  };

  const deleteClient = async (clientId: string) => {
    const docRef = doc(db, 'clients', clientId);
    await deleteDoc(docRef);
  };

  return { clients, addClient, updateClient, deleteClient };
};
