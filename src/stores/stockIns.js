import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import stockInsSeed from '../seed/stock_ins.json'
import { loadOrSeed, save } from '../utils/storage'
import { isPositiveInt } from '../utils/validators'
import { useProductsStore } from './products'

export const useStockInsStore = defineStore('stockIns', () => {
  const items = ref(loadOrSeed('stock_ins', stockInsSeed))
  watch(items, (v) => save('stock_ins', v), { deep: true })

  // POST /api/v1/stock-ins
  function add({ product_id, jumlah, harga_modal, tanggal, user_id }) {
    const products = useProductsStore()
    const barang = products.getById(product_id)
    if (!barang) return { ok: false, message: 'Barang wajib dipilih' }
    if (!isPositiveInt(jumlah)) return { ok: false, message: 'Jumlah barang masuk harus lebih dari 0' }
    if (!isPositiveInt(harga_modal)) return { ok: false, message: 'Harga modal harus berupa angka lebih dari 0' }
    if (!tanggal) return { ok: false, message: 'Tanggal wajib diisi' }

    const baru = {
      id: items.value.reduce((max, s) => Math.max(max, s.id), 0) + 1,
      product_id: barang.id,
      user_id,
      jumlah: Number(jumlah),
      harga_modal: Number(harga_modal),
      tanggal
    }
    items.value.push(baru)
    products.changeStock(barang.id, baru.jumlah)
    products.setModal(barang.id, baru.harga_modal)
    return {
      ok: true,
      message: 'Barang masuk berhasil dicatat',
      data: { id: baru.id, product_id: barang.id, stok_sekarang: barang.stok }
    }
  }

  return { items, add }
})
