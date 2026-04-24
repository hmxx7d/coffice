import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, doc, setDoc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Room, RoomType } from '../types';

interface RoomContextType {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => Promise<void>;
  updateRoom: (roomId: string, updates: Partial<Room>) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'rooms'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData: Room[] = [];
      snapshot.forEach((docSnap) => {
        roomsData.push({ id: docSnap.id, ...docSnap.data() } as Room);
      });
      setRooms(roomsData);
    }, (error) => {
      console.error("Error fetching rooms: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addRoom = async (room: Omit<Room, 'id'>) => {
    await addDoc(collection(db, 'rooms'), room);
  };

  const updateRoom = async (roomId: string, updates: Partial<Room>) => {
    const docRef = doc(db, 'rooms', roomId);
    await updateDoc(docRef, updates);
  };

  const deleteRoom = async (roomId: string) => {
    const docRef = doc(db, 'rooms', roomId);
    await deleteDoc(docRef);
  };

  return (
    <RoomContext.Provider value={{ rooms, addRoom, updateRoom, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRooms must be used within a RoomProvider');
  }
  return context;
};

