<script setup>
import { ref, computed } from 'vue'
import SearchBar from '../common/SearchBar.vue'
import BaseButton from '../common/BaseButton.vue'
import { rupiah } from '../../utils/format'

const props = defineProps({
  products: { type: Array, required: true }
})
const emit = defineEmits(['add'])

const kata = ref('')

const hasil = computed(() =>
  props.products
    .filter((p) => (p.nama + ' ' + p.kode).toLowerCase().includes(kata.value.toLowerCase()))
    .slice(0, 8)
)
</script>

<template>
  <div>
    <div class="toolbar"><SearchBar v-model="kata" placeholder="Cari barang..." /></div>
    <div class="table-wrap">
      <table>
        <tbody>
          <tr v-for="p in hasil" :key="p.id">
            <td>{{ p.nama }}<br /><small>Stok {{ p.stok }}</small></td>
            <td>{{ rupiah(p.harga_jual) }}</td>
            <td><BaseButton label="Tambah" kecil :disabled="p.stok === 0" @click="emit('add', p)" /></td>
          </tr>
          <tr v-if="hasil.length === 0"><td class="kosong">Barang tidak ditemukan</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
