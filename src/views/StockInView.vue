<script setup>
import { ref, computed } from 'vue'
import BaseTable from '../components/common/BaseTable.vue'
import StockInForm from '../components/stock/StockInForm.vue'
import { useProductsStore } from '../stores/products'
import { useStockInsStore } from '../stores/stockIns'
import { useAuthStore } from '../stores/auth'
import { rupiah } from '../utils/format'

const products = useProductsStore()
const stockIns = useStockInsStore()
const auth = useAuthStore()

const pesan = ref(null)

const kolom = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'nama_barang', label: 'Barang' },
  { key: 'jumlah', label: 'Jumlah' },
  { key: 'harga_modal', label: 'Harga Modal', format: rupiah }
]

const baris = computed(() =>
  [...stockIns.items]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id)
    .map((s) => ({ ...s, nama_barang: products.getById(s.product_id)?.nama ?? '-' }))
)

function simpan(data, resetForm) {
  const hasil = stockIns.add({ ...data, user_id: auth.user.id })
  if (hasil.ok) {
    pesan.value = { jenis: 'sukses', teks: `${hasil.message}. Stok sekarang: ${hasil.data.stok_sekarang}` }
    resetForm()
  } else {
    pesan.value = { jenis: 'bahaya', teks: hasil.message }
  }
}
</script>

<template>
  <h1>Barang Masuk</h1>
  <div v-if="pesan" :class="['alert', 'alert-' + pesan.jenis]">{{ pesan.teks }}</div>
  <div class="two-col">
    <div class="kiri" style="max-width: 380px">
      <h2 style="margin-top: 0">Catat Barang Masuk</h2>
      <StockInForm :products="products.items" @submit="simpan" />
    </div>
    <div class="kanan">
      <h2 style="margin-top: 0">Riwayat Barang Masuk</h2>
      <BaseTable :columns="kolom" :rows="baris" empty-text="Belum ada barang masuk" />
    </div>
  </div>
</template>
