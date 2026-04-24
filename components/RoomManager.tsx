
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Eye, Edit2, Mic, Camera, Users, Monitor, Briefcase } from 'lucide-react';
import { RoomType, Room } from '../types';
import { useRooms } from '../context/RoomContext';

const CATEGORIES = [
  { id: 'workspace', name: RoomType.WORKSPACE, icon: Monitor, label: 'مساحات عمل' },
  { id: 'meeting', name: RoomType.MEETING_ROOM, icon: Users, label: 'غرف اجتماعات' },
  { id: 'workshop', name: RoomType.WORKSHOP, icon: Briefcase, label: 'ورش عمل' },
  { id: 'studio', name: RoomType.STUDIO, icon: Camera, label: 'استوديو' },
  { id: 'podcast', name: RoomType.PODCAST, icon: Mic, label: 'بودكاست' },
];

const RoomManager: React.FC = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const currentCategoryParam = searchParams.get('category') || 'workspace';
  const activeCategory = CATEGORIES.find(c => c.id === currentCategoryParam) || CATEGORIES[0];

  const handleTabChange = (categoryId: string) => {
    setSearchParams({ category: categoryId });
  };

  const openAddModal = () => {
    setEditingRoom({
      id: '', // Will be assigned by Firestore
      name: '',
      type: activeCategory.name,
      hourlyPrice: 5,
      capacity: 2
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom({ ...room });
    setIsModalOpen(true);
  };

  const handleSaveRoom = async () => {
    if (!editingRoom || !editingRoom.name) {
      alert('الرجاء إدخال اسم الغرفة');
      return;
    }
    
    try {
      if (editingRoom.id && rooms.some(r => r.id === editingRoom.id)) {
        await updateRoom(editingRoom.id, {
          name: editingRoom.name,
          hourlyPrice: editingRoom.hourlyPrice,
          capacity: editingRoom.capacity
        });
      } else {
        await addRoom({
          name: editingRoom.name,
          type: editingRoom.type,
          hourlyPrice: editingRoom.hourlyPrice,
          capacity: editingRoom.capacity
        });
      }
      setIsModalOpen(false);
      setEditingRoom(null);
    } catch (error) {
      console.error("Error saving room:", error);
      alert('حدث خطأ أثناء حفظ الغرفة');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المساحة؟')) {
      try {
        await deleteRoom(roomId);
      } catch (error) {
        console.error("Error deleting room:", error);
        alert('حدث خطأ أثناء حذف الغرفة');
      }
    }
  };

  const filteredRooms = rooms
    .filter(r => r.type === activeCategory.name)
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">إدارة الغرف والمساحات</h2>
          <p className="text-[#6E6E6E] text-sm mt-1">نسق قاعاتك بأسلوب يليق بعلامة كوفيكس وحسب الفئات</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-3 bg-[#D8A08A] text-white px-8 py-4 rounded-2xl hover:bg-[#C08A75] transition-all shadow-xl shadow-[#D8A08A]/20 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={20} />
          <span>إضافة {activeCategory.label} جديدة</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`flex flex-col items-center gap-2 min-w-[120px] p-4 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-[#2C2A3A] text-[#D8A08A] border-[#2C2A3A] shadow-md' 
                  : 'bg-white text-[#6E6E6E] border-[#E8E2DE] hover:bg-[#F4E9E4]/50'
              }`}
            >
              <Icon size={24} />
              <span className="font-bold text-sm whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modern Search/Filter */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8E2DE] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-[350px]">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={20} />
            <input 
              type="text" 
              placeholder={`ابحث في ${activeCategory.label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-6 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] transition-all font-bold text-sm"
            />
          </div>
        </div>
      </div>

      {/* Rooms Elegant Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[32px] border border-[#E8E2DE] border-dashed">
          <p className="text-[#6E6E6E] font-bold text-lg">لا توجد غرف في فئة {activeCategory.label}.</p>
          <button 
            onClick={openAddModal}
            className="mt-4 text-[#D8A08A] font-bold underline hover:text-[#C08A75]"
          >
            أضف واحدة الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-[32px] border border-[#E8E2DE] shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="h-48 bg-[#2C2A3A] relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${room.id}/800/600`} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                />
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm backdrop-blur-md bg-white border-[#E8E2DE] text-[#2C2A3A]">
                    {room.type}
                  </span>
                </div>
                <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                  {room.capacity} مقعد متاح
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-[#2C2A3A] font-serif mb-1">{room.name}</h3>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-black text-[#D8A08A] font-serif tracking-tighter">{room.hourlyPrice.toFixed(3)}</p>
                    <p className="text-[9px] font-black text-[#6E6E6E] uppercase tracking-widest">ر.ع / ساعة</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-[#F4E9E4]">
                  <button 
                    onClick={() => openEditModal(room)}
                    className="flex-1 py-3.5 bg-[#2C2A3A] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#D8A08A] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    تعديل القاعة
                  </button>
                  <button 
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-3.5 bg-[#F4E9E4]/50 text-[#6E6E6E] rounded-2xl hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                    title="حذف القاعة"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2A3A]/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-[#E8E2DE]">
            <div className="p-6 border-b border-[#F4E9E4] flex justify-between items-center">
              <h3 className="text-xl font-black text-[#2C2A3A] font-serif">
                {rooms.some(r => r.id === editingRoom.id) ? 'تعديل بيانات القاعة' : 'إضافة قاعة جديدة'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6E6E6E] hover:text-[#2C2A3A]">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#6E6E6E] mb-2">اسم الغرفة</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={e => setEditingRoom({...editingRoom, name: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F4E9E4]/50 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#6E6E6E] mb-2">السعر في الساعة (ر.ع)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingRoom.hourlyPrice}
                    onChange={e => setEditingRoom({...editingRoom, hourlyPrice: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-[#F4E9E4]/50 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-mono text-left"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#6E6E6E] mb-2">عدد المقاعد</label>
                  <input
                    type="number"
                    value={editingRoom.capacity}
                    onChange={e => setEditingRoom({...editingRoom, capacity: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 bg-[#F4E9E4]/50 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-mono text-left"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#F8F5F3] border-t border-[#F4E9E4] flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-[#6E6E6E] hover:bg-[#E8E2DE] transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={handleSaveRoom}
                className="px-6 py-3 bg-[#2C2A3A] text-white rounded-xl font-bold shadow-md hover:bg-[#D8A08A] transition-colors"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManager;
