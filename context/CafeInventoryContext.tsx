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

interface CafeInventoryContextType {
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  products: ProductData[];
  setProducts: React.Dispatch<React.SetStateAction<ProductData[]>>;
  processOrder: (items: { id: string; name: string; quantity: number }[]) => void;
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

export const CafeInventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [products, setProducts] = useState<ProductData[]>(INITIAL_PRODUCTS);
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

  return (
    <CafeInventoryContext.Provider value={{ materials, setMaterials, products, setProducts, processOrder }}>
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
