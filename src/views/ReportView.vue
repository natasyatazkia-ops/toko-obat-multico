<script setup>
import { ref, computed } from 'vue'
import SummaryCard from '../components/common/SummaryCard.vue'
import BaseTable from '../components/common/BaseTable.vue'
import { useTransactionsStore } from '../stores/transactions'
import { useStockInsStore } from '../stores/stockIns'
import { buildMonthlyReport } from '../utils/report'
import { rupiah, thisMonth } from '../utils/format'

const transaksi = useTransactionsStore()
const stockIns = useStockInsStore()

const bulan = ref(thisMonth())
const formatValid = computed(() => /^\d{4}-\d{2}$/.test(bulan.value))

const laporan = computed(() =>
  formatValid.value ? buildMonthlyReport(bulan.value, transaksi.transactions, stockIns.items) : null
)

const kolom = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'penjualan', label: 'Penjualan (uang masuk)', format: rupiah },
  { key: 'barang_masuk', label: 'Barang Masuk (uang keluar)', format: rupiah }
]

const baris = computed(() => (laporan.value ? laporan.value.per_hari.map((r) => ({ ...r, id: r.tanggal })) : []))
</script>

<template>
  <h1>Laporan Bulanan</h1>
  <div class="toolbar">
    <div class="field" style="margin-bottom: 0">
      <label>Bulan</label>
      <input v-model="bulan" type="month" />
    </div>
  </div>

  <div v-if="!formatValid" class="alert alert-bahaya">Format bulan harus YYYY-MM</div>
  <template v-else>
    <div class="cards">
      <SummaryCard judul="Total Penjualan" :nilai="rupiah(laporan.total_penjualan)" />
      <SummaryCard judul="Total Barang Masuk" :nilai="rupiah(laporan.total_barang_masuk)" />
    </div>
    <BaseTable :columns="kolom" :rows="baris" empty-text="Belum ada data pada bulan ini" />
  </template>
</template>
