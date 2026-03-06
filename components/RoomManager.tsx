
import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Eye } from 'lucide-react';
import { RoomType, Room } from '../types';
import { useRooms } from '../context/RoomContext';

const RoomManager: React.FC = () => {
  const { rooms, setRooms } = useRooms();

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">إدارة المساحات الفاخرة</h2>
          <p className="text-[#6E6E6E] text-sm mt-1">نسق قاعاتك بأسلوب يليق بعلامة كوفيكس</p>
        </div>
        <button 
          onClick={() => {
            const newRoom: Room = {
              id: Math.random().toString(36).substr(2, 9),
              name: `قاعة جديدة ${rooms.length + 1}`,
              type: RoomType.SINGLE_CLOSED,
              hourlyPrice: 5,
              capacity: 2
            };
            setRooms([...rooms, newRoom]);
          }}
          className="flex items-center justify-center gap-3 bg-[#D8A08A] text-white px-8 py-4 rounded-2xl hover:bg-[#C08A75] transition-all shadow-xl shadow-[#D8A08A]/20 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={20} />
          <span>إضافة مساحة جديدة</span>
        </button>
      </header>

      {/* Modern Search/Filter */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E2DE] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-[350px]">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن تجربة مكان..." 
              className="w-full pr-12 pl-6 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] transition-all font-bold text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 border border-[#E8E2DE] rounded-2xl hover:bg-[#F4E9E4]/50 transition-colors text-sm font-bold text-[#6B4F45]">
            <Filter size={18} />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      {/* Rooms Elegant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-[32px] border border-[#E8E2DE] shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
            <div className="h-48 bg-[#2C2A3A] relative overflow-hidden">
              <img 
                src={`https://picsum.photos/seed/${room.id}/800/600`} 
                alt={room.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
              />
              <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                {room.capacity} مقعد متاح
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-[#2C2A3A] font-serif mb-1">{room.name}</h3>
                  <p className="text-[10px] font-bold text-[#6B4F45] uppercase tracking-widest">{room.type}</p>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-[#D8A08A] font-serif tracking-tighter">{room.hourlyPrice.toFixed(3)}</p>
                  <p className="text-[9px] font-black text-[#6E6E6E] uppercase tracking-widest">ر.ع / ساعة</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-[#F4E9E4]">
                <button className="flex-1 py-3.5 bg-[#2C2A3A] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#D8A08A] transition-all duration-300">
                  تعديل القاعة
                </button>
                <button 
                  onClick={() => setRooms(rooms.filter(r => r.id !== room.id))}
                  className="p-3.5 bg-[#F4E9E4]/50 text-[#6E6E6E] rounded-2xl hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                >
                  <Trash2 size={20} />
                </button>
                <button className="p-3.5 bg-[#F4E9E4]/50 text-[#6E6E6E] rounded-2xl hover:text-[#D8A08A] hover:bg-[#F4E9E4] transition-all border border-transparent hover:border-[#E8E2DE]">
                  <Eye size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManager;
