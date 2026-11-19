import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import productsSeed from '../seed/products.json'
import categoriesSeed from '../seed/categories.json'
import { loadOrSeed, save } from '../utils/storage'
import { validateProduct, STOK_MENIPIS } from '../utils/validators'
import { useTransactionsStore } from './transactions'
import { useStockInsStore } from './stockIns'

export const useProductsStore = defineStore('products', () => {
  const items = ref(loadOrSeed('products', productsSeed))
  const categories = ref(loadOrSeed('categories', categoriesSeed))

  watch(items, (v) => save('products', v), { deep: true })
  watch(categories, (v) => save('categories', v), { deep: true })

  const stokMenipis = computed(() => items.value.filter((p) => p.stok <= STOK_MENIPIS))

  function getById(id) {
    return items.value.find((p) => p.id === Number(id))
  }

  function categoryName(id) {
    const k = categories.value.find((c) => c.id === Number(id))
    return k ? k.nama : '-'
  }

  function nextId() {
    return items.value.reduce((max, p) => Math.max(max, p.id), 0) + 1
  }

  function normalisasi(data) {
    return {
      kode: String(data.kode).trim(),
      nama: String(data.nama).trim(),
      category_id: Number(data.category_id),
      satuan: String(data.satuan).trim(),
      harga_modal: Number(data.harga_modal),
      harga_jual: Number(data.harga_jual),
      stok: Number(data.stok)
    }
  }

  // POST /api/v1/products
  function add(data) {
    const pesan = validateProduct(data, items.value)
    if (pesan) return { ok: false, message: pesan }
    const baru = { id: nextId(), ...normalisasi(data) }
    items.value.push(baru)
    return { ok: true, message: 'Barang berhasil disimpan', data: baru }
  }

  // PUT /api/v1/products/{id}
  function update(id, data) {
    const barang = getById(id)
    if (!barang) return { ok: false, message: 'Barang tidak ditemukan' }
    const pesan = validateProduct(data, items.value, barang.id)
    if (pesan) return { ok: false, message: pesan }
    Object.assign(barang, normalisasi(data))
    return { ok: true, message: 'Data barang berhasil diubah', data: barang }
  }

  // DELETE /api/v1/products/{id}
  function remove(id) {
    const barang = getById(id)
    if (!barang) return { ok: false, message: 'Barang tidak ditemukan' }
    const transaksi = useTransactionsStore()
    const barangMasuk = useStockInsStore()
    if (transaksi.items.some((i) => i.product_id === barang.id)) {
      return { ok: false, message: 'Barang tidak bisa dihapus karena sudah ada di riwayat transaksi' }
    }
    if (barangMasuk.items.some((s) => s.product_id === barang.id)) {
      return { ok: false, message: 'Barang tidak bisa dihapus karena sudah ada di riwayat barang masuk' }
    }
    items.value = items.value.filter((p) => p.id !== barang.id)
    return { ok: true, message: 'Barang berhasil dihapus' }
  }

  function changeStock(id, selisih) {
    const barang = getById(id)
    if (barang) barang.stok += selisih
  }

  function setModal(id, harga) {
    const barang = getById(id)
    if (barang) barang.harga_modal = harga
  }

  return {
    items, categories, stokMenipis,
    getById, categoryName, add, update, remove, changeStock, setModal
  }
})
