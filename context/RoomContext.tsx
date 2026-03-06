import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Room, RoomType } from '../types';

interface RoomContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const INITIAL_ROOMS: Room[] = [
  { id: '1', name: 'VIP 101', type: RoomType.SINGLE_CLOSED, hourlyPrice: 8, capacity: 1 },
  { id: '2', name: 'Focus Desk 01', type: RoomType.SEMI_CLOSED, hourlyPrice: 3.5, capacity: 1 },
  { id: '3', name: 'Academy Hall A', type: RoomType.CLASSROOM, hourlyPrice: 10, capacity: 20 },
  { id: '4', name: 'Boardroom X', type: RoomType.MEETING_ROOM_QUAD, hourlyPrice: 3, capacity: 4 },
  { id: '5', name: 'Private Pod 05', type: RoomType.SINGLE_ROOM, hourlyPrice: 2, capacity: 1 },
];

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
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
