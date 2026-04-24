import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CustomerCart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="p-6 h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-[#F4E9E4] rounded-full flex items-center justify-center text-[#D8A08A]">
          <ShoppingBag size={40} />
        </div>
        <div>
          <h2 className="text-xl font-black font-serif text-[#2C2A3A] mb-2">السلة فارغة</h2>
          <p className="text-sm text-[#6E6E6E]">لم تقم بإضافة أي منتجات للسلة بعد</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-8 py-3 bg-[#2C2A3A] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg"
        >
          تصفح المنيو
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20} /></button>
        <h2 className="text-xl font-black font-serif text-[#2C2A3A]">سلة المشتريات</h2>
      </div>

      <div className="space-y-4">
        {cart.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-3xl border border-[#E8E2DE] shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-[#2C2A3A]">{item.name}</h3>
                <p className="text-[#D8A08A] font-black text-sm italic mt-1">
                  {((item.price + item.extras.reduce((a,c)=>a+c.price,0)) * item.quantity).toFixed(3)} ر.ع
                </p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-rose-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
            
            {item.extras.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.extras.map((ex, ei) => (
                  <span key={ei} className="text-[9px] px-2 py-0.5 bg-[#F4E9E4] text-[#6B4F45] rounded-full font-bold">
                    +{ex.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#F4E9E4]">
              <span className="text-[10px] font-bold text-[#6E6E6E]">الكمية</span>
              <div className="flex items-center gap-3 bg-[#F4E9E4]/50 p-1.5 rounded-xl">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-[#6E6E6E]">
                  <Minus size={14} />
                </button>
                <span className="text-sm font-black text-[#2C2A3A] w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-[#2C2A3A]">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-3xl border border-[#E8E2DE] shadow-sm space-y-3 mt-8">
        <div className="flex justify-between items-center text-sm font-bold text-[#6E6E6E]">
          <span>المجموع الفرعي</span>
          <span>{cartTotal.toFixed(3)} ر.ع</span>
        </div>
        <div className="flex justify-between items-center text-sm font-bold text-[#6E6E6E]">
          <span>الضريبة (5%)</span>
          <span>{(cartTotal * 0.05).toFixed(3)} ر.ع</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[#E8E2DE]">
          <span className="font-black text-[#2C2A3A]">الإجمالي</span>
          <span className="text-xl font-serif italic font-black text-[#D8A08A]">
            {(cartTotal * 1.05).toFixed(3)} ر.ع
          </span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/checkout')}
        className="w-full py-4 bg-[#2C2A3A] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#D8A08A] transition-all shadow-lg flex justify-between items-center px-6"
      >
        <span>متابعة الدفع</span>
        <span className="bg-white/20 px-3 py-1 rounded-lg">{(cartTotal * 1.05).toFixed(3)} ر.ع</span>
      </button>
    </div>
  );
};

export default CustomerCart;
