import { Product, Customer, Sale, StockEntry, KhataTransaction } from '../types';
import { daysAgo } from '../theme';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Mobil 1 0W-40', brand: 'Mobil', oilType: 'Synthetic Engine Oil', unit: 'liter', stock: 45, price: 1850, purchasePrice: 1500, minStock: 10, createdAt: daysAgo(60) },
  { id: 'p2', name: 'Shell Helix HX7 10W-40', brand: 'Shell', oilType: 'Semi-Synthetic Engine Oil', unit: 'liter', stock: 7, price: 1400, purchasePrice: 1100, minStock: 10, createdAt: daysAgo(60) },
  { id: 'p3', name: 'Castrol GTX 20W-50', brand: 'Castrol', oilType: 'Mineral Engine Oil', unit: 'liter', stock: 62, price: 980, purchasePrice: 750, minStock: 15, createdAt: daysAgo(60) },
  { id: 'p4', name: 'Total Quartz 5W-30', brand: 'Total', oilType: 'Full Synthetic Engine Oil', unit: 'liter', stock: 8, price: 2100, purchasePrice: 1700, minStock: 12, createdAt: daysAgo(60) },
  { id: 'p5', name: 'Grease MP', brand: 'Servo', oilType: 'Multi-Purpose Grease', unit: 'kg', stock: 25, price: 350, purchasePrice: 270, minStock: 5, createdAt: daysAgo(60) },
  { id: 'p6', name: 'Hydraulic Oil 46', brand: 'Servo', oilType: 'Hydraulic Oil', unit: 'drum', stock: 3, price: 12000, purchasePrice: 9500, minStock: 5, createdAt: daysAgo(60) },
  { id: 'p7', name: 'Gear Oil EP 90', brand: 'Caltex', oilType: 'Gear Oil', unit: 'liter', stock: 18, price: 620, purchasePrice: 480, minStock: 8, createdAt: daysAgo(45) },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Ahmed Khan', phone: '0300-1234567', createdAt: daysAgo(60) },
  { id: 'c2', name: 'Raza Petrol Pump', phone: '0321-9876543', createdAt: daysAgo(55) },
  { id: 'c3', name: 'Ali Motors', phone: '0333-4567890', createdAt: daysAgo(50) },
  { id: 'c4', name: 'Hussain Workshop', phone: '0345-1111222', createdAt: daysAgo(45) },
  { id: 'c5', name: 'Bilal Garage', phone: '0312-5555666', createdAt: daysAgo(30) },
];

export const mockSales: Sale[] = [
  { id: 's1', customerId: 'c1', customerName: 'Ahmed Khan', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 4, unitPrice: 1850, totalAmount: 7400, paymentType: 'cash', date: daysAgo(0) },
  { id: 's2', customerName: 'Walk-in Customer', productId: 'p3', productName: 'Castrol GTX 20W-50', quantity: 5, unitPrice: 980, totalAmount: 4900, paymentType: 'cash', date: daysAgo(0) },
  { id: 's3', customerId: 'c2', customerName: 'Raza Petrol Pump', productId: 'p2', productName: 'Shell Helix HX7 10W-40', quantity: 10, unitPrice: 1400, totalAmount: 14000, paymentType: 'credit', date: daysAgo(0) },
  { id: 's4', customerId: 'c3', customerName: 'Ali Motors', productId: 'p4', productName: 'Total Quartz 5W-30', quantity: 8, unitPrice: 2100, totalAmount: 16800, paymentType: 'credit', date: daysAgo(1) },
  { id: 's5', customerName: 'Walk-in Customer', productId: 'p5', productName: 'Grease MP', quantity: 3, unitPrice: 350, totalAmount: 1050, paymentType: 'cash', date: daysAgo(1) },
  { id: 's6', customerName: 'Walk-in Customer', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 4, unitPrice: 1850, totalAmount: 7400, paymentType: 'cash', date: daysAgo(2) },
  { id: 's7', customerId: 'c4', customerName: 'Hussain Workshop', productId: 'p6', productName: 'Hydraulic Oil 46', quantity: 2, unitPrice: 12000, totalAmount: 24000, paymentType: 'credit', date: daysAgo(2) },
  { id: 's8', customerName: 'Walk-in Customer', productId: 'p3', productName: 'Castrol GTX 20W-50', quantity: 8, unitPrice: 980, totalAmount: 7840, paymentType: 'cash', date: daysAgo(2) },
  { id: 's9', customerId: 'c1', customerName: 'Ahmed Khan', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 6, unitPrice: 1850, totalAmount: 11100, paymentType: 'credit', date: daysAgo(3) },
  { id: 's10', customerName: 'Walk-in Customer', productId: 'p7', productName: 'Gear Oil EP 90', quantity: 5, unitPrice: 620, totalAmount: 3100, paymentType: 'cash', date: daysAgo(3) },
  { id: 's11', customerId: 'c5', customerName: 'Bilal Garage', productId: 'p2', productName: 'Shell Helix HX7 10W-40', quantity: 12, unitPrice: 1400, totalAmount: 16800, paymentType: 'credit', date: daysAgo(4) },
  { id: 's12', customerName: 'Walk-in Customer', productId: 'p5', productName: 'Grease MP', quantity: 5, unitPrice: 350, totalAmount: 1750, paymentType: 'cash', date: daysAgo(4) },
  { id: 's13', customerId: 'c2', customerName: 'Raza Petrol Pump', productId: 'p3', productName: 'Castrol GTX 20W-50', quantity: 15, unitPrice: 980, totalAmount: 14700, paymentType: 'credit', date: daysAgo(5) },
  { id: 's14', customerName: 'Walk-in Customer', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 2, unitPrice: 1850, totalAmount: 3700, paymentType: 'cash', date: daysAgo(5) },
  { id: 's15', customerId: 'c3', customerName: 'Ali Motors', productId: 'p4', productName: 'Total Quartz 5W-30', quantity: 10, unitPrice: 2100, totalAmount: 21000, paymentType: 'credit', date: daysAgo(6) },
  { id: 's16', customerName: 'Walk-in Customer', productId: 'p3', productName: 'Castrol GTX 20W-50', quantity: 6, unitPrice: 980, totalAmount: 5880, paymentType: 'cash', date: daysAgo(7) },
  { id: 's17', customerId: 'c1', customerName: 'Ahmed Khan', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 4, unitPrice: 1850, totalAmount: 7400, paymentType: 'credit', date: daysAgo(8) },
  { id: 's18', customerName: 'Walk-in Customer', productId: 'p7', productName: 'Gear Oil EP 90', quantity: 8, unitPrice: 620, totalAmount: 4960, paymentType: 'cash', date: daysAgo(10) },
  { id: 's19', customerId: 'c4', customerName: 'Hussain Workshop', productId: 'p6', productName: 'Hydraulic Oil 46', quantity: 1, unitPrice: 12000, totalAmount: 12000, paymentType: 'cash', date: daysAgo(12) },
  { id: 's20', customerId: 'c2', customerName: 'Raza Petrol Pump', productId: 'p2', productName: 'Shell Helix HX7 10W-40', quantity: 20, unitPrice: 1400, totalAmount: 28000, paymentType: 'credit', date: daysAgo(15) },
  { id: 's21', customerName: 'Walk-in Customer', productId: 'p3', productName: 'Castrol GTX 20W-50', quantity: 10, unitPrice: 980, totalAmount: 9800, paymentType: 'cash', date: daysAgo(18) },
  { id: 's22', customerId: 'c5', customerName: 'Bilal Garage', productId: 'p4', productName: 'Total Quartz 5W-30', quantity: 6, unitPrice: 2100, totalAmount: 12600, paymentType: 'credit', date: daysAgo(22) },
  { id: 's23', customerName: 'Walk-in Customer', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 3, unitPrice: 1850, totalAmount: 5550, paymentType: 'cash', date: daysAgo(25) },
];

export const mockKhataTransactions: KhataTransaction[] = [
  { id: 'k1', customerId: 'c1', type: 'credit', amount: 7400, description: 'Mobil 1 0W-40 × 4L', date: daysAgo(0) },
  { id: 'k2', customerId: 'c1', type: 'credit', amount: 11100, description: 'Mobil 1 0W-40 × 6L', date: daysAgo(3) },
  { id: 'k3', customerId: 'c1', type: 'credit', amount: 7400, description: 'Mobil 1 0W-40 × 4L', date: daysAgo(8) },
  { id: 'k4', customerId: 'c1', type: 'payment', amount: 10000, description: 'Cash Payment', date: daysAgo(20) },
  { id: 'k5', customerId: 'c2', type: 'credit', amount: 14000, description: 'Shell Helix HX7 × 10L', date: daysAgo(0) },
  { id: 'k6', customerId: 'c2', type: 'credit', amount: 14700, description: 'Castrol GTX 20W-50 × 15L', date: daysAgo(5) },
  { id: 'k7', customerId: 'c2', type: 'payment', amount: 25000, description: 'Cash Payment', date: daysAgo(15) },
  { id: 'k8', customerId: 'c3', type: 'credit', amount: 16800, description: 'Total Quartz 5W-30 × 8L', date: daysAgo(1) },
  { id: 'k9', customerId: 'c3', type: 'credit', amount: 21000, description: 'Total Quartz 5W-30 × 10L', date: daysAgo(6) },
  { id: 'k10', customerId: 'c3', type: 'payment', amount: 20000, description: 'Bank Transfer', date: daysAgo(25) },
  { id: 'k11', customerId: 'c4', type: 'credit', amount: 24000, description: 'Hydraulic Oil 46 × 2 drums', date: daysAgo(2) },
  { id: 'k12', customerId: 'c4', type: 'payment', amount: 24000, description: 'Cash Payment', date: daysAgo(1) },
  { id: 'k13', customerId: 'c5', type: 'credit', amount: 16800, description: 'Shell Helix HX7 × 12L', date: daysAgo(4) },
  { id: 'k14', customerId: 'c5', type: 'credit', amount: 12600, description: 'Total Quartz 5W-30 × 6L', date: daysAgo(22) },
];

export const mockStockEntries: StockEntry[] = [
  { id: 'se1', productId: 'p1', productName: 'Mobil 1 0W-40', quantity: 20, purchasePrice: 1500, date: daysAgo(30) },
  { id: 'se2', productId: 'p3', productName: 'Castrol GTX 20W-50', quantity: 30, purchasePrice: 750, date: daysAgo(30) },
  { id: 'se3', productId: 'p6', productName: 'Hydraulic Oil 46', quantity: 5, purchasePrice: 9500, date: daysAgo(20) },
  { id: 'se4', productId: 'p2', productName: 'Shell Helix HX7 10W-40', quantity: 15, purchasePrice: 1100, date: daysAgo(15) },
];
