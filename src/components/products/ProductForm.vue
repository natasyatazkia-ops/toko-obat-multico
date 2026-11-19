<script setup>
import { reactive, computed } from 'vue'
import FormInput from '../common/FormInput.vue'
import BaseButton from '../common/BaseButton.vue'

const props = defineProps({
  barang: { type: Object, default: null }, // null = tambah baru, ada isi = ubah
  categories: { type: Array, required: true },
  serverError: { type: String, default: '' }
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  kode: props.barang?.kode ?? '',
  nama: props.barang?.nama ?? '',
  category_id: props.barang ? String(props.barang.category_id) : '',
  satuan: props.barang?.satuan ?? '',
  harga_modal: props.barang?.harga_modal ?? '',
  harga_jual: props.barang?.harga_jual ?? '',
  stok: props.barang?.stok ?? 0
})

const opsiKategori = computed(() => props.categories.map((c) => ({ value: String(c.id), label: c.nama })))
</script>

<template>
  <form @submit.prevent="emit('submit', { ...form })">
    <h2 style="margin-top: 0">{{ barang ? 'Ubah Barang' : 'Tambah Barang' }}</h2>
    <div v-if="serverError" class="alert alert-bahaya">{{ serverError }}</div>
    <FormInput v-model="form.kode" label="Kode" placeholder="contoh: OB-006" />
    <FormInput v-model="form.nama" label="Nama Barang" />
    <FormInput v-model="form.category_id" label="Kategori" type="select" :options="opsiKategori" />
    <FormInput v-model="form.satuan" label="Satuan" placeholder="botol, strip, pcs" />
    <FormInput v-model="form.harga_modal" label="Harga Modal" type="number" />
    <FormInput v-model="form.harga_jual" label="Harga Jual" type="number" />
    <FormInput v-model="form.stok" label="Stok" type="number" />
    <div class="modal-aksi">
      <BaseButton label="Batal" variant="garis" @click="emit('cancel')" />
      <BaseButton label="Simpan" type="submit" />
    </div>
  </form>
</template>
