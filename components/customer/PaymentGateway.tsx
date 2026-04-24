import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowRight, Lock, Loader2, Phone, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrdersFirestore } from '../../hooks/useOrdersFirestore';
import { useOrders } from '../../context/OrderContext';
import { useClientsFirestore } from '../../hooks/useClientsFirestore';

const PaymentGateway: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { submitOrder } = useOrdersFirestore();
  const { setCustomerOrderId } = useOrders();
  const { addClient } = useClientsFirestore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const total = cartTotal * 1.05;

  const handlePayment = async () => {
    if (!clientName || !clientPhone) {
      alert('يرجى إدخال اسمك ورقم الهاتف لإتمام الطلب');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = await submitOrder({
        clientName,
        items: cart,
        totalPrice: total,
        source: 'online'
      });
      
      try {
        await addClient({
          name: clientName,
          phone: clientPhone,
          balance: 0,
          totalUsageHours: 0
        });
      } catch (clientError) {
        console.error("Warning: Couldn't create client record", clientError);
        // Continue anyway since payment and order succeeded
      }

      setCustomerOrderId(orderId);
      clearCart();
      navigate(`/tracking/${orderId}`);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20} /></button>
        <h2 className="text-xl font-black font-serif text-[#2C2A3A]">الدفع الآمن</h2>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E8E2DE] shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-[#F4E9E4]">
          <span className="font-bold text-[#6E6E6E] text-sm">المبلغ المطلوب</span>
          <span className="text-2xl font-serif italic font-black text-[#D8A08A]">{total.toFixed(3)} ر.ع</span>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الاسم لاستلام الطلب</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={18} />
              <input 
                type="text" 
                placeholder="أدخل اسمك الكريم..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">رقم الهاتف للتواصل</label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={18} />
              <input 
                type="tel" 
                placeholder="أدخل رقم هاتفك..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E8E2DE] shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-[#2C2A3A]">
          <CreditCard size={20} />
          <h3 className="font-bold text-sm">بيانات البطاقة</h3>
        </div>

        <div className="space-y-4 opacity-50 pointer-events-none">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#6E6E6E]">رقم البطاقة</label>
            <input type="text" value="**** **** **** 4242" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6E6E6E]">تاريخ الانتهاء</label>
              <input type="text" value="12/25" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center" dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#6E6E6E]">CVC</label>
              <input type="text" value="***" readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center" dir="ltr" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg">
          <Lock size={12} /> بوابة دفع تجريبية آمنة
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing || !clientName}
        className="w-full py-4 bg-[#2C2A3A] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#D8A08A] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          `دفع ${total.toFixed(3)} ر.ع`
        )}
      </button>
    </div>
  );
};

export default PaymentGateway;
