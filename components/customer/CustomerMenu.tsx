import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  MonitorPlay, 
  Users, 
  Briefcase, 
  Laptop, 
  Mic, 
  PlusCircle, 
  X, 
  CheckCircle 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCafeInventory } from '../../context/CafeInventoryContext';
import { useRooms } from '../../context/RoomContext';
import { RoomType } from '../../types';

// Categories Definition
const CATEGORIES = [
  { id: 'coffee', name: 'قهوة مختصة', icon: Coffee },
  { id: 'studio', name: 'استديو', icon: MonitorPlay },
  { id: 'workshops', name: 'ورش عمل', icon: Users },
  { id: 'meeting-rooms', name: 'غرف اجتماعات', icon: Briefcase },
  { id: 'workspaces', name: 'مساحات عمل', icon: Laptop },
  { id: 'podcast', name: 'بودكاست', icon: Mic },
];

const EXTRAS = [
  { name: 'إضافة إسبريسو', price: 0.500 },
  { name: 'حليب نباتي', price: 0.300 },
  { name: 'نكهة كراميل', price: 0.200 },
  { name: 'نكهة فانيلا', price: 0.200 },
];

// Mock Data incorporating real looking items for each category
const MOCK_ITEMS = [
  // Coffee
  { id: '1', name: 'V60 إثيوبي', description: 'قهوة مختصة مقطرة بطعم فاكهي وحمضية لطيفة', price: 2.500, category: 'coffee', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'كورتادو', description: 'إسبريسو مع حليب مبخر بكثافة متساوية لتعزيز النكهة', price: 1.800, category: 'coffee', image: 'https://images.unsplash.com/photo-1517701550927-30cfcb64ac45?auto=format&fit=crop&w=400&q=80' },
  // Studio
  { id: '3', name: 'استديو تصوير احترافي', description: 'مساحة مجهزة بإضاءة سوفت بوكس وخلفيات ملونة', price: 15.000, category: 'studio', image: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=400&q=80', isRoom: true },
  { id: '4', name: 'استديو منتجات', description: 'طاولات خفية وإضاءة ماكرو مثالية لتصوير الأطعمة أو المنتجات', price: 10.000, category: 'studio', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80', isRoom: true },
  // Workshops
  { id: '5', name: 'ورشة الفنون الإبداعية', description: 'مساحة مجهزة للألوان المائية والزيتية بطاولات عريضة', price: 20.000, category: 'workshops', image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=400&q=80', isRoom: true },
  { id: '6', name: 'ورشة الابتكار التقني', description: 'تتسع لـ 20 شخص للورش التقنية وتأتي مع شاشة ذكية ولوح أبيض', price: 25.000, category: 'workshops', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80', isRoom: true },
  // Meeting Rooms
  { id: '7', name: 'غرفة اجتماعات تنفيذية', description: 'شاشة ذكية وطاولة تتسع لـ 8 أشخاص مع عزل صوت ممتاز', price: 8.000, category: 'meeting-rooms', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80', isRoom: true },
  { id: '8', name: 'غرفة اجتماعات سريعة', description: 'مناسبة لـ 4 أشخاص للاجتماعات الجانبية السريعة والمركزة', price: 5.000, category: 'meeting-rooms', image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=400&q=80', isRoom: true },
  // Workspaces
  { id: '9', name: 'مكتب خاص', description: 'مكتب هادئ ومريح لشخص واحد لإنجاز الأعمال بتركيز', price: 3.000, category: 'workspaces', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80', isRoom: true },
  { id: '10', name: 'مساحة عمل مشتركة', description: 'مقعد في الصالة المفتوحة وسط مجتمع نشط وملهم', price: 1.500, category: 'workspaces', image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=400&q=80', isRoom: true },
  // Podcast
  { id: '11', name: 'استديو بودكاست احترافي', description: '4 مايكات Shure، مكسر صوت، عزل أحترافي وسماعات', price: 12.000, category: 'podcast', image: 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?auto=format&fit=crop&w=400&q=80', isRoom: true },
  { id: '12', name: 'استديو بودكاست مصغر', description: 'مايكين واضاءة بسيطة لتدوين صوتي شخصي سريع', price: 8.000, category: 'podcast', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80', isRoom: true },
];

const CustomerMenu: React.FC = () => {
  const { addToCart } = useCart();
  const { products } = useCafeInventory();
  const { rooms } = useRooms();
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);

  const inventoryMenuItems = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description || p.category, 
    price: p.price,
    category: 'coffee', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80',
    isRoom: false
  }));

  const roomMenuItems = rooms.map(r => {
    let category = '';
    let image = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80';
    if (r.type === RoomType.STUDIO) {
      category = 'studio';
      image = 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=400&q=80';
    } else if (r.type === RoomType.WORKSHOP) {
      category = 'workshops';
      image = 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=400&q=80';
    } else if (r.type === RoomType.MEETING_ROOM) {
      category = 'meeting-rooms';
    } else if (r.type === RoomType.WORKSPACE) {
      category = 'workspaces';
      image = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80';
    } else if (r.type === RoomType.PODCAST) {
      category = 'podcast';
      image = 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?auto=format&fit=crop&w=400&q=80';
    }

    return {
      id: r.id,
      name: r.name,
      description: `تتسع لـ ${r.capacity} أشخاص - السعر للساعة`, 
      price: r.hourlyPrice,
      category,
      image,
      isRoom: true
    };
  });

  const allItems = [
    ...inventoryMenuItems,
    ...roomMenuItems
  ];

  const filteredItems = allItems.filter(item => item.category === selectedCategory);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setSelectedExtras([]);
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    const cartId = selectedExtras.length > 0 
      ? `${selectedItem.id}-${selectedExtras.map(e => e.name).join('-')}`
      : selectedItem.id;
      
    addToCart({
      id: cartId,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
      extras: selectedExtras
    });
    
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F4E9E4] font-sans pb-24 md:pb-0" dir="rtl">
      {/* Category Sidebar/Navbar */}
      <div className="sticky top-0 z-10 w-full md:w-72 bg-[#F4E9E4] md:border-l border-[#E8E2DE] p-4 md:h-screen md:overflow-y-auto shrink-0 shadow-sm md:shadow-none">
        <div className="md:mb-8 hidden md:block pt-4 text-center md:text-right">
          <h2 className="text-3xl font-black font-serif italic text-[#2C2A3A]">قائمة كوفيكس</h2>
          <p className="text-sm text-[#6E6E6E] mt-2">تصفح مساحاتنا ومنتجاتنا واختر ما يناسبك</p>
        </div>
        
        <div className="flex md:flex-col gap-3 overflow-x-auto scrollbar-hide py-2 md:py-0">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button 
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl transition-all whitespace-nowrap md:whitespace-normal shrink-0 border outline-none ${
                  isActive
                   ? 'bg-[#D8A08A] text-white shadow-md border-[#D8A08A] transform scale-[1.02]'
                   : 'bg-white text-[#2C2A3A] hover:bg-[#F4E9E4] hover:shadow-sm border-[#E8E2DE]'
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20' : 'bg-[#F4E9E4]'}`}>
                  <Icon size={20} className={isActive ? 'text-white' : 'text-[#D8A08A]'} />
                </div>
                <span className={`text-[15px] font-bold ${isActive ? 'text-white' : 'text-[#2C2A3A]'}`}>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-hidden bg-[#F4E9E4]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map(item => (
              <motion.div 
                layout
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-3xl overflow-hidden border border-[#E8E2DE] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  <div className="absolute inset-0 bg-[#2C2A3A]/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  {item.isRoom && (
                    <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md text-[#2C2A3A] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      تأجير مساحة
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1 text-right">
                  <h3 className="font-bold text-lg text-[#2C2A3A] font-serif mb-1">{item.name}</h3>
                  <p className="text-sm text-[#6E6E6E] mb-5 flex-1 line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-[#D8A08A] font-black text-xl italic">
                      {item.price.toFixed(3)} <span className="text-[10px] uppercase not-italic text-[#6E6E6E]">ر.ع {item.isRoom ? '/ ساعة' : ''}</span>
                    </p>
                    <div className="w-10 h-10 rounded-2xl bg-[#F4E9E4] text-[#D8A08A] flex items-center justify-center group-hover:bg-[#2C2A3A] group-hover:text-white transition-colors duration-300">
                      <PlusCircle size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center p-0 sm:p-6 drop-shadow-2xl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#2C2A3A]/40 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-48 relative shrink-0">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A3A] to-transparent" />
                <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
                   <div className="text-white text-right">
                     <h3 className="text-2xl font-black font-serif italic mb-1">{selectedItem.name}</h3>
                     <p className="text-white/80 text-xs font-medium max-w-[80%]">{selectedItem.description}</p>
                   </div>
                   <div className="bg-white/20 backdrop-blur-md p-2 rounded-2xl text-white">
                      {CATEGORIES.find(c => c.id === selectedItem.category)?.icon && React.createElement(CATEGORIES.find(c => c.id === selectedItem.category)!.icon, { size: 24 })}
                   </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto text-right">
                <div className="space-y-4">
                  {!selectedItem.isRoom && (
                    <>
                      <p className="text-[11px] font-black uppercase tracking-widest text-[#6B4F45]">إضافات (اختياري)</p>
                      <div className="grid grid-cols-1 gap-2">
                        {EXTRAS.map((ex, idx) => {
                          const isSelected = selectedExtras.some(e => e.name === ex.name);
                          return (
                            <button 
                              key={idx}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedExtras(selectedExtras.filter(e => e.name !== ex.name));
                                } else {
                                  setSelectedExtras([...selectedExtras, ex]);
                                }
                              }}
                              className={`p-3.5 rounded-2xl border flex justify-between items-center transition-all ${isSelected ? 'bg-[#D8A08A] border-[#D8A08A] text-white' : 'bg-white border-[#E8E2DE] text-[#2C2A3A] hover:border-[#D8A08A]'}`}
                            >
                              <span className="font-bold text-sm tracking-wide">{ex.name}</span>
                              <div className="flex items-center gap-3">
                                <span className={`text-[11px] font-black italic ${isSelected ? 'text-white/90' : 'text-[#D8A08A]'}`}>+{ex.price.toFixed(3)} ر.ع</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-white border-white text-[#D8A08A]' : 'border-gray-200'}`}>
                                  {isSelected && <CheckCircle size={14} strokeWidth={3} />}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                  {selectedItem.isRoom && (
                     <div className="bg-[#F4E9E4]/50 p-4 rounded-2xl border border-[#E8E2DE]">
                        <p className="text-sm text-[#2C2A3A] font-medium leading-relaxed">
                          هذه المساحة تُحجز بنظام الساعات. سيتم إضافة هذا العنصر للسلة، وسيتم التواصل معك لتأكيد أوقات الحجز وتوفير التجهيزات اللازمة بعد إتمام الطلب لتجربة مثالية في كوفيكس.
                        </p>
                     </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white border-t border-[#E8E2DE] shrink-0 mt-auto">
                <div className="bg-[#F4E9E4] p-4 rounded-2xl flex justify-between items-center mb-4">
                  <span className="text-sm font-black uppercase tracking-widest text-[#6B4F45]">المجموع</span>
                  <span className="text-2xl font-serif italic font-black text-[#D8A08A]">
                    {(selectedItem.price + selectedExtras.reduce((a,c) => a+c.price, 0)).toFixed(3)} <span className="text-xs not-italic text-[#2C2A3A]">ر.ع {selectedItem.isRoom && '/ ساعة'}</span>
                  </span>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#2C2A3A] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#D8A08A] transition-all shadow-xl active:scale-[0.98] outline-none"
                >
                  إضافة للسلة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerMenu;
