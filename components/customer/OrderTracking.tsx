import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ChefHat, Clock, CheckCircle, Home, Loader2 } from 'lucide-react';
import { useCustomerOrder } from '../../hooks/useOrdersFirestore';

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, loading } = useCustomerOrder(orderId);

  useEffect(() => {
    if (!loading && !order) {
      navigate('/');
    }
  }, [order, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#D8A08A]" />
      </div>
    );
  }

  if (!order) return null;

  const steps = [
    { status: 'جديد', label: 'تم استلام الطلب', icon: Clock },
    { status: 'قيد التحضير', label: 'جاري التحضير', icon: ChefHat },
    { status: 'جاهز', label: 'الطلب جاهز للاستلام', icon: CheckCircle2 },
    { status: 'تم التسليم', label: 'مكتمل', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="p-4 space-y-8">
      <div className="text-center mt-8 space-y-2">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black font-serif text-[#2C2A3A]">تم تأكيد طلبك!</h2>
        <p className="text-sm text-[#6E6E6E] font-bold">رقم الطلب: <span className="text-[#D8A08A]">{order.id}</span></p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E8E2DE] shadow-sm">
        <h3 className="font-bold text-sm text-[#2C2A3A] mb-6">حالة الطلب</h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E8E2DE] before:to-transparent">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isCompleted ? 'bg-[#D8A08A] text-white' : 'bg-[#F4E9E4] text-[#6E6E6E]'}`}>
                  <Icon size={16} />
                </div>
                <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl ${isCurrent ? 'bg-[#2C2A3A] text-white shadow-lg' : 'bg-transparent'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-sm ${isCurrent ? 'text-white' : isCompleted ? 'text-[#2C2A3A]' : 'text-[#6E6E6E]'}`}>{step.label}</h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E8E2DE] shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-[#2C2A3A] border-b border-[#F4E9E4] pb-3">تفاصيل الطلب</h3>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm">
            <span className="font-bold text-[#6E6E6E]">{item.quantity}x {item.name}</span>
            <span className="font-black text-[#2C2A3A]">{((item.price + item.extras.reduce((a,c)=>a+c.price,0)) * item.quantity).toFixed(3)} ر.ع</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 border-t border-[#F4E9E4]">
          <span className="font-bold text-[#2C2A3A]">الإجمالي</span>
          <span className="font-black text-[#D8A08A]">{order.totalPrice.toFixed(3)} ر.ع</span>
        </div>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="w-full py-4 bg-[#F4E9E4] text-[#2C2A3A] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#E8E2DE] transition-all flex justify-center items-center gap-2"
      >
        <Home size={16} /> العودة للرئيسية
      </button>
    </div>
  );
};

export default OrderTracking;
