<script setup>
import { ref, computed } from 'vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseButton from '../components/common/BaseButton.vue'
import ProductPicker from '../components/transaction/ProductPicker.vue'
import CartTable from '../components/transaction/CartTable.vue'
import { useProductsStore } from '../stores/products'
import { useTransactionsStore } from '../stores/transactions'
import { useAuthStore } from '../stores/auth'
import { rupiah } from '../utils/format'

const products = useProductsStore()
const transaksi = useTransactionsStore()
const auth = useAuthStore()

const keranjang = ref([]) // [{ product_id, jumlah }]
const pesan = ref(null)

const baris = computed(() =>
  keranjang.value.map((k) => {
    const b = products.getById(k.product_id)
    return {
      product_id: k.product_id,
      nama: b.nama,
      jumlah: k.jumlah,
      stok: b.stok,
      subtotal: b.harga_jual * Number(k.jumlah || 0)
    }
  })
)

const total = computed(() => baris.value.reduce((a, b) => a + b.subtotal, 0))

function tambah(barang) {
  const ada = keranjang.value.find((k) => k.product_id === barang.id)
  if (!ada) keranjang.value.push({ product_id: barang.id, jumlah: 1 })
  else if (Number(ada.jumlah) < barang.stok) ada.jumlah = Number(ada.jumlah) + 1
}

function ubahJumlah(id, nilai) {
  const ada = keranjang.value.find((k) => k.product_id === id)
  if (ada) ada.jumlah = nilai
}

function buang(id) {
  keranjang.value = keranjang.value.filter((k) => k.product_id !== id)
}

function simpan() {
  const hasil = transaksi.create(keranjang.value, auth.user.id)
  if (hasil.ok) {
    pesan.value = { jenis: 'sukses', teks: `${hasil.message}. Total ${rupiah(hasil.data.total)}` }
    keranjang.value = []
  } else {
    pesan.value = { jenis: 'bahaya', teks: hasil.message }
  }
}

const kolomRiwayat = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'kasir', label: 'Dicatat oleh' },
  { key: 'jumlah_item', label: 'Jumlah Item' },
  { key: 'total', label: 'Total', format: rupiah }
]

const riwayat = computed(() =>
  [...transaksi.transactions]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id)
    .slice(0, 10)
    .map((t) => ({
      ...t,
      kasir: auth.users.find((u) => u.id === t.user_id)?.nama ?? '-',
      jumlah_item: transaksi.items.filter((i) => i.transaction_id === t.id).length
    }))
)
</script>

<template>
  <h1>Transaksi Penjualan</h1>
  <div v-if="pesan" :class="['alert', 'alert-' + pesan.jenis]">{{ pesan.teks }}</div>

  <div class="two-col">
    <div class="kiri">
      <h2 style="margin-top: 0">Pilih Barang</h2>
      <ProductPicker :products="products.items" @add="tambah" />
    </div>
    <div class="kanan">
      <h2 style="margin-top: 0">Keranjang</h2>
      <CartTable :lines="baris" @update-jumlah="ubahJumlah" @remove="buang" />
      <h2>Total: {{ rupiah(total) }}</h2>
      <BaseButton label="Simpan Transaksi" @click="simpan" />
    </div>
  </div>

  <h2>Riwayat Transaksi Terakhir</h2>
  <BaseTable :columns="kolomRiwayat" :rows="riwayat" empty-text="Belum ada transaksi" />
</template>
