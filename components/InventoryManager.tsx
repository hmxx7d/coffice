
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, 
  Droplets, 
  ClipboardList, 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  ArrowUpRight, 
  Truck,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  DollarSign,
  Tag,
  Info,
  Scale,
  Beaker,
  Zap,
  Layout,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { useCafeInventory, Material, ProductData, RecipeIngredient } from '../context/CafeInventoryContext';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FirestoreOrder } from '../hooks/useOrdersFirestore';

type InventoryTab = 'products' | 'materials' | 'lost_materials' | 'reports';

const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('products');
  const { products, setProducts, materials, setMaterials, lostMaterials, addedMaterials, recordLostMaterial, recordAddedMaterial } = useCafeInventory();
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isLostMaterialModalOpen, setIsLostMaterialModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ProductData>>({
    name: '',
    category: 'قهوة ساخنة',
    price: 0,
    cost: 0,
    stock: 0,
    supplier: '',
    description: '',
    recipe: []
  });

  const [materialFormData, setMaterialFormData] = useState<Partial<Material>>({
    name: '',
    unit: '',
    current: 0,
    min: 0,
    cost: 0,
    supplier: ''
  });

  const [lostMaterialFormData, setLostMaterialFormData] = useState({
    materialId: '',
    quantity: 0,
    reason: ''
  });

  const [addStockFormData, setAddStockFormData] = useState({
    materialId: '',
    quantity: 0,
    cost: 0,
    supplier: ''
  });

  const [reportRange, setReportRange] = useState<'day' | 'week' | 'month'>('day');
  const [reportOrders, setReportOrders] = useState<FirestoreOrder[]>([]);
  const [isReportLoading, setIsReportLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'reports') {
      const fetchReportData = async () => {
        setIsReportLoading(true);
        try {
          const now = new Date();
          let startDate = new Date();
          if (reportRange === 'day') {
            startDate.setHours(0, 0, 0, 0);
          } else if (reportRange === 'week') {
            startDate.setDate(now.getDate() - 7);
          } else if (reportRange === 'month') {
            startDate.setMonth(now.getMonth() - 1);
          }

          const q = query(
            collection(db, 'orders'),
            where('createdAt', '>=', Timestamp.fromDate(startDate))
          );
          const snap = await getDocs(q);
          const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreOrder));
          setReportOrders(orders);
        } catch (error) {
          console.error("Error fetching report orders:", error);
        } finally {
          setIsReportLoading(false);
        }
      };
      
      fetchReportData();
    }
  }, [activeTab, reportRange]);

  // Calculations for Reports
  const filteredAddedMaterials = (addedMaterials || []).filter(am => {
    const d = new Date(am.date);
    const now = new Date();
    if (reportRange === 'day') return d.toDateString() === now.toDateString();
    if (reportRange === 'week') return (now.getTime() - d.getTime()) <= 7 * 86400000;
    if (reportRange === 'month') return (now.getTime() - d.getTime()) <= 30 * 86400000;
    return true;
  });

  const filteredLostMaterials = (lostMaterials || []).filter(lm => {
    const d = new Date(lm.date);
    const now = new Date();
    if (reportRange === 'day') return d.toDateString() === now.toDateString();
    if (reportRange === 'week') return (now.getTime() - d.getTime()) <= 7 * 86400000;
    if (reportRange === 'month') return (now.getTime() - d.getTime()) <= 30 * 86400000;
    return true;
  });

  const reportStats = useMemo(() => {
    const totalOrders = reportOrders.length;
    const totalIncome = reportOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    
    // Most popular drinks
    const itemCounts: Record<string, number> = {};
    reportOrders.forEach(o => {
      o.items.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
    });
    
    const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
    const topItems = sortedItems.slice(0, 3).map(arr => arr[0]).join('، ') || 'لا يوجد';

    const totalLostValue = filteredLostMaterials.reduce((sum, lm) => {
      const p = products.find(prod => prod.id === lm.materialId);
      const m = materials.find(mat => mat.id === lm.materialId);
      const cost = (p?.cost || m?.cost || 0);
      return sum + (cost * lm.quantity);
    }, 0);

    const totalAddedCost = filteredAddedMaterials.reduce((sum, am) => sum + (am.cost * am.quantity), 0);

    return {
      totalOrders,
      totalIncome,
      topItems,
      totalLostValue,
      totalAddedCost
    };
  }, [reportOrders, filteredLostMaterials, filteredAddedMaterials, products, materials]);

  const calculateProductCostFromRecipe = (recipe: RecipeIngredient[]) => {
    return recipe.reduce((total, ing) => {
      const material = materials.find(m => m.id === ing.materialId);
      return total + (material ? material.cost * ing.quantity : 0);
    }, 0);
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'قهوة ساخنة',
      price: 0,
      cost: 0,
      stock: 0,
      supplier: '',
      description: '',
      recipe: []
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: ProductData) => {
    setEditingProduct(product);
    setFormData({ ...product, recipe: product.recipe || [] });
    setIsProductModalOpen(true);
  };

  const addIngredientToForm = () => {
    setFormData({
      ...formData,
      recipe: [...(formData.recipe || []), { materialId: materials[0]?.id || '', quantity: 0 }]
    });
  };

  const updateIngredientInForm = (index: number, field: keyof RecipeIngredient, value: any) => {
    const newRecipe = [...(formData.recipe || [])];
    newRecipe[index] = { ...newRecipe[index], [field]: value };
    
    const newCost = calculateProductCostFromRecipe(newRecipe);
    
    setFormData({
      ...formData,
      recipe: newRecipe,
      cost: newCost
    });
  };

  const removeIngredientFromForm = (index: number) => {
    const newRecipe = [...(formData.recipe || [])];
    newRecipe.splice(index, 1);
    
    const newCost = calculateProductCostFromRecipe(newRecipe);
    
    setFormData({
      ...formData,
      recipe: newRecipe,
      cost: newCost
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isRecipeProduct = formData.recipe && formData.recipe.length > 0;
    
    const productPayload: ProductData = {
      ...(formData as ProductData),
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      stock: isRecipeProduct ? 'وصفة' : (formData.stock || 0)
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? productPayload : p));
    } else {
      setProducts([productPayload, ...products]);
    }
    
    setIsProductModalOpen(false);
  };

  const openEditRecipe = (product: ProductData) => {
    setEditingProduct(product);
    setIsRecipeModalOpen(true);
  };

  const saveRecipe = (updatedRecipe: RecipeIngredient[]) => {
    if (!editingProduct) return;
    const newCost = calculateProductCostFromRecipe(updatedRecipe);
    setProducts(products.map(p => 
      p.id === editingProduct.id 
        ? { ...p, recipe: updatedRecipe, cost: newCost } 
        : p
    ));
    setIsRecipeModalOpen(false);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const openAddMaterialModal = () => {
    setEditingMaterial(null);
    setMaterialFormData({
      name: '',
      unit: '',
      current: 0,
      min: 0,
      cost: 0,
      supplier: ''
    });
    setIsMaterialModalOpen(true);
  };

  const openEditMaterialModal = (material: Material) => {
    setEditingMaterial(material);
    setMaterialFormData({ ...material });
    setIsMaterialModalOpen(true);
  };

  const handleMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const materialPayload: Material = {
      ...(materialFormData as Material),
      id: editingMaterial?.id || Math.random().toString(36).substr(2, 9),
    };

    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? materialPayload : m));
    } else {
      setMaterials([materialPayload, ...materials]);
    }
    
    setIsMaterialModalOpen(false);
  };

  const handleLostMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostMaterialFormData.materialId || lostMaterialFormData.quantity <= 0) return;
    recordLostMaterial({
      materialId: lostMaterialFormData.materialId,
      quantity: lostMaterialFormData.quantity,
      reason: lostMaterialFormData.reason,
    });
    setIsLostMaterialModalOpen(false);
    setLostMaterialFormData({ materialId: '', quantity: 0, reason: '' });
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addStockFormData.materialId || addStockFormData.quantity <= 0) return;
    recordAddedMaterial({
      materialId: addStockFormData.materialId,
      quantity: addStockFormData.quantity,
      cost: addStockFormData.cost,
      supplier: addStockFormData.supplier || 'غير محدد'
    });
    setIsAddStockModalOpen(false);
    setAddStockFormData({ materialId: '', quantity: 0, cost: 0, supplier: '' });
  };

  const deleteMaterial = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Tabs */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#2C2A3A] font-serif">مركز إدارة المخزون</h2>
          <p className="text-[#6E6E6E] text-sm mt-1">تتبع الموارد والوصفات وحساب التكاليف بدقة</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[22px] border border-[#E8E2DE] shadow-sm overflow-x-auto">
          {['products', 'materials', 'lost_materials', 'reports'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as InventoryTab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-[#2C2A3A] text-white shadow-lg' : 'text-[#6E6E6E] hover:text-[#2C2A3A]'}`}
            >
              {tab === 'products' ? 'المنتجات' : tab === 'materials' ? 'المواد الخام' : tab === 'lost_materials' ? 'الضائع' : 'التقارير'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={18} />
              <input type="text" placeholder="بحث في المنتجات..." className="w-full pr-12 pl-4 py-3 bg-white border border-[#E8E2DE] rounded-2xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm" />
            </div>
            <button 
              onClick={openAddProductModal}
              className="flex items-center gap-3 bg-[#D8A08A] text-white px-8 py-3.5 rounded-2xl hover:bg-[#C08A75] transition-all shadow-xl shadow-[#D8A08A]/20 font-black text-[11px] uppercase tracking-widest"
            >
              <Plus size={18} /> إضافة منتج جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-[32px] border border-[#E8E2DE] p-8 shadow-sm group hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[#F4E9E4] text-[#2C2A3A] rounded-2xl flex items-center justify-center">
                    <Package size={24} />
                  </div>
                  <div className="flex gap-2">
                    {p.recipe && (
                      <button 
                        onClick={() => openEditRecipe(p)}
                        className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <ClipboardList size={12} /> الوصفة
                      </button>
                    )}
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${typeof p.stock === 'string' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : p.stock < 10 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {typeof p.stock === 'string' ? p.stock : `متوفر: ${p.stock}`}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#2C2A3A] font-serif mb-1">{p.name}</h3>
                <p className="text-[10px] font-bold text-[#6B4F45] uppercase tracking-widest mb-6">{p.category}</p>
                
                <div className="space-y-3 pt-6 border-t border-[#F4E9E4]">
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-[#6E6E6E] font-bold">سعر البيع:</span>
                     <span className="text-[#2C2A3A] font-black italic">{Number(p.price).toFixed(3)} ر.ع</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-[#6E6E6E] font-bold">تكلفة الإنتاج:</span>
                     <span className="text-[#D8A08A] font-black italic">{Number(p.cost).toFixed(3)} ر.ع</span>
                   </div>
                   <div className="flex justify-between items-center text-xs pt-1">
                     <span className="text-[#6E6E6E] font-bold">المورد:</span>
                     <span className="text-[#6E6E6E] font-bold">{p.supplier}</span>
                   </div>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <button 
                    onClick={() => openEditProductModal(p)}
                    className="flex-1 py-3 bg-[#2C2A3A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D8A08A] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={14} /> تعديل
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE]">
            <div className="p-8 bg-[#2C2A3A] text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#D8A08A] rounded-2xl flex items-center justify-center text-white"><Package size={28} /></div>
                 <div>
                   <h3 className="text-2xl font-black font-serif italic">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">أدخل بيانات المنتج بدقة في النظام</p>
                 </div>
               </div>
               <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">اسم المنتج</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الفئة</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="قهوة ساخنة">قهوة ساخنة</option>
                    <option value="قهوة باردة">قهوة باردة</option>
                    <option value="مخبوزات">مخبوزات</option>
                    <option value="حلويات">حلويات</option>
                    <option value="سناكس">سناكس</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">المورد</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={formData.supplier}
                    onChange={e => setFormData({...formData, supplier: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">سعر البيع (ر.ع)</label>
                  <input 
                    required
                    type="number" 
                    step="0.001"
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">التكلفة (ر.ع)</label>
                  <input 
                    required
                    type="number" 
                    step="0.001"
                    readOnly={formData.recipe && formData.recipe.length > 0}
                    className={`w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold ${(formData.recipe && formData.recipe.length > 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                    value={formData.cost}
                    onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                  />
                  {(formData.recipe && formData.recipe.length > 0) && (
                    <p className="text-[9px] text-[#D8A08A] font-bold">يتم حساب التكلفة تلقائياً من المكونات</p>
                  )}
                </div>

                {(!formData.recipe || formData.recipe.length === 0) && (
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الكمية المتوفرة</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                      value={typeof formData.stock === 'number' ? formData.stock : 0}
                      onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                    />
                  </div>
                )}

                <div className="space-y-4 col-span-2 pt-4 border-t border-[#E8E2DE]">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">مكونات الوصفة (اختياري)</label>
                    <button 
                      type="button"
                      onClick={addIngredientToForm}
                      className="text-[10px] font-black uppercase tracking-widest text-[#D8A08A] flex items-center gap-1 hover:text-[#2C2A3A]"
                    >
                      <Plus size={14} /> إضافة مكون
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(formData.recipe || []).map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <select
                          className="flex-1 px-4 py-3 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm"
                          value={ing.materialId}
                          onChange={e => updateIngredientInForm(idx, 'materialId', e.target.value)}
                        >
                          <option value="">اختر المادة الخام...</option>
                          {materials.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="الكمية"
                          className="w-24 px-4 py-3 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold text-sm text-center"
                          value={ing.quantity || ''}
                          onChange={e => updateIngredientInForm(idx, 'quantity', Number(e.target.value))}
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredientFromForm(idx)}
                          className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    {(!formData.recipe || formData.recipe.length === 0) && (
                      <div className="text-center py-4 bg-[#F4E9E4]/20 rounded-xl border border-dashed border-[#E8E2DE]">
                        <p className="text-xs text-[#6E6E6E] font-bold">لم يتم إضافة مكونات بعد. سيتم اعتبار هذا المنتج كعنصر جاهز.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الوصف</label>
                  <textarea 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold min-h-[100px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-4 border border-[#E8E2DE] rounded-2xl font-black uppercase tracking-widest text-[11px] text-[#6E6E6E] hover:bg-[#F4E9E4]"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-[#D8A08A] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#2C2A3A] transition-all shadow-xl"
                >
                  {editingProduct ? 'حفظ التغييرات' : 'إضافة المنتج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Editor Modal */}
      {isRecipeModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsRecipeModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE]">
            <div className="p-8 bg-[#2C2A3A] text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#D8A08A] rounded-2xl flex items-center justify-center text-white"><Scale size={28} /></div>
                 <div>
                   <h3 className="text-2xl font-black font-serif italic">وصفة: {editingProduct.name}</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">تحديد المكونات وحساب التكلفة الدقيقة</p>
                 </div>
               </div>
               <button onClick={() => setIsRecipeModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* قائمة المكونات الحالية */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45] border-b pb-2">المكونات المستخدمة</p>
                <div className="space-y-3">
                  {(editingProduct.recipe || []).map((ing, idx) => {
                    const material = materials.find(m => m.id === ing.materialId);
                    const cost = material ? (material.cost * ing.quantity).toFixed(3) : '0.000';
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-[#F4E9E4]/30 rounded-2xl border border-[#E8E2DE]">
                        <div className="flex items-center gap-3">
                          <Beaker size={18} className="text-[#D8A08A]" />
                          <div>
                            <p className="text-sm font-bold text-[#2C2A3A]">{material?.name}</p>
                            <p className="text-[10px] text-[#6E6E6E] font-bold">{ing.quantity} {material?.unit}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-[#D8A08A] italic">{cost} ر.ع</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* الملخص المالي للوصفة */}
              <div className="bg-[#2C2A3A] p-8 rounded-[32px] text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#D8A08A] rounded-full blur-[60px] opacity-20 -ml-12 -mt-12"></div>
                <div className="relative">
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">إجمالي تكلفة المكونات</p>
                   <h4 className="text-3xl font-serif italic font-black text-[#D8A08A] tracking-tighter">
                    {calculateProductCostFromRecipe(editingProduct.recipe || []).toFixed(3)} <span className="text-xs not-italic opacity-50">ر.ع</span>
                   </h4>
                </div>
                <div className="text-left relative">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">هامش الربح المتوقع</p>
                  <p className="text-xl font-black text-emerald-400">
                    +{(((editingProduct.price - calculateProductCostFromRecipe(editingProduct.recipe || [])) / editingProduct.price) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <button 
                onClick={() => saveRecipe(editingProduct.recipe || [])}
                className="w-full py-5 bg-[#D8A08A] text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#2C2A3A] transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <CheckCircle2 size={18} /> حفظ وتحديث تكاليف المخزون
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Materials View */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-xl overflow-hidden">
          <div className="p-8 border-b border-[#F4E9E4] bg-[#F4E9E4]/10 flex items-center justify-between">
            <h3 className="font-serif italic font-black text-xl text-[#2C2A3A]">قائمة المواد الخام</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsAddStockModalOpen(true)}
                className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-2.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 font-black text-[11px] uppercase tracking-widest"
              >
                <Truck size={16} /> تسجيل توريد
              </button>
              <button 
                onClick={openAddMaterialModal}
                className="flex items-center gap-3 bg-[#D8A08A] text-white px-6 py-2.5 rounded-2xl hover:bg-[#C08A75] transition-all shadow-xl shadow-[#D8A08A]/20 font-black text-[11px] uppercase tracking-widest"
              >
                <Plus size={16} /> تعريف مادة خام
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[#2C2A3A] text-white/50 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">المادة</th>
                  <th className="px-6 py-5">المورد</th>
                  <th className="px-6 py-5 text-center">المستوى الحالي</th>
                  <th className="px-6 py-5">تكلفة الوحدة</th>
                  <th className="px-6 py-5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E9E4]">
                {materials.map(m => (
                  <tr key={m.id} className="hover:bg-[#F4E9E4]/30 transition-colors">
                    <td className="px-8 py-6 font-bold text-[#2C2A3A]">{m.name}</td>
                    <td className="px-6 py-6 text-xs text-[#6E6E6E] font-bold">{m.supplier}</td>
                    <td className="px-6 py-6 text-center text-xs font-black text-[#D8A08A]">{m.current} {m.unit}</td>
                    <td className="px-6 py-6 font-serif italic font-black text-[#2C2A3A]">{m.cost.toFixed(4)} ر.ع / {m.unit}</td>
                    <td className="px-6 py-6 flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEditMaterialModal(m)}
                        className="p-2 bg-[#2C2A3A] text-white rounded-lg hover:bg-[#D8A08A] transition-all"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => deleteMaterial(m.id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Material Add/Edit Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsMaterialModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE]">
            <div className="p-8 bg-[#2C2A3A] text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#D8A08A] rounded-2xl flex items-center justify-center text-white"><Droplets size={28} /></div>
                 <div>
                   <h3 className="text-2xl font-black font-serif italic">{editingMaterial ? 'تعديل المادة الخام' : 'إضافة مادة خام جديدة'}</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">إدارة المخزون الأساسي</p>
                 </div>
               </div>
               <button onClick={() => setIsMaterialModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleMaterialSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">اسم المادة</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={materialFormData.name}
                    onChange={e => setMaterialFormData({...materialFormData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">وحدة القياس</label>
                  <input 
                    required
                    type="text" 
                    placeholder="مثال: جرام، ملل، حبة"
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={materialFormData.unit}
                    onChange={e => setMaterialFormData({...materialFormData, unit: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">المورد</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={materialFormData.supplier}
                    onChange={e => setMaterialFormData({...materialFormData, supplier: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الكمية الحالية</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={materialFormData.current}
                    onChange={e => setMaterialFormData({...materialFormData, current: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الحد الأدنى للتنبيه</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={materialFormData.min}
                    onChange={e => setMaterialFormData({...materialFormData, min: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">تكلفة الوحدة (ر.ع)</label>
                  <input 
                    required
                    type="number" 
                    step="0.0001"
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={materialFormData.cost}
                    onChange={e => setMaterialFormData({...materialFormData, cost: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="flex-1 py-4 border border-[#E8E2DE] rounded-2xl font-black uppercase tracking-widest text-[11px] text-[#6E6E6E] hover:bg-[#F4E9E4]"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-[#D8A08A] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#2C2A3A] transition-all shadow-xl"
                >
                  {editingMaterial ? 'حفظ التغييرات' : 'إضافة المادة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lost Materials View */}
      {activeTab === 'lost_materials' && (
        <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-xl overflow-hidden">
          <div className="p-8 border-b border-[#F4E9E4] bg-[#F4E9E4]/10 flex items-center justify-between">
            <h3 className="font-serif italic font-black text-xl text-[#2C2A3A]">سجل المواد الضائعة أو التالفة</h3>
            <button 
              onClick={() => setIsLostMaterialModalOpen(true)}
              className="flex items-center gap-3 bg-[#D8A08A] text-white px-6 py-2.5 rounded-2xl hover:bg-[#C08A75] transition-all shadow-xl shadow-[#D8A08A]/20 font-black text-[11px] uppercase tracking-widest"
            >
              <Plus size={16} /> تسجيل مادة ضائعة
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[#2C2A3A] text-white/50 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">المادة/المنتج</th>
                  <th className="px-6 py-5">الكمية الضائعة</th>
                  <th className="px-6 py-5">السبب</th>
                  <th className="px-6 py-5">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E9E4]">
                {lostMaterials.map(m => {
                  const mInfo = materials.find(x => x.id === m.materialId) || products.find(x => x.id === m.materialId);
                  return (
                    <tr key={m.id} className="hover:bg-[#F4E9E4]/30 transition-colors">
                      <td className="px-8 py-6 font-bold text-[#2C2A3A]">{mInfo?.name || m.materialId}</td>
                      <td className="px-6 py-6 text-xs text-[#6E6E6E] font-bold">{m.quantity} {'unit' in (mInfo || {}) ? (mInfo as Material).unit : 'حبة'}</td>
                      <td className="px-6 py-6 text-xs text-rose-500 font-bold">{m.reason}</td>
                      <td className="px-6 py-6 font-serif text-[#6E6E6E] text-xs">{new Date(m.date).toLocaleString('ar-OM')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports View */}
      {activeTab === 'reports' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif italic font-black text-2xl text-[#2C2A3A]">تقارير المخزون والأداء</h3>
            
            <div className="relative">
              <select 
                value={reportRange}
                onChange={(e) => setReportRange(e.target.value as 'day' | 'week' | 'month')}
                className="appearance-none bg-white border border-[#E8E2DE] text-[#2C2A3A] px-6 py-3 pr-12 rounded-2xl shadow-sm outline-none font-bold focus:ring-2 focus:ring-[#D8A08A] transition-all"
              >
                <option value="day">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
              </select>
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D8A08A]" size={18} />
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6E6E] pointer-events-none" size={16} />
            </div>
          </div>

          {isReportLoading ? (
            <div className="h-64 flex items-center justify-center text-[#D8A08A]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D8A08A]"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E2DE] relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><ClipboardList size={22} /></div>
                    </div>
                    <h3 className="text-3xl font-black text-[#2C2A3A] font-serif">{reportStats.totalOrders}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#6E6E6E] mt-1">عدد الطلبات المكتملة</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E8E2DE] relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><DollarSign size={22} /></div>
                    </div>
                    <h3 className="text-3xl font-black text-[#2C2A3A] font-serif">{reportStats.totalIncome.toFixed(2)}<span className="text-sm"> ر.ع</span></h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#6E6E6E] mt-1">إجمالي الدخل</p>
                  </div>
                </div>

                <div className="bg-[#2C2A3A] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D8A08A] rounded-full blur-[60px] opacity-20" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white/10 text-[#D8A08A] rounded-2xl"><Zap size={22} /></div>
                    </div>
                    <h3 className="text-xl font-black text-[#D8A08A] leading-tight truncate">{reportStats.topItems}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mt-2">الأصناف الأكثر طلباً</p>
                  </div>
                </div>

                <div className="bg-rose-50 p-6 rounded-3xl shadow-sm border border-rose-100 relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-100 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-rose-200 text-rose-700 rounded-2xl"><AlertTriangle size={22} /></div>
                    </div>
                    <h3 className="text-3xl font-black text-rose-700 font-serif">{reportStats.totalLostValue.toFixed(3)}<span className="text-sm"> ر.ع</span></h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-rose-600/70 mt-1">تكلفة الفاقد/التالف</p>
                  </div>
                </div>
              </div>

              {/* Detailed Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Added Materials List */}
                <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-[#F4E9E4] bg-[#F4E9E4]/10 flex items-center justify-between">
                    <h3 className="font-serif italic font-black text-lg text-[#2C2A3A]">احتساب الإمدادات (الوارد)</h3>
                    <span className="bg-[#D8A08A]/10 text-[#D8A08A] px-4 py-1.5 rounded-full font-bold text-xs">{filteredAddedMaterials.length} عمليات</span>
                  </div>
                  <div className="p-6">
                    {filteredAddedMaterials.length === 0 ? (
                      <p className="text-center text-[#6E6E6E] py-8 text-sm">لا توجد إمدادات خلال هذه الفترة</p>
                    ) : (
                      <ul className="space-y-4">
                        {filteredAddedMaterials.map(m => {
                          const mInfo = materials.find(x => x.id === m.materialId) || products.find(x => x.id === m.materialId);
                          return (
                            <li key={m.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full"><Plus size={16} /></div>
                                <div>
                                  <p className="font-bold text-[#2C2A3A]">{mInfo?.name || m.materialId}</p>
                                  <p className="text-xs text-[#6E6E6E] mt-1">{m.supplier}</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-emerald-600">+{m.quantity} {'unit' in (mInfo || {}) ? (mInfo as Material).unit : 'حبة'}</p>
                                <p className="text-xs text-[#6E6E6E] font-serif italic mt-1">{(m.cost * m.quantity).toFixed(3)} ر.ع</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Lost Materials List */}
                <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-[#F4E9E4] bg-[#F4E9E4]/10 flex items-center justify-between">
                    <h3 className="font-serif italic font-black text-lg text-[#2C2A3A]">المواد التالفة والضائعة</h3>
                    <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full font-bold text-xs">{filteredLostMaterials.length} تبليغات</span>
                  </div>
                  <div className="p-6">
                    {filteredLostMaterials.length === 0 ? (
                      <p className="text-center text-[#6E6E6E] py-8 text-sm">لا يوجد مواد تالفة خلال هذه الفترة</p>
                    ) : (
                      <ul className="space-y-4">
                        {filteredLostMaterials.map(m => {
                          const mInfo = materials.find(x => x.id === m.materialId) || products.find(x => x.id === m.materialId);
                          return (
                            <li key={m.id} className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-200 text-rose-700 rounded-full"><AlertTriangle size={16} /></div>
                                <div>
                                  <p className="font-bold text-[#2C2A3A]">{mInfo?.name || m.materialId}</p>
                                  <p className="text-xs text-rose-500 mt-1">{m.reason}</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-rose-600">-{m.quantity} {'unit' in (mInfo || {}) ? (mInfo as Material).unit : 'حبة'}</p>
                                <p className="text-xs text-[#6E6E6E] font-serif italic mt-1">{new Date(m.date).toLocaleString('ar-OM')}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Lost Material Modal */}
      {isLostMaterialModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsLostMaterialModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE]">
            <div className="p-8 bg-[#2C2A3A] text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-[#D8A08A] rounded-2xl flex items-center justify-center text-white"><AlertTriangle size={28} /></div>
                 <div>
                   <h3 className="text-2xl font-black font-serif italic">تسجيل مادة ضائعة/تالفة</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">يُخصم المفقود من المخزن الرئيسي</p>
                 </div>
               </div>
               <button onClick={() => setIsLostMaterialModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleLostMaterialSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">المادة / المنتج</label>
                  <select
                    required
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={lostMaterialFormData.materialId}
                    onChange={e => setLostMaterialFormData({...lostMaterialFormData, materialId: e.target.value})}
                  >
                    <option value="">-- اختر --</option>
                    <optgroup label="المواد الخام">
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                    </optgroup>
                    <optgroup label="المنتجات">
                      {products.filter(p => !p.recipe).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الكمية</label>
                  <input 
                    required
                    type="number" 
                    step="0.001"
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={lostMaterialFormData.quantity}
                    onChange={e => setLostMaterialFormData({...lostMaterialFormData, quantity: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">سبب الهدر أو التلف</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={lostMaterialFormData.reason}
                    onChange={e => setLostMaterialFormData({...lostMaterialFormData, reason: e.target.value})}
                    placeholder="مثال: منتهي الصلاحية، انسكاب بالخطأ..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsLostMaterialModalOpen(false)}
                  className="flex-1 py-4 border border-[#E8E2DE] rounded-2xl font-black uppercase tracking-widest text-[11px] text-[#6E6E6E] hover:bg-[#F4E9E4]"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/20"
                >
                  تسجيل وخصم الكمية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stock Modal */}
      {isAddStockModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#2C2A3A]/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsAddStockModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-[#E8E2DE]">
            <div className="p-8 bg-[#2C2A3A] text-white flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><Truck size={28} /></div>
                 <div>
                   <h3 className="text-2xl font-black font-serif italic">تسجيل توريد مواد</h3>
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">تُضاف الكمية للمخزن وتُسجل تكلفتها</p>
                 </div>
               </div>
               <button onClick={() => setIsAddStockModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">المادة / المنتج</label>
                  <select
                    required
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={addStockFormData.materialId}
                    onChange={e => setAddStockFormData({...addStockFormData, materialId: e.target.value})}
                  >
                    <option value="">-- اختر --</option>
                    <optgroup label="المواد الخام">
                      {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
                    </optgroup>
                    <optgroup label="المنتجات الجاهزة">
                      {products.filter(p => !p.recipe).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">الكمية الواردة</label>
                  <input 
                    required
                    type="number" 
                    step="0.001"
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={addStockFormData.quantity}
                    onChange={e => setAddStockFormData({...addStockFormData, quantity: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">التكلفة الواردة للمادة الواحدة (اختياري)</label>
                  <input 
                    type="number" 
                    step="0.001"
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={addStockFormData.cost}
                    onChange={e => setAddStockFormData({...addStockFormData, cost: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#6B4F45]">اسم المورد/رقم الفاتورة (اختياري)</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 bg-[#F4E9E4]/30 border border-[#E8E2DE] rounded-xl outline-none focus:ring-2 focus:ring-[#D8A08A] font-bold"
                    value={addStockFormData.supplier}
                    onChange={e => setAddStockFormData({...addStockFormData, supplier: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddStockModalOpen(false)}
                  className="flex-1 py-4 border border-[#E8E2DE] rounded-2xl font-black uppercase tracking-widest text-[11px] text-[#6E6E6E] hover:bg-[#F4E9E4]"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                >
                  تأكيد التوريد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;