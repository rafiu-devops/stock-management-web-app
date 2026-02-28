import Dexie, { Table } from "dexie";
import { Product, Customer, Sale, StockEntry, KhataTransaction } from "../types";

class AppDB extends Dexie {
  products!: Table<Product, number>;
  customers!: Table<Customer, number>;
  sales!: Table<Sale, number>;
  stockEntries!: Table<StockEntry, number>;
  khataTransactions!: Table<KhataTransaction, number>;

  constructor() {
    super("stock-management-db");

    this.version(1).stores({
      products: "++id, name, brand",
      customers: "++id, name",
      sales: "++id, date, productId",
      stockEntries: "++id, productId, date",
      khataTransactions: "++id, customerId, date",
    });
  }
}

export const db = new AppDB();