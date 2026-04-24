
import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreHorizontal, UserCheck, Calendar, Clock, Loader2 } from 'lucide-react';
import { useClientsFirestore } from '../hooks/useClientsFirestore';

const ClientManager: React.FC = () => {
  const { clients } = useClientsFirestore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.includes(searchTerm) || c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-transparent w-max">إدارة العملاء</h2>
          <p className="text-[#6E6E6E] mt-1 text-sm">متابعة حسابات العملاء المسجلين من الطلبات أو يدوياً</p>
        </div>
        <button className="flex items-center gap-2 bg-[#2C2A3A] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg text-[11px] uppercase tracking-widest transition-all hover:bg-[#D8A08A]">
          <Plus size={16} />
          <span>عميل جديد</span>
        </button>
      </header>

      <div className="bg-white rounded-[32px] border border-[#E8E2DE] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F4E9E4] flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={18} />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو رقم الهاتف..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] text-sm font-bold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[800px]">
            <thead>
              <tr className="bg-[#F4E9E4]/20 text-[#6B4F45] text-xs font-black uppercase tracking-widest border-b border-[#E8E2DE]">
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">بيانات التواصل</th>
                <th className="px-6 py-4">تاريخ التسجيل</th>
                <th className="px-6 py-4">الرصيد</th>
                <th className="px-6 py-4">ساعات الاستخدام</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E9E4]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-[#F4E9E4]/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2C2A3A] text-[#D8A08A] flex items-center justify-center font-bold shadow-sm font-serif italic">
                        {client.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-[#2C2A3A] text-sm">{client.name}</p>
                        <p className="text-[10px] text-[#6E6E6E] font-bold">ID: {client.id.slice(0, 6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#6E6E6E] font-bold">
                      <Phone size={14} className="text-[#D8A08A]" />
                      <span dir="ltr">{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#6E6E6E] font-bold">
                      <Calendar size={14} className="text-[#D8A08A]" />
                      <span>{client.createdAt?.toDate ? client.createdAt.toDate().toLocaleDateString('ar-SA') : 'اليوم'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${client.balance > 0 ? 'text-[#D8A08A]' : 'text-[#6E6E6E]'}`}>
                      {client.balance.toFixed(3)} ر.ع
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#6E6E6E] font-bold">
                      <Clock size={14} className="text-[#D8A08A]" />
                      <span>{client.totalUsageHours} ساعة</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#6E6E6E] hover:text-[#2C2A3A] hover:bg-[#E8E2DE]/50 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6E6E6E] font-bold">
                    لا يوجد عملاء مسجلين حالياً. سيتم تسجيل طلبات الأونلاين هنا.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#F4E9E4] flex items-center justify-between text-xs font-bold text-[#6E6E6E]">
          <span>عرض {filteredClients.length} عميل</span>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;

