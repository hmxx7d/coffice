
import React, { useState, useMemo } from 'react';
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
  Layout
} from 'lucide-react';
import { useCafeInventory, Material, ProductData, RecipeIngredient } from '../context/CafeInventoryContext';

type InventoryTab = 'products' | 'materials' | 'recipes' | 'reports';

const InventoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('products');
  const { products, setProducts, materials, setMaterials } = useCafeInventory();
  
  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
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
          {['products', 'materials', 'recipes', 'reports'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as InventoryTab)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-[#2C2A3A] text-white shadow-lg' : 'text-[#6E6E6E] hover:text-[#2C2A3A]'}`}
            >
              {tab === 'products' ? 'المنتجات' : tab === 'materials' ? 'المواد الخام' : tab === 'recipes' ? 'الوصفات' : 'التقارير'}
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

      {/* Recipes Summary View */}
      {activeTab === 'recipes' && (
        <div className="bg-white p-10 rounded-[40px] border border-[#E8E2DE] shadow-sm">
          <h3 className="font-serif italic font-black text-2xl mb-8 text-[#2C2A3A]">إدارة تكاليف المشروبات (وصفات كوفيكس)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.filter(p => p.category.includes('قهوة')).map(p => (
              <div key={p.id} className="p-6 bg-[#F4E9E4]/20 border border-[#E8E2DE] rounded-[30px] flex items-center justify-between group hover:border-[#D8A08A] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2C2A3A] rounded-xl flex items-center justify-center text-[#D8A08A] shadow-lg"><Zap size={22} /></div>
                  <div>
                    <p className="text-sm font-black text-[#2C2A3A]">{p.name}</p>
                    <p className="text-[10px] text-[#6E6E6E] font-bold">التكلفة الحالية: {p.cost.toFixed(3)} ر.ع</p>
                  </div>
                </div>
                <button 
                  onClick={() => openEditRecipe(p)}
                  className="px-6 py-2.5 bg-white border border-[#E8E2DE] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#2C2A3A] hover:bg-[#2C2A3A] hover:text-white transition-all shadow-sm"
                >
                  تعديل المكونات
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials View */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-[40px] border border-[#E8E2DE] shadow-xl overflow-hidden">
          <div className="p-8 border-b border-[#F4E9E4] bg-[#F4E9E4]/10 flex items-center justify-between">
            <h3 className="font-serif italic font-black text-xl text-[#2C2A3A]">قائمة المواد الخام</h3>
            <button 
              onClick={openAddMaterialModal}
              className="flex items-center gap-3 bg-[#D8A08A] text-white px-6 py-2.5 rounded-2xl hover:bg-[#C08A75] transition-all shadow-xl shadow-[#D8A08A]/20 font-black text-[11px] uppercase tracking-widest"
            >
              <Plus size={16} /> إضافة مادة خام
            </button>
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
                    placeholder="مثال: جرام، ملل، قطعة"
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
    </div>
  );
};

export default InventoryManager;
