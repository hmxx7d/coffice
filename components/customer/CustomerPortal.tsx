import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, ShoppingBag, Home, LogIn, LayoutDashboard } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const CustomerPortal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerOrderId } = useOrders();
  const { user, loginAnonymously, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      loginAnonymously();
    }
  }, [user, loginAnonymously]);

  return (
    <div className="min-h-screen bg-[#F4E9E4] flex flex-col font-sans text-right" dir="rtl">
      {/* Mobile Header */}
      <header className="bg-[#2C2A3A] text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#D8A08A] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-black font-serif italic">C</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight font-serif">كوفيكس</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-white hover:text-[#D8A08A] transition-colors"
            >
              <span className="text-[11px] font-bold hidden sm:inline">لوحة التحكم</span>
              <LayoutDashboard size={20} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-white hover:text-[#D8A08A] transition-colors"
            >
              <span className="text-[11px] font-bold hidden sm:inline">تسجيل دخول</span>
              <LogIn size={20} />
            </button>
          )}

          {customerOrderId && (
            <button 
              onClick={() => navigate(`/tracking/${customerOrderId}`)}
              className="text-[#D8A08A] text-xs font-bold underline"
            >
              تتبع طلبي
            </button>
          )}
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2 text-white hover:text-[#D8A08A] transition-colors"
          >
            <ShoppingBag size={24} />
            {/* We could add a cart item count badge here if we had a global cart context */}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#E8E2DE] flex justify-around items-center p-3 pb-safe z-50">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-[#D8A08A]' : 'text-[#6E6E6E]'}`}
        >
          <Home size={20} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button 
          onClick={() => navigate('/cart')}
          className={`flex flex-col items-center gap-1 ${location.pathname === '/cart' ? 'text-[#D8A08A]' : 'text-[#6E6E6E]'}`}
        >
          <ShoppingBag size={20} />
          <span className="text-[10px] font-bold">السلة</span>
        </button>
      </nav>
    </div>
  );
};

export default CustomerPortal;
