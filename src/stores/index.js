import { useAuthStore } from './auth'
import { useProductsStore } from './products'
import { useStockInsStore } from './stockIns'
import { useTransactionsStore } from './transactions'

// Dipanggil sekali saat aplikasi dimulai, supaya semua data seed langsung
// dimuat ke Pinia dan disimpan ke localStorage sejak awal.
export function initStores() {
  useAuthStore()
  useProductsStore()
  useStockInsStore()
  useTransactionsStore()
}
