export interface Product {
  id: string;
  name: string;
  brand: string;
  oilType: string;
  unit: 'liter' | 'kg' | 'drum';
  stock: number;
  price: number;
  purchasePrice: number;
  minStock: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentType: 'cash' | 'credit';
  date: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  date: string;
}

export interface KhataTransaction {
  id: string;
  customerId: string;
  type: 'credit' | 'payment';
  amount: number;
  description: string;
  date: string;
}
