<script setup>
import { computed } from 'vue'
import SummaryCard from '../components/common/SummaryCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import { useProductsStore } from '../stores/products'
import { useTransactionsStore } from '../stores/transactions'

const products = useProductsStore()
const transaksi = useTransactionsStore()

const kolom = [
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'stok', label: 'Stok' }
]

const barisMenipis = computed(() =>
  products.stokMenipis.map((p) => ({ ...p, kategori: products.categoryName(p.category_id) }))
)
</script>

<template>
  <h1>Beranda</h1>
  <div class="cards">
    <SummaryCard judul="Total Barang" :nilai="products.items.length" />
    <SummaryCard judul="Transaksi Hari Ini" :nilai="transaksi.jumlahHariIni" />
    <SummaryCard judul="Stok Menipis" :nilai="products.stokMenipis.length" peringatan />
  </div>
  <h2>Barang yang stoknya menipis</h2>
  <BaseTable :columns="kolom" :rows="barisMenipis" empty-text="Tidak ada barang yang stoknya menipis">
    <template #cell-stok="{ value }"><span class="menipis">{{ value }}</span></template>
  </BaseTable>
</template>
