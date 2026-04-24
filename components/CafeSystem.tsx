
import React, { useState } from 'react';
import { 
  Coffee, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  BellRing, 
  CheckCircle, 
  Trash2, 
  ChevronRight,
  ChevronLeft,
  X,
  PlusCircle,
  History
} from 'lucide-react';
import { useCafeInventory } from '../context/CafeInventoryContext';
import { useFinance } from '../context/FinanceContext';
import { CartItem } from '../context/OrderContext';
import { useOrdersFirestore, OrderStatus } from '../hooks/useOrdersFirestore';

const EXTRAS = [
  { name: 'إضافة إسبريسو', price: 0.500 },
  { name: 'حليب نباتي', price: 0.300 },
  { name: 'نكهة كراميل', price: 0.200 },
  { name: 'نكهة فانيلا', price: 0.200 },
];

const CafeSystem: React.FC = () => {
  const { products, processOrder } = useCafeInventory();
  const { addTransaction } = useFinance();
  const { orders, submitOrder, updateOrderStatus } = useOrdersFirestore();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');

  const [isExtrasModalOpen, setIsExtrasModalOpen] = useState(false);
  const [itemPendingExtras, setItemPendingExtras] = useState<any>(null);
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);

  const handleItemClick = (item: any) => {
    setItemPendingExtras(item);
    setSelectedExtras([]);
    setIsExtrasModalOpen(true);
  };

  const confirmAddToCart = () => {
    if (!itemPendingExtras) return;

    const cartId = `${itemPendingExtras.name}-${selectedExtras.map(e => e.name).join('-')}`;
    const existingIndex = cart.findIndex(i => i.id === cartId);

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, {
        id: cartId,
        name: itemPendingExtras.name,
        price: itemPendingExtras.price,
        quantity: 1,
        extras: [...selectedExtras]
      }]);
    }
    setIsExtrasModalOpen(false);
    setItemPendingExtras(null);
  };

  const removeFromCart = (id: string) => {
    const existing = cart.find(i => i.id === id);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
    } else {
      setCart(cart.filter(i => i.id !== id));
    }
  };

  const calculateItemTotal = (item: CartItem) => {
    const extrasTotal = item.extras.reduce((acc, curr) => acc + curr.price, 0);
    return (item.price + extrasTotal) * item.quantity;
  };

  const total = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);

  const createOrder = async () => {
    try {
      const orderId = await submitOrder({
        clientName: selectedClient || 'عميل عابر',
        items: [...cart],
        totalPrice: total,
        source: 'in-store'
      });
      
      processOrder(cart);
      
      if (total > 0) {
        addTransaction({
          type: 'INCOME',
          category: 'CAFE_SALE',
          amount: total,
          description: `طلب كافيه - ${selectedClient || 'عميل عابر'}`,
          referenceId: orderId
        });
      }

      setCart([]);
      setSelectedClient('');
      setActiveTab('orders');
    } catch (error) {
      console.error("Error creating order:", error);
      alert('حدث خطأ أثناء إنشاء الطلب');
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'جديد': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'قيد التحضير': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'جاهز': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'تم التسليم': return 'bg-gray-50 text-gray-400 border-gray-100';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'جديد': return <BellRing size={14} />;
      case 'قيد التحضير': return <ChefHat size={14} />;
      case 'جاهز': return <Clock size={14} />;
      case 'تم التسليم': return <CheckCircle size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Header with Tabs */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">بوتيك كوفيكس</h2>
          <p className="text-[#6E6E6E] text-sm mt-1">نظام المبيعات وتتبع الطلبات الذكي</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-[#E8E2DE] shadow-sm">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-[#2C2A3A] text-white shadow-lg' : 'text-[#6E6E6E] hover:text-[#2C2A3A]'}`}
          >
            القائمة
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-[#2C2A3A] text-white shadow-lg' : 'text-[#6E6E6E] hover:text-[#2C2A3A]'}`}
          >
            الطلبات الحالية
            {orders.filter(o => o.status !== 'تم التسليم').length > 0 && (
              <span className="w-5 h-5 bg-[#D8A08A] text-white rounded-full flex items-center justify-center text-[10px]">
                {orders.filter(o => o.status !== 'تم التسليم').length}
              </span>
            )}
          </button>
        </div>
      </header>

      {activeTab === 'menu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Menu Selection Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {['الكل', 'قهوة ساخنة', 'قهوة باردة', 'حلويات', 'سناكس'].map((cat, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#D8A08A] text-white border-[#D8A08A]' : 'bg-white text-[#6E6E6E] border-[#E8E2DE] hover:border-[#D8A08A] hover:text-[#D8A08A]'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.filter(p => selectedCategory === 'الكل' || p.category === selectedCategory).map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className="bg-white p-6 rounded-[28px] border border-[#E8E2DE] shadow-sm hover:shadow-xl hover:border-[#D8A08A]/30 transition-all text-right group relative overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#F4E9E4] rounded-full group-hover:scale-[3] transition-transform duration-700 opacity-50" />
                  <div className="relative">
                    <div className="w-14 h-14 bg-[#2C2A3A] text-[#D8A08A] rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform shadow-lg shadow-black/10">
                      <Coffee size={26} strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-lg text-[#2C2A3A] font-serif">{item.name}</h3>
                    <p className="text-[#D8A08A] font-black text-xl mt-2 italic">{Number(item.price).toFixed(3)} <span className="text-[10px] uppercase not-italic">ر.ع</span></p>
                    <div className="mt-4 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#6E6E6E] opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlusCircle size={12} className="text-[#D8A08A]" /> تخصيص الطلب
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* POS Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-2xl overflow-hidden sticky top-10">
              <div className="p-8 bg-[#2C2A3A] text-white text-center relative">
                <div className="absolute top-4 left-4 text-white/20"><History size={40} /></div>
                <div className="w-16 h-16 bg-[#D8A08A] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-black/20">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-xl font-black font-serif italic tracking-tight">سلة المبيعات</h3>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 font-bold">ربط مباشر مع الحجوزات</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45] block">العميل المرتبط</label>
                  <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={18} />
                    <input 
                      type="text" 
                      placeholder="ابحث بالاسم أو رقم الهاتف..." 
                      className="w-full pr-12 pl-6 py-4 bg-[#F4E9E4]/40 border border-[#E8E2DE] rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#D8A08A] transition-all"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                    />
                  </div>
                </div>

                <div className="min-h-[220px] border-y border-[#F4E9E4] py-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-[#E8E2DE] gap-4 py-12">
                      <Coffee size={64} strokeWidth={1} />
                      <p className="text-sm font-bold text-[#6E6E6E]">السلة فارغة حالياً</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 group animate-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-black text-[#2C2A3A]">{item.name}</p>
                              <p className="text-[11px] text-[#D8A08A] font-bold">{calculateItemTotal(item).toFixed(3)} ر.ع</p>
                            </div>
                            <div className="flex items-center gap-4 bg-[#F4E9E4]/50 p-2 rounded-xl">
                              <button onClick={() => removeFromCart(item.id)} className="text-[#6E6E6E] hover:text-rose-500 transition-colors"><Minus size={14} strokeWidth={3} /></button>
                              <span className="text-sm font-black text-[#2C2A3A] w-5 text-center">{item.quantity}</span>
                              <button onClick={() => {
                                const newCart = [...cart];
                                newCart[idx].quantity += 1;
                                setCart(newCart);
                              }} className="text-[#6E6E6E] hover:text-[#D8A08A] transition-colors"><Plus size={14} strokeWidth={3} /></button>
                            </div>
                          </div>
                          {item.extras.length > 0 && (
                            <div className="flex flex-wrap gap-1 pr-2">
                              {item.extras.map((ex, ei) => (
                                <span key={ei} className="text-[9px] px-2 py-0.5 bg-[#F4E9E4] text-[#6B4F45] rounded-full border border-[#E8E2DE] font-bold">+{ex.name}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold text-[#6E6E6E]">
                    <span>قيمة الطلبات</span>
                    <span>{total.toFixed(3)} ر.ع</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-[#F4E9E4]">
                    <span className="text-lg font-black text-[#2C2A3A] font-serif italic">الإجمالي النهائي</span>
                    <span className="text-3xl font-black text-[#D8A08A] font-serif tracking-tighter">{total.toFixed(3)} <span className="text-xs">ر.ع</span></span>
                  </div>
                </div>

                <button 
                  onClick={createOrder}
                  className="w-full bg-[#2C2A3A] text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#D8A08A] transition-all shadow-xl active:scale-[0.98] disabled:opacity-30"
                  disabled={cart.length === 0}
                >
                  <CheckCircle2 size={20} />
                  إرسال الطلب للمطبخ
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Orders Management View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[32px] border border-[#E8E2DE] shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
              <div className="p-6 border-b border-[#F4E9E4] flex justify-between items-center bg-[#F4E9E4]/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif italic font-black text-lg text-[#2C2A3A]">{order.id}</h4>
                    {order.source === 'online' && (
                      <span className="bg-[#D8A08A] text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">أونلاين</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#6E6E6E] font-bold uppercase tracking-widest">{order.createdAt?.toDate().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#2C2A3A] rounded-xl flex items-center justify-center text-[#D8A08A] font-bold font-serif italic">
                    {order.clientName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#2C2A3A]">{order.clientName}</p>
                    <p className="text-[10px] text-[#6E6E6E] font-bold">طاولة/حجز مرتبطة</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, ii) => (
                    <div key={ii} className="flex justify-between items-start text-xs border-b border-[#F4E9E4] pb-2 last:border-0">
                      <div>
                        <p className="font-bold text-[#2C2A3A]">{item.quantity}x {item.name}</p>
                        {item.extras.map((ex, ei) => (
                          <p key={ei} className="text-[9px] text-[#D8A08A] mt-0.5">• {ex.name}</p>
                        ))}
                      </div>
                      <span className="font-bold text-[#6E6E6E]">{calculateItemTotal(item).toFixed(3)} ر.ع</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50/50 border-t border-[#F4E9E4]">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#6E6E6E]">المجموع الكلي</span>
                  <span className="text-xl font-serif italic font-black text-[#D8A08A]">{order.totalPrice.toFixed(3)} ر.ع</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {order.status === 'جديد' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'قيد التحضير')}
                      className="col-span-2 py-3 bg-[#2C2A3A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D8A08A] transition-all flex items-center justify-center gap-2"
                    >
                      <ChefHat size={14} /> بدء التحضير
                    </button>
                  )}
                  {order.status === 'قيد التحضير' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'جاهز')}
                      className="col-span-2 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                      <BellRing size={14} /> تنبيه الجاهزية
                    </button>
                  )}
                  {order.status === 'جاهز' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'تم التسليم')}
                      className="col-span-2 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> تم التسليم
                    </button>
                  )}
                  {order.status === 'تم التسليم' && (
                    <div className="col-span-2 py-3 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                      مكتمل ومغلق
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="col-span-full h-96 flex flex-col items-center justify-center text-[#E8E2DE] gap-4">
               <History size={80} strokeWidth={1} />
               <p className="text-xl font-serif italic text-[#6E6E6E]">لا توجد طلبات نشطة حالياً</p>
            </div>
          )}
        </div>
      )}

      {/* Extras Modal */}
      {isExtrasModalOpen && itemPendingExtras && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsExtrasModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE]">
            <div className="p-8 bg-[#2C2A3A] text-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-[#D8A08A] rounded-2xl text-white shadow-lg"><Coffee size={24} /></div>
                 <div>
                   <h3 className="text-xl font-black font-serif italic">{itemPendingExtras.name}</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">تخصيص كوبك الخاص</p>
                 </div>
               </div>
               <button onClick={() => setIsExtrasModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white/40"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">اختر الإضافات (Extras)</p>
                <div className="grid grid-cols-1 gap-3">
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
                        className={`p-4 rounded-[22px] border flex justify-between items-center transition-all ${isSelected ? 'bg-[#D8A08A] border-[#D8A08A] text-white shadow-lg' : 'bg-white border-[#E8E2DE] text-[#2C2A3A] hover:border-[#D8A08A]'}`}
                      >
                        <span className="font-bold text-sm">{ex.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black italic ${isSelected ? 'text-white/80' : 'text-[#D8A08A]'}`}>{ex.price.toFixed(3)} ر.ع</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-white border-white text-[#D8A08A]' : 'border-gray-200'}`}>
                            {isSelected && <CheckCircle size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-[#F4E9E4] p-6 rounded-[30px] flex justify-between items-center">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">قيمة الكوب</p>
                  <p className="text-[10px] text-[#6E6E6E] font-bold">+ الإضافات المختارة</p>
                </div>
                <div className="text-left">
                  <span className="text-3xl font-serif italic font-black text-[#D8A08A] tracking-tighter">
                    {(itemPendingExtras.price + selectedExtras.reduce((a,c) => a+c.price, 0)).toFixed(3)}
                  </span>
                  <span className="text-xs font-black ml-1 text-[#2C2A3A]">ر.ع</span>
                </div>
              </div>

              <button 
                onClick={confirmAddToCart}
                className="w-full py-5 bg-[#2C2A3A] text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-[#D8A08A] transition-all shadow-xl active:scale-95"
              >
                إضافة للسلة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeSystem;
