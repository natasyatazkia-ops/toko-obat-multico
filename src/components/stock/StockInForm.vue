<script setup>
import { reactive, computed, watch } from 'vue'
import FormInput from '../common/FormInput.vue'
import BaseButton from '../common/BaseButton.vue'
import { todayISO } from '../../utils/format'

const props = defineProps({
  products: { type: Array, required: true }
})
const emit = defineEmits(['submit'])

const form = reactive({ product_id: '', jumlah: '', harga_modal: '', tanggal: todayISO() })

const opsiBarang = computed(() => props.products.map((p) => ({ value: String(p.id), label: `${p.kode} - ${p.nama}` })))

// Pilih barang, harga modal terakhir langsung terisi
watch(() => form.product_id, (id) => {
  const barang = props.products.find((p) => p.id === Number(id))
  if (barang) form.harga_modal = barang.harga_modal
})

function kirim() {
  emit('submit', { ...form }, () => {
    form.product_id = ''
    form.jumlah = ''
    form.harga_modal = ''
    form.tanggal = todayISO()
  })
}
</script>

<template>
  <form class="card-box" @submit.prevent="kirim">
    <FormInput v-model="form.product_id" label="Barang" type="select" :options="opsiBarang" />
    <FormInput v-model="form.jumlah" label="Jumlah" type="number" />
    <FormInput v-model="form.harga_modal" label="Harga Modal" type="number" />
    <FormInput v-model="form.tanggal" label="Tanggal" type="date" />
    <BaseButton label="Simpan" type="submit" />
  </form>
</template>
