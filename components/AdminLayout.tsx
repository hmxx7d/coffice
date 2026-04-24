
import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
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
  Package,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', path: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'rooms', path: '/admin/rooms', label: 'إدارة الغرف', icon: DoorOpen },
    { id: 'clients', path: '/admin/clients', label: 'العملاء', icon: Users },
    { id: 'subscriptions', path: '/admin/subscriptions', label: 'الاشتراكات', icon: CreditCard },
    { id: 'bookings', path: '/admin/bookings', label: 'الحجوزات', icon: Clock },
    { id: 'cafe', path: '/admin/cafe', label: 'الكافيه', icon: Coffee },
    { id: 'inventory', path: '/admin/inventory', label: 'المخزون', icon: Package },
    { id: 'finance', path: '/admin/finance', label: 'النظام المالي', icon: BarChart3 },
  ];

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

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Exact match for dashboard, otherwise prefix match
            const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);
            
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#D8A08A] text-white shadow-lg shadow-[#D8A08A]/20 scale-[1.02]' 
                      : 'text-gray-400 hover:bg-[#3E3C4E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    {sidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
                  </div>
                </button>
                
                {/* Sub-menu for rooms */}
                {item.id === 'rooms' && sidebarOpen && isActive && (
                  <div className="pl-12 pr-4 py-2 flex flex-col gap-2 border-r-2 border-[#D8A08A] ml-2 rtl:mr-2 rtl:ml-0 rtl:border-r-0 rtl:border-l-2 rtl:pr-12 rtl:pl-4">
                    <button onClick={() => navigate('/admin/rooms?category=studio')} className="text-xs font-bold text-gray-400 hover:text-white text-right transition-colors">استوديو</button>
                    <button onClick={() => navigate('/admin/rooms?category=workshop')} className="text-xs font-bold text-gray-400 hover:text-white text-right transition-colors">ورش عمل</button>
                    <button onClick={() => navigate('/admin/rooms?category=meeting')} className="text-xs font-bold text-gray-400 hover:text-white text-right transition-colors">غرف اجتماعات</button>
                    <button onClick={() => navigate('/admin/rooms?category=workspace')} className="text-xs font-bold text-gray-400 hover:text-white text-right transition-colors">مساحات عمل</button>
                    <button onClick={() => navigate('/admin/rooms?category=podcast')} className="text-xs font-bold text-gray-400 hover:text-white text-right transition-colors">بودكاست</button>
                  </div>
                )}
              </div>
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
                <p className="text-sm font-bold text-[#2C2A3A]">مدير كوفيكس</p>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-wider text-rose-500 font-bold flex items-center justify-end gap-1 hover:text-rose-600 transition-colors mt-1"
                >
                  <span>تسجيل الخروج</span>
                  <LogOut size={12} />
                </button>
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
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
