
import React from 'react';
import { 
  Users, 
  DoorOpen, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'الأحد', bookings: 40, revenue: 2400 },
  { name: 'الاثنين', bookings: 30, revenue: 1398 },
  { name: 'الثلاثاء', bookings: 20, revenue: 9800 },
  { name: 'الأربعاء', bookings: 27, revenue: 3908 },
  { name: 'الخميس', bookings: 18, revenue: 4800 },
  { name: 'الجمعة', bookings: 23, revenue: 3800 },
  { name: 'السبت', bookings: 34, revenue: 4300 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">لوحة التحكم الفاخرة</h2>
        <p className="text-[#6E6E6E] text-sm">أهلاً بك في كوفيكس، تجربة إدارة استثنائية</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'إجمالي الحجوزات', value: '1,284', icon: Clock, color: 'navy' },
          { title: 'العملاء النشطون', value: '452', icon: Users, color: 'copper' },
          { title: 'نسبة الإشغال', value: '86%', icon: DoorOpen, color: 'brown' },
          { title: 'إيرادات اليوم', value: '2.400 ر.ع', icon: DollarSign, color: 'copper' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-7 rounded-3xl border border-[#E8E2DE] shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs font-bold text-[#6E6E6E] mb-1 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-black text-[#2C2A3A] font-serif tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-emerald-600">
                <ArrowUpRight size={14} />
                <span>+12% زيادة</span>
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${stat.color === 'copper' ? 'bg-[#D8A08A] text-white' : 'bg-[#F4E9E4] text-[#2C2A3A]'} shadow-sm`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#E8E2DE] shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold text-xl text-[#2C2A3A] font-serif">نمو الإيرادات الأسبوعي</h3>
            <select className="text-xs font-bold border border-[#E8E2DE] bg-[#F4E9E4]/30 rounded-xl px-4 py-2 outline-none text-[#6B4F45]">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D8A08A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D8A08A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4E9E4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6E6E6E', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#6E6E6E', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: '1px solid #E8E2DE', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', padding: '15px' }}
                  labelStyle={{ fontWeight: '900', color: '#2C2A3A', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D8A08A" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Rooms */}
        <div className="bg-[#2C2A3A] p-8 rounded-3xl border border-white/5 shadow-2xl text-white">
          <h3 className="font-bold text-xl mb-8 font-serif italic text-[#D8A08A]">الأكثر تميزاً</h3>
          <div className="space-y-8">
            {[
              { name: 'غرفة VIP 101', count: 145, progress: 85 },
              { name: 'قاعة الأكاديمية A', count: 112, progress: 65 },
              { name: 'مكتب Focus 05', count: 98, progress: 55 },
              { name: 'غرفة اجتماعات 02', count: 45, progress: 30 },
            ].map((room, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-[#D8A08A] transition-colors">{room.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">إشغال ممتاز</p>
                  </div>
                  <span className="text-xs font-black text-[#D8A08A]">{room.count} حجز</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D8A08A] rounded-full transition-all duration-1000" 
                    style={{ width: `${room.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 text-xs font-black tracking-widest uppercase text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-[#D8A08A] hover:border-[#D8A08A] transition-all duration-300">
            تقرير الإشغال الكامل
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-3xl border border-[#E8E2DE] shadow-sm">
        <h3 className="font-bold text-xl mb-8 text-[#2C2A3A] font-serif">آخر الحركات المالية</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#F4E9E4] text-[#6E6E6E] text-[11px] uppercase tracking-widest font-black">
                <th className="pb-6 pr-4">العميل</th>
                <th className="pb-6">الغرفة</th>
                <th className="pb-6">المبلغ</th>
                <th className="pb-6">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E9E4]">
              {[
                { user: 'سارة خالد', room: 'غرفة فردية 101', price: '8.000 ر.ع', status: 'مؤكد', active: true },
                { user: 'محمد العمري', room: 'مكتب شبه مغلق 04', price: '3.500 ر.ع', status: 'مكتمل', active: true },
                { user: 'عبدالرحمن العتيبي', room: 'قاعة تدريس 01', price: '12.000 ر.ع', status: 'ملغي', active: false },
              ].map((activity, idx) => (
                <tr key={idx} className="group hover:bg-[#F4E9E4]/30 transition-colors">
                  <td className="py-6 pr-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#2C2A3A] text-[#D8A08A] flex items-center justify-center font-serif text-lg font-bold">
                        {activity.user[0]}
                      </div>
                      <span className="font-bold text-sm text-[#2C2A3A]">{activity.user}</span>
                    </div>
                  </td>
                  <td className="py-6 text-sm text-[#6E6E6E]">{activity.room}</td>
                  <td className="py-6 text-sm font-black text-[#D8A08A] italic">{activity.price}</td>
                  <td className="py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${activity.active ? 'bg-[#D8A08A]/10 text-[#D8A08A]' : 'bg-gray-100 text-gray-400'}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
