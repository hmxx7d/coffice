
import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Filter, 
  X, 
  User, 
  DoorClosed,
  CheckCircle2,
  AlertCircle,
  Phone,
  UserPlus,
  Search,
  Coffee,
  Printer,
  Wifi,
  FileText,
  BadgePercent,
  CreditCard
} from 'lucide-react';

const MOCK_CLIENTS = [
  { id: '1', name: 'سارة خالد', phone: '96891234567' },
  { id: '2', name: 'محمد العمري', phone: '96895987654' },
  { id: '3', name: 'عبدالرحمن العتيبي', phone: '96894555666' },
];

const ADDITIONAL_SERVICES = [
  { id: 'coffee', name: 'باقة ضيافة قهوة', icon: Coffee, price: 2.500 },
  { id: 'print', name: 'خدمات طباعة', icon: Printer, price: 1.000 },
  { id: 'wifi', name: 'إنترنت فائق السرعة', icon: Wifi, price: 0.500 },
];

const BookingCalendar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  
  const [bookingData, setBookingData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    room: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    additionalServices: [] as string[],
    status: 'مؤكد',
    invoiceId: `INV-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`
  });

  const hours = Array.from({ length: 14 }, (_, i) => i + 8);
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const rooms = [
    { id: '1', name: 'VIP 101', price: 8.000 },
    { id: '2', name: 'Academy A', price: 10.000 },
    { id: '3', name: 'Focus Desk', price: 3.500 },
  ];

  const foundClient = useMemo(() => {
    if (!phoneSearch) return null;
    return MOCK_CLIENTS.find(c => c.phone.includes(phoneSearch) || phoneSearch.includes(c.phone));
  }, [phoneSearch]);

  const calculateTotalPrice = () => {
    const selectedRoom = rooms.find(r => r.id === bookingData.room);
    let total = 0;
    
    // Room price
    if (selectedRoom) {
      const start = parseInt(bookingData.startTime.split(':')[0]);
      const end = parseInt(bookingData.endTime.split(':')[0]);
      const duration = end - start;
      if (duration > 0) {
        total += selectedRoom.price * duration;
      }
    }

    // Services price
    bookingData.additionalServices.forEach(serviceId => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
      if (service) total += service.price;
    });

    return total.toFixed(3);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneSearch(val);
    if (foundClient) {
      setIsRegisteringNew(false);
      setBookingData(prev => ({ ...prev, clientId: foundClient.id, clientName: foundClient.name, clientPhone: foundClient.phone }));
    } else {
      setBookingData(prev => ({ ...prev, clientId: '', clientName: '', clientPhone: val }));
    }
  };

  const toggleService = (serviceId: string) => {
    setBookingData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(id => id !== serviceId)
        : [...prev.additionalServices, serviceId]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">إدارة الحجوزات</h2>
          <p className="text-[#6E6E6E] text-sm mt-1">نظام كوفيكس المتكامل لإدارة تجربة الضيف</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-[#E8E2DE] rounded-2xl px-3 py-1 shadow-sm">
            <button className="p-2 text-[#D8A08A] hover:bg-[#F4E9E4] rounded-xl"><ChevronRight size={20} /></button>
            <span className="px-6 py-2 font-black text-xs uppercase tracking-widest text-[#2C2A3A] min-w-[160px] text-center">يونيو 2024</span>
            <button className="p-2 text-[#D8A08A] hover:bg-[#F4E9E4] rounded-xl"><ChevronLeft size={20} /></button>
          </div>
          <button 
            onClick={() => { 
              setPhoneSearch(''); 
              setIsRegisteringNew(false); 
              setBookingData(prev => ({ ...prev, invoiceId: `INV-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`, additionalServices: [] }));
              setIsModalOpen(true); 
            }}
            className="flex items-center gap-3 bg-[#2C2A3A] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-[#D8A08A] transition-all"
          >
            <Plus size={18} />
            <span className="max-md:hidden">إضافة حجز شامل</span>
          </button>
        </div>
      </header>

      {/* Main Booking List View */}
      <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-[#F4E9E4] bg-[#F4E9E4]/10 flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-serif italic font-black text-xl text-[#2C2A3A]">جدول الحجوزات اليومية</h3>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={16} />
              <input type="text" placeholder="بحث بالرقم أو الفاتورة..." className="pr-10 pl-4 py-2 bg-white border border-[#E8E2DE] rounded-xl text-[10px] font-bold outline-none focus:ring-1 focus:ring-[#D8A08A]" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#2C2A3A] text-white/50 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">العميل / الرقم</th>
                <th className="px-6 py-5">المساحة</th>
                <th className="px-6 py-5 text-center">التوقيت</th>
                <th className="px-6 py-5">الخدمات</th>
                <th className="px-6 py-5">الحالة</th>
                <th className="px-6 py-5">الفاتورة</th>
                <th className="px-8 py-5">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E9E4]">
              {[
                { client: 'سارة خالد', phone: '96891234567', room: 'VIP 101', date: '2024-06-12', time: '10:00 - 12:00', services: ['قهوة', 'إنترنت'], status: 'مؤكد', inv: 'INV-0842', price: '18.500' },
                { client: 'محمد العمري', phone: '96895987654', room: 'Academy A', date: '2024-06-12', time: '14:00 - 16:00', services: ['طباعة'], status: 'انتظار', inv: 'INV-1250', price: '21.000' },
              ].map((b, i) => (
                <tr key={i} className="group hover:bg-[#F4E9E4]/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#2C2A3A]">{b.client}</span>
                      <span className="text-[10px] text-[#D8A08A] font-mono tracking-tighter">{b.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-bold text-[#6B4F45]">{b.room}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="inline-flex flex-col items-center bg-[#F4E9E4] px-4 py-1.5 rounded-xl border border-[#E8E2DE]">
                      <span className="text-[10px] font-black text-[#2C2A3A]">{b.time}</span>
                      <span className="text-[8px] text-[#6E6E6E] font-bold">{b.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex gap-1 flex-wrap">
                      {b.services.map((s, si) => (
                        <span key={si} className="px-2 py-0.5 bg-white border border-[#E8E2DE] rounded-md text-[8px] font-black text-[#D8A08A]">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${b.status === 'مؤكد' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-[#D8A08A]/10 text-[#D8A08A] border border-[#D8A08A]/20'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[11px] font-mono font-black text-[#6E6E6E] underline cursor-pointer hover:text-[#2C2A3A]">{b.inv}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-serif italic font-black text-[#2C2A3A] tracking-tighter">{b.price} <span className="text-[9px] not-italic opacity-50">ر.ع</span></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE] flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left Sidebar Info (Luxury Aesthetic) */}
            <div className="md:w-72 bg-[#2C2A3A] p-8 text-white flex flex-col justify-between border-l border-white/5">
              <div>
                <div className="w-14 h-14 bg-[#D8A08A] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20">
                  <BadgePercent size={28} />
                </div>
                <h3 className="text-2xl font-black font-serif italic leading-tight mb-2">تأكيد حجز كوفيكس</h3>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">رقم الفاتورة المبدئية</p>
                <div className="mt-2 py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-[12px] font-mono text-[#D8A08A] font-black inline-block">
                  {bookingData.invoiceId}
                </div>
              </div>

              <div className="space-y-6 pt-10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">الحالة المبدئية</span>
                  <select 
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 outline-none text-[#D8A08A] font-black"
                    value={bookingData.status}
                    onChange={(e) => setBookingData({...bookingData, status: e.target.value})}
                  >
                    <option className="bg-[#2C2A3A]" value="مؤكد">مؤكد</option>
                    <option className="bg-[#2C2A3A]" value="انتظار">انتظار</option>
                  </select>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">صافي الإجمالي</p>
                      <h4 className="text-4xl font-serif italic font-black text-[#D8A08A] tracking-tighter">{calculateTotalPrice()}</h4>
                    </div>
                    <span className="text-xs font-black opacity-30 mb-2">ر.ع</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Area */}
            <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-[#F4E9E4]/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-black text-[#2C2A3A] font-serif">بيانات الحجز والخدمات</h4>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-all text-[#6E6E6E]">
                  <X size={20} />
                </button>
              </div>

              {/* Step 1: Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45] flex items-center gap-2">
                    <Phone size={14} className="text-[#D8A08A]" />
                    رقم هاتف الضيف
                  </label>
                  <div className="relative">
                    <input 
                      type="tel"
                      placeholder="968XXXXXXXX"
                      className="w-full pr-12 pl-4 py-4 bg-white border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] transition-all font-mono text-lg font-bold"
                      value={phoneSearch}
                      onChange={handlePhoneChange}
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={20} />
                  </div>
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">اسم الضيف</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder={foundClient ? foundClient.name : "اسم الضيف الجديد..."}
                      disabled={!!foundClient}
                      className="w-full px-5 py-4 bg-white border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm disabled:bg-gray-50"
                      value={bookingData.clientName}
                      onChange={(e) => setBookingData({...bookingData, clientName: e.target.value})}
                    />
                    {!foundClient && !isRegisteringNew && (
                       <button onClick={() => setIsRegisteringNew(true)} className="p-4 bg-[#D8A08A] text-white rounded-2xl shadow-lg hover:bg-[#C08A75] transition-colors">
                         <UserPlus size={20} />
                       </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Room & Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#F4E9E4]">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45] flex items-center gap-2">
                    <DoorClosed size={14} className="text-[#D8A08A]" />
                    المساحة / القاعة
                  </label>
                  <select 
                    className="w-full bg-white border border-[#E8E2DE] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm appearance-none"
                    value={bookingData.room}
                    onChange={(e) => setBookingData({...bookingData, room: e.target.value})}
                  >
                    <option value="">اختر المساحة المناسبة...</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name} - ({r.price.toFixed(3)} ر.ع/س)</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">تاريخ الحجز</label>
                  <input type="date" className="w-full bg-white border border-[#E8E2DE] rounded-2xl px-5 py-4 outline-none text-right font-bold" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6E6E6E] text-center block italic">من</label>
                    <input type="time" className="w-full bg-white border border-[#E8E2DE] rounded-xl px-4 py-4 outline-none text-center font-black" value={bookingData.startTime} onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6E6E6E] text-center block italic">إلى</label>
                    <input type="time" className="w-full bg-white border border-[#E8E2DE] rounded-xl px-4 py-4 outline-none text-center font-black" value={bookingData.endTime} onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Step 3: Additional Services */}
              <div className="space-y-4 pt-6 border-t border-[#F4E9E4]">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الخدمات الإضافية (اختياري)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ADDITIONAL_SERVICES.map((service) => {
                    const Icon = service.icon;
                    const isSelected = bookingData.additionalServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`p-4 rounded-[22px] border flex flex-col items-center gap-2 transition-all duration-300 ${isSelected ? 'bg-[#D8A08A] border-[#D8A08A] text-white shadow-lg' : 'bg-white border-[#E8E2DE] text-[#2C2A3A] hover:border-[#D8A08A]'}`}
                      >
                        <Icon size={20} strokeWidth={isSelected ? 3 : 2} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{service.name}</span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-[#D8A08A]'}`}>{service.price.toFixed(3)} ر.ع</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Final Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  disabled={(!foundClient && !isRegisteringNew) || !bookingData.room || (isRegisteringNew && !bookingData.clientName)}
                  className="flex-1 py-5 bg-[#2C2A3A] text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl hover:bg-[#D8A08A] transition-all active:scale-[0.98] disabled:opacity-30"
                  onClick={() => { 
                    alert(`تم تأكيد الحجز برقم فاتورة: ${bookingData.invoiceId}`); 
                    setIsModalOpen(false); 
                  }}
                >
                  <CreditCard size={18} />
                  تأكيد الحجز وتوليد الفاتورة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helper Info Card */}
      <div className="flex items-center gap-4 p-8 bg-[#2C2A3A] border border-white/5 rounded-[32px] text-white/90 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#D8A08A] rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
        <div className="w-14 h-14 bg-[#F4E9E4] rounded-2xl flex items-center justify-center text-[#2C2A3A] flex-shrink-0 shadow-lg">
          <FileText size={28} />
        </div>
        <div className="flex-1 relative">
          <h4 className="font-serif italic font-black text-xl text-[#D8A08A]">تكامل الخدمات الذكي</h4>
          <p className="text-sm opacity-60 leading-relaxed mt-1">
            يقوم نظام كوفيكس بتوليد فاتورة رقمية مرتبطة بكل حجز فورياً، مما يسهل عليك تتبع المدفوعات والخدمات الإضافية للضيف في مكان واحد.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
