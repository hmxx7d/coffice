
import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  PieChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'الاشتراكات', value: 12000, color: '#2C2A3A' },
  { name: 'حجوزات الساعات', value: 4500, color: '#D8A08A' },
  { name: 'مبيعات الكافيه', value: 2800, color: '#6B4F45' },
  { name: 'خدمات إضافية', value: 1200, color: '#E8E2DE' },
];

const FinancialReports: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">التحليل المالي الاستراتيجي</h2>
          <p className="text-[#6E6E6E] text-sm mt-1">تتبع نمو كوفيكس وتحليل التدفقات النقدية</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-[#E8E2DE] rounded-[18px] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-[#2C2A3A] shadow-sm">
            <Calendar size={18} className="ml-3 text-[#D8A08A]" />
            01 يناير 2024 - 31 ديسمبر 2024
          </div>
          <button className="flex items-center gap-2 bg-[#2C2A3A] text-white px-8 py-3.5 rounded-[18px] font-black text-[11px] uppercase tracking-widest hover:bg-[#D8A08A] transition-all shadow-xl shadow-black/10">
            <Download size={18} />
            <span>تصدير البيانات</span>
          </button>
        </div>
      </header>

      {/* Modern Finance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-[#E8E2DE] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#D8A08A]"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-[#F4E9E4] text-[#D8A08A] rounded-[22px]"><DollarSign size={28} /></div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
              <ArrowUp size={14} /> 12% نمو
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6E6E] mb-1">إجمالي الإيرادات السنوية</p>
          <h3 className="text-4xl font-serif italic font-black text-[#2C2A3A] tracking-tighter">2.050 <span className="text-lg not-italic opacity-50">ر.ع</span></h3>
        </div>

        <div className="bg-[#2C2A3A] p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-white/5 text-[#D8A08A] rounded-[22px] border border-white/10"><ArrowDown size={28} /></div>
            <div className="flex items-center gap-1 text-[10px] text-[#D8A08A] font-black bg-white/5 px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
              <ArrowUp size={14} /> 4% كفاءة
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">المصروفات التشغيلية</p>
          <h3 className="text-4xl font-serif italic font-black text-[#D8A08A] tracking-tighter">0.420 <span className="text-lg not-italic opacity-30">ر.ع</span></h3>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-[#E8E2DE] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-[#2C2A3A]"></div>
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-[#2C2A3A] text-[#D8A08A] rounded-[22px] shadow-lg"><TrendingUp size={28} /></div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
              <ArrowUp size={14} /> 25% ربحية
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#6E6E6E] mb-1">صافي الأرباح المحققة</p>
          <h3 className="text-4xl font-serif italic font-black text-[#2C2A3A] tracking-tighter">1.630 <span className="text-lg not-italic opacity-50">ر.ع</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[40px] border border-[#E8E2DE] shadow-sm">
          <h3 className="font-bold text-xl mb-10 flex items-center gap-3 text-[#2C2A3A] font-serif italic">
            <PieChart size={24} className="text-[#D8A08A]" />
            توزيع مصادر الدخل
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F4E9E4" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6E6E6E', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{ fill: '#F4E9E4' }}
                  contentStyle={{ borderRadius: '24px', border: '1px solid #E8E2DE', padding: '20px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 15, 15, 0]} barSize={36}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-[#E8E2DE] shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-xl flex items-center gap-3 text-[#2C2A3A] font-serif italic">
              <FileText size={24} className="text-[#D8A08A]" />
              آخر العمليات الفاخرة
            </h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#D8A08A] hover:underline">السجل المالي الكامل</button>
          </div>
          <div className="space-y-6">
            {[
              { id: '#INV-402', client: 'سارة خالد', amount: '45.000 ر.ع', date: '2024/05/28', status: 'مقبولة' },
              { id: '#INV-401', client: 'محمد العمري', amount: '8.000 ر.ع', date: '2024/05/27', status: 'مقبولة' },
              { id: '#INV-400', client: 'نورة السعيد', amount: '12.000 ر.ع', date: '2024/05/27', status: 'قيد المراجعة' },
            ].map((inv, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 bg-[#F4E9E4]/20 rounded-[28px] hover:bg-[#F4E9E4]/50 transition-all cursor-pointer border border-transparent hover:border-[#D8A08A]/20 group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#6E6E6E] group-hover:text-[#D8A08A] shadow-sm transition-colors border border-[#E8E2DE]">
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#2C2A3A] tracking-tighter">{inv.id}</p>
                    <p className="text-[10px] font-bold text-[#6E6E6E] uppercase tracking-widest">{inv.client} • {inv.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-serif italic font-black text-[#2C2A3A] mb-1">{inv.amount}</p>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${inv.status === 'مقبولة' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-[#D8A08A]/10 text-[#D8A08A] border border-[#D8A08A]/20'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
