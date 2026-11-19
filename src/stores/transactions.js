import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import transactionsSeed from '../seed/transactions.json'
import itemsSeed from '../seed/transaction_items.json'
import { loadOrSeed, save } from '../utils/storage'
import { isPositiveInt } from '../utils/validators'
import { todayISO } from '../utils/format'
import { useProductsStore } from './products'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref(loadOrSeed('transactions', transactionsSeed))
  const items = ref(loadOrSeed('transaction_items', itemsSeed))

  watch(transactions, (v) => save('transactions', v), { deep: true })
  watch(items, (v) => save('transaction_items', v), { deep: true })

  const jumlahHariIni = computed(
    () => transactions.value.filter((t) => t.tanggal === todayISO()).length
  )

  // POST /api/v1/transactions
  // cart: [{ product_id, jumlah }]
  function create(cart, userId) {
    const products = useProductsStore()
    if (!cart.length) return { ok: false, message: 'Keranjang masih kosong' }

    for (const baris of cart) {
      const barang = products.getById(baris.product_id)
      if (!barang) return { ok: false, message: 'Barang tidak ditemukan' }
      if (!isPositiveInt(baris.jumlah)) {
        return { ok: false, message: `Jumlah untuk ${barang.nama} harus lebih dari 0` }
      }
      if (Number(baris.jumlah) > barang.stok) {
        return { ok: false, message: `Stok barang tidak cukup: ${barang.nama} (sisa ${barang.stok})` }
      }
    }

    const idBaru = transactions.value.reduce((max, t) => Math.max(max, t.id), 0) + 1
    let idItem = items.value.reduce((max, i) => Math.max(max, i.id), 0)
    let total = 0

    for (const baris of cart) {
      const barang = products.getById(baris.product_id)
      const jumlah = Number(baris.jumlah)
      const subtotal = barang.harga_jual * jumlah
      total += subtotal
      idItem += 1
      items.value.push({
        id: idItem,
        transaction_id: idBaru,
        product_id: barang.id,
        jumlah,
        harga_satuan: barang.harga_jual,
        subtotal
      })
      products.changeStock(barang.id, -jumlah)
    }

    const baru = { id: idBaru, user_id: userId, tanggal: todayISO(), total }
    transactions.value.push(baru)
    return { ok: true, message: 'Transaksi berhasil disimpan', data: baru }
  }

  return { transactions, items, jumlahHariIni, create }
})
