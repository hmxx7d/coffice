import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useFinance } from './FinanceContext';

export interface Material {
  id: string;
  name: string;
  unit: string;
  current: number;
  min: number;
  cost: number;
  supplier: string;
}

export interface RecipeIngredient {
  materialId: string;
  quantity: number;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number | string;
  supplier: string;
  description?: string;
  recipe?: RecipeIngredient[];
}

export interface LostMaterial {
  id: string;
  materialId: string;
  quantity: number;
  reason: string;
  date: string;
}

export interface AddedMaterial {
  id: string;
  materialId: string;
  quantity: number;
  cost: number;
  supplier: string;
  date: string;
}

interface CafeInventoryContextType {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  products: ProductData[];
  setProducts: React.Dispatch<React.SetStateAction<ProductData[]>>;
  lostMaterials: LostMaterial[];
  setLostMaterials: React.Dispatch<React.SetStateAction<LostMaterial[]>>;
  addedMaterials: AddedMaterial[];
  setAddedMaterials: React.Dispatch<React.SetStateAction<AddedMaterial[]>>;
  processOrder: (items: { id: string; name: string; quantity: number }[]) => void;
  recordLostMaterial: (lost: Omit<LostMaterial, 'id' | 'date'>) => void;
  recordAddedMaterial: (added: Omit<AddedMaterial, 'id' | 'date'>) => void;
}

const INITIAL_MATERIALS: Material[] = [
  { id: 'm1', name: 'بن كولومبي مختص', unit: 'جرام', current: 12500, min: 5000, cost: 0.0085, supplier: 'محمصة الشرق' },
  { id: 'm2', name: 'حليب كامل الدسم', unit: 'ملل', current: 48000, min: 20000, cost: 0.0006, supplier: 'مزرعة الخير' },
  { id: 'm3', name: 'سيروب فانيلا', unit: 'ملل', current: 1500, min: 1000, cost: 0.05, supplier: 'مونين' },
  { id: 'm4', name: 'أكواب كوفيكس 12oz', unit: 'قطعة', current: 150, min: 500, cost: 0.100, supplier: 'مصنع الورق' },
];

const INITIAL_PRODUCTS: ProductData[] = [
  { 
    id: '1', name: 'إسبريسو', category: 'قهوة ساخنة', price: 1.200, cost: 0.250, stock: 'وصفة', supplier: 'محلي',
    recipe: [
      { materialId: 'm1', quantity: 18 },
      { materialId: 'm4', quantity: 1 },
    ]
  },
  { 
    id: '2', name: 'لاتيه كولد برو', category: 'قهوة باردة', price: 2.200, cost: 0.450, stock: 'وصفة', supplier: 'محلي',
    recipe: [
      { materialId: 'm1', quantity: 20 },
      { materialId: 'm2', quantity: 200 },
      { materialId: 'm4', quantity: 1 },
    ]
  },
  { id: '3', name: 'كرواسون لوز', category: 'مخبوزات', price: 1.800, cost: 0.900, stock: 15, supplier: 'مخبز باريس' },
];

const CafeInventoryContext = createContext<CafeInventoryContextType | undefined>(undefined);

const INITIAL_LOST_MATERIALS: LostMaterial[] = [];
const INITIAL_ADDED_MATERIALS: AddedMaterial[] = [];

export const CafeInventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [products, setProducts] = useState<ProductData[]>(INITIAL_PRODUCTS);
  const [lostMaterials, setLostMaterials] = useState<LostMaterial[]>(INITIAL_LOST_MATERIALS);
  const [addedMaterials, setAddedMaterials] = useState<AddedMaterial[]>(INITIAL_ADDED_MATERIALS);
  const { addTransaction } = useFinance();

  const processOrder = (items: { id: string; name: string; quantity: number }[]) => {
    let totalCost = 0;
    
    setMaterials(prevMaterials => {
      let newMaterials = [...prevMaterials];
      
      items.forEach(item => {
        const product = products.find(p => p.name === item.name);
        if (product && product.recipe) {
          product.recipe.forEach(ing => {
            const materialIndex = newMaterials.findIndex(m => m.id === ing.materialId);
            if (materialIndex > -1) {
              const material = newMaterials[materialIndex];
              const consumedQuantity = ing.quantity * item.quantity;
              newMaterials[materialIndex] = {
                ...material,
                current: material.current - consumedQuantity
              };
              totalCost += consumedQuantity * material.cost;
            }
          });
        }
      });
      
      return newMaterials;
    });

    if (totalCost > 0) {
      addTransaction({
        type: 'EXPENSE',
        category: 'INVENTORY_COST',
        amount: totalCost,
        description: `تكلفة مواد مستهلكة للطلبات`,
      });
    }
  };

  const recordLostMaterial = (lost: Omit<LostMaterial, 'id' | 'date'>) => {
    const newLostMateral: LostMaterial = {
      ...lost,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };

    setLostMaterials(prev => [newLostMateral, ...prev]);

    // Update material or product stock
    const isMaterial = materials.some(m => m.id === lost.materialId);
    if (isMaterial) {
      setMaterials(prev => prev.map(m => m.id === lost.materialId ? { ...m, current: Math.max(0, m.current - lost.quantity) } : m));
    } else {
      setProducts(prevProducts => prevProducts.map(p => p.id === lost.materialId && typeof p.stock === 'number' ? { ...p, stock: Math.max(0, p.stock - lost.quantity) } : p));
    }
  };

  const recordAddedMaterial = (added: Omit<AddedMaterial, 'id' | 'date'>) => {
    const newAddedMateral: AddedMaterial = {
      ...added,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };

    setAddedMaterials(prev => [newAddedMateral, ...prev]);

    const isMaterial = materials.some(m => m.id === added.materialId);
    if (isMaterial) {
      setMaterials(prev => prev.map(m => m.id === added.materialId ? { ...m, current: m.current + added.quantity } : m));
    } else {
      setProducts(prevProducts => prevProducts.map(p => p.id === added.materialId && typeof p.stock === 'number' ? { ...p, stock: p.stock + added.quantity } : p));
    }

    // Add cost transaction
    if (added.cost > 0) {
      addTransaction({
        type: 'EXPENSE',
        category: 'INVENTORY_COST',
        amount: added.cost * added.quantity,
        description: `توريد مخزون من: ${added.supplier}`,
      });
    }
  };

  return (
    <CafeInventoryContext.Provider value={{ materials, setMaterials, products, setProducts, lostMaterials, setLostMaterials, addedMaterials, setAddedMaterials, processOrder, recordLostMaterial, recordAddedMaterial }}>
      {children}
    </CafeInventoryContext.Provider>
  );
};

export const useCafeInventory = () => {
  const context = useContext(CafeInventoryContext);
  if (context === undefined) {
    throw new Error('useCafeInventory must be used within a CafeInventoryProvider');
  }
  return context;
};
