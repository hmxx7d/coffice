
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  DoorOpen, 
  Users, 
  CreditCard, 
  Clock, 
  Coffee, 
  BarChart3, 
  Menu,
  X,
  Search,
  UserCircle,
  Bell,
  Package
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import RoomManager from './components/RoomManager';
import ClientManager from './components/ClientManager';
import SubscriptionManager from './components/SubscriptionManager';
import BookingCalendar from './components/BookingCalendar';
import CafeSystem from './components/CafeSystem';
import FinancialReports from './components/FinancialReports';
import InventoryManager from './components/InventoryManager';

type View = 'dashboard' | 'rooms' | 'clients' | 'subscriptions' | 'bookings' | 'cafe' | 'finance' | 'inventory';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'rooms', label: 'إدارة الغرف', icon: DoorOpen },
    { id: 'clients', label: 'العملاء', icon: Users },
    { id: 'subscriptions', label: 'الاشتراكات', icon: CreditCard },
    { id: 'bookings', label: 'الحجوزات', icon: Clock },
    { id: 'cafe', label: 'الكافيه', icon: Coffee },
    { id: 'inventory', label: 'المخزون', icon: Package },
    { id: 'finance', label: 'النظام المالي', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'rooms': return <RoomManager />;
      case 'clients': return <ClientManager />;
      case 'subscriptions': return <SubscriptionManager />;
      case 'bookings': return <BookingCalendar />;
      case 'cafe': return <CafeSystem />;
      case 'inventory': return <InventoryManager />;
      case 'finance': return <FinancialReports />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4E9E4] flex overflow-hidden text-right" dir="rtl">
      {/* Sidebar - Deep Cafe Navy */}
      <aside 
        className={`${
          sidebarOpen ? 'w-68' : 'w-20'
        } bg-[#2C2A3A] text-white transition-all duration-500 flex flex-col z-50 shadow-2xl`}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D8A08A] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20">
            <span className="text-2xl font-black font-serif italic">C</span>
          </div>
          {sidebarOpen && <h1 className="text-xl font-bold tracking-tight font-serif">كوفيكس</h1>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#D8A08A] text-white shadow-lg shadow-[#D8A08A]/20 scale-[1.02]' 
                    : 'text-gray-400 hover:bg-[#3E3C4E] hover:text-white'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {sidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {sidebarOpen && <span className="font-bold text-sm">إغلاق القائمة</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header - White & Navy accents */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#E8E2DE] flex items-center justify-between px-10 z-40 sticky top-0">
          <div className="flex items-center gap-4 bg-[#F4E9E4]/50 px-5 py-2.5 rounded-2xl w-96 max-md:hidden border border-[#E8E2DE]">
            <Search size={18} className="text-[#6B4F45]" />
            <input 
              type="text" 
              placeholder="ابحث عن تجربة قهوة فريدة..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-[#6E6E6E]"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-[#2C2A3A] hover:text-[#D8A08A] transition-colors p-2">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D8A08A] rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-4 border-r pr-6 border-[#E8E2DE]">
              <div className="text-right">
                <p className="text-sm font-bold text-[#2C2A3A]">أحمد العبدالله</p>
                <p className="text-[10px] uppercase tracking-wider text-[#6B4F45] font-bold">مدير كوفيكس</p>
              </div>
              <div className="w-12 h-12 bg-[#F4E9E4] text-[#2C2A3A] rounded-2xl flex items-center justify-center border border-[#E8E2DE] shadow-sm">
                <UserCircle size={28} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
