
import React from 'react';
import { CreditCard, AlertCircle, RefreshCw, Snowflake, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { SUBSCRIPTION_MODELS } from '../constants';
import { useFinance } from '../context/FinanceContext';

const SubscriptionManager: React.FC = () => {
  const { addTransaction } = useFinance();

  const handleSubscribe = (model: any) => {
    addTransaction({
      type: 'INCOME',
      category: 'SUBSCRIPTION',
      amount: model.price,
      description: `اشتراك باقة - ${model.name}`,
    });
    alert(`تم تفعيل اشتراك ${model.name} بنجاح!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">باقات العضوية والاشتراكات</h2>
          <p className="text-gray-500 mt-1">إدارة باقات المساحة وتتبع استهلاك المشتركين</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100">
          <Plus size={20} />
          <span>تفعيل اشتراك جديد</span>
        </button>
      </header>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBSCRIPTION_MODELS.map((model, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50" />
            
            <div className="relative">
              <h3 className="font-extrabold text-lg mb-1">{model.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-black text-indigo-600">{(model.price / 10).toFixed(3)}</span>
                <span className="text-sm text-gray-400">ر.ع / شهر</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <Clock size={14} className="text-emerald-500" />
                  <span>{model.limit} ساعات يومياً</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>إنترنت فائق السرعة</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>مشروب مجاني يومياً</span>
                </li>
              </ul>

              <button 
                onClick={() => handleSubscribe(model)}
                className="w-full py-2.5 rounded-xl bg-gray-50 text-indigo-600 text-sm font-bold border border-indigo-50 hover:bg-indigo-600 hover:text-white transition-all"
              >
                اختر هذه الباقة
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Subscriptions List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold">المشتركون الحاليون</h3>
            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-bold">128 مشترك نشط</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs">
                  <th className="px-6 py-4">المشترك</th>
                  <th className="px-6 py-4">نوع الباقة</th>
                  <th className="px-6 py-4">الاستهلاك اليومي</th>
                  <th className="px-6 py-4">تاريخ التجديد</th>
                  <th className="px-6 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'أمل السليمان', type: 'فردية 8س', usage: 75, date: '2024/06/15', alert: true },
                  { name: 'بدر الناصر', type: 'مكتب 4س', usage: 30, date: '2024/06/20', alert: false },
                  { name: 'ليلى فهد', type: 'فردية 4س', usage: 95, date: '2024/06/12', alert: true },
                  { name: 'خالد المطيري', type: 'مكتب 8س', usage: 10, date: '2024/07/01', alert: false },
                ].map((sub, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-bold">{sub.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${sub.usage > 90 ? 'bg-rose-500' : sub.usage > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${sub.usage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-500">{sub.usage}%</span>
                        {sub.alert && <AlertCircle size={14} className="text-rose-500 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="تجديد"><RefreshCw size={16} /></button>
                        <button className="p-1.5 text-gray-400 hover:text-sky-600 transition-colors" title="تجميد"><Snowflake size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Alerts / Stats */}
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
            <div className="flex gap-4">
              <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm h-fit">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">تنبيهات تجاوز الحد</h4>
                <p className="text-sm text-amber-700 leading-relaxed">هناك 3 مشتركين استهلكوا أكثر من 90% من ساعاتهم اليومية المحددة.</p>
                <button className="mt-4 text-xs font-bold underline text-amber-800">إرسال إشعارات للعملاء</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4">ملخص الاشتراكات</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">إجمالي المشتركين</span>
                <span className="font-black text-indigo-600 text-lg">152</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">مشتركون ينتهي اشتراكهم قريباً</span>
                <span className="font-black text-rose-500 text-lg">8</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">إجمالي الأرباح الشهرية</span>
                <span className="font-black text-emerald-600 text-lg">1.840 ر.ع</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
