
import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreHorizontal, UserCheck, Calendar, Clock } from 'lucide-react';
import { Client } from '../types';

const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'سارة خالد', phone: '0501234567', balance: 45.0, totalUsageHours: 120, subscriptionId: 'sub_1' },
  { id: '2', name: 'محمد العمري', phone: '0559876543', balance: 2.0, totalUsageHours: 45 },
  { id: '3', name: 'عبدالرحمن العتيبي', phone: '0545556667', balance: 0, totalUsageHours: 8 },
  { id: '4', name: 'نورة السعيد', phone: '0562223334', balance: 80.0, totalUsageHours: 240, subscriptionId: 'sub_2' },
];

const ClientManager: React.FC = () => {
  const [clients] = useState<Client[]>(INITIAL_CLIENTS);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة العملاء</h2>
          <p className="text-gray-500">متابعة العضويات، الأرصدة وسجل الاستخدام</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100">
          <Plus size={20} />
          <span>عميل جديد</span>
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو رقم الجوال..." 
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            />
          </div>
        </div>

        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="px-6 py-4 font-medium">العميل</th>
              <th className="px-6 py-4 font-medium">بيانات التواصل</th>
              <th className="px-6 py-4 font-medium">الحالة</th>
              <th className="px-6 py-4 font-medium">الرصيد</th>
              <th className="px-6 py-4 font-medium">الساعات المستخدمة</th>
              <th className="px-6 py-4 font-medium text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      {client.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{client.name}</p>
                      <p className="text-xs text-gray-400">ID: {client.id.padStart(4, '0')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {client.subscriptionId ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                      <UserCheck size={12} />
                      مشترك نشط
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 w-fit">
                      بدون اشتراك
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-bold ${client.balance > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {client.balance.toFixed(3)} ر.ع
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-gray-400" />
                    <span>{client.totalUsageHours} ساعة</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Calendar size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>عرض 1 إلى 4 من أصل 4 عملاء</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>السابق</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
