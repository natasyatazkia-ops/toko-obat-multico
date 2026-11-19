<script setup>
import { ref, computed } from 'vue'
import BaseTable from '../components/common/BaseTable.vue'
import BaseButton from '../components/common/BaseButton.vue'
import SearchBar from '../components/common/SearchBar.vue'
import ConfirmDialog from '../components/common/ConfirmDialog.vue'
import BaseModal from '../components/common/BaseModal.vue'
import ProductForm from '../components/products/ProductForm.vue'
import { useProductsStore } from '../stores/products'
import { useAuthStore } from '../stores/auth'
import { rupiah } from '../utils/format'
import { STOK_MENIPIS } from '../utils/validators'

const products = useProductsStore()
const auth = useAuthStore()

const isPengelola = computed(() => auth.role === 'Pengelola')
const kata = ref('')
const kategori = ref('')
const pesan = ref(null) // { jenis, teks }

const tampilForm = ref(false)
const barangDiubah = ref(null)
const errorForm = ref('')
const barangDihapus = ref(null)

const kolom = [
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'satuan', label: 'Satuan' },
  { key: 'harga_modal', label: 'Harga Modal', format: rupiah },
  { key: 'harga_jual', label: 'Harga Jual', format: rupiah },
  { key: 'stok', label: 'Stok' }
]

const baris = computed(() =>
  products.items
    .filter((p) => {
      const cocokKata = (p.nama + ' ' + p.kode).toLowerCase().includes(kata.value.toLowerCase())
      const cocokKategori = !kategori.value || p.category_id === Number(kategori.value)
      return cocokKata && cocokKategori
    })
    .map((p) => ({ ...p, kategori: products.categoryName(p.category_id) }))
)

function bukaTambah() {
  barangDiubah.value = null
  errorForm.value = ''
  tampilForm.value = true
}

function bukaUbah(row) {
  barangDiubah.value = products.getById(row.id)
  errorForm.value = ''
  tampilForm.value = true
}

function simpan(data) {
  const hasil = barangDiubah.value
    ? products.update(barangDiubah.value.id, data)
    : products.add(data)
  if (!hasil.ok) {
    errorForm.value = hasil.message
    return
  }
  tampilForm.value = false
  pesan.value = { jenis: 'sukses', teks: hasil.message }
}

function hapus() {
  const hasil = products.remove(barangDihapus.value.id)
  barangDihapus.value = null
  pesan.value = { jenis: hasil.ok ? 'sukses' : 'bahaya', teks: hasil.message }
}
</script>

<template>
  <h1>Data Barang</h1>
  <div v-if="pesan" :class="['alert', 'alert-' + pesan.jenis]">{{ pesan.teks }}</div>

  <div class="toolbar">
    <SearchBar v-model="kata" placeholder="Cari nama atau kode barang..." />
    <div class="field" style="margin-bottom: 0">
      <select v-model="kategori">
        <option value="">Semua kategori</option>
        <option v-for="c in products.categories" :key="c.id" :value="c.id">{{ c.nama }}</option>
      </select>
    </div>
    <BaseButton v-if="isPengelola" label="+ Tambah Barang" @click="bukaTambah" />
  </div>

  <BaseTable
    :columns="kolom"
    :rows="baris"
    :show-actions="isPengelola"
    empty-text="Barang tidak ditemukan"
    @edit="bukaUbah"
    @delete="(row) => (barangDihapus = row)"
  >
    <template #cell-stok="{ value }">
      <span :class="{ menipis: value <= STOK_MENIPIS }">{{ value }}</span>
    </template>
  </BaseTable>

  <BaseModal :show="tampilForm">
    <ProductForm
      :barang="barangDiubah"
      :categories="products.categories"
      :server-error="errorForm"
      @submit="simpan"
      @cancel="tampilForm = false"
    />
  </BaseModal>

  <ConfirmDialog
    :show="barangDihapus !== null"
    :pesan="`Hapus barang ${barangDihapus?.nama}?`"
    @confirm="hapus"
    @cancel="barangDihapus = null"
  />
</template>
