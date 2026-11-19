<script setup>
import BaseButton from '../common/BaseButton.vue'
import { rupiah } from '../../utils/format'

defineProps({
  lines: { type: Array, required: true } // [{ product_id, nama, jumlah, stok, subtotal }]
})
const emit = defineEmits(['update-jumlah', 'remove'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Barang</th><th>Jumlah</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>
        <tr v-if="lines.length === 0"><td class="kosong" colspan="4">Keranjang masih kosong</td></tr>
        <tr v-for="k in lines" :key="k.product_id">
          <td>{{ k.nama }}</td>
          <td>
            <input
              type="number" min="1" :max="k.stok" style="width: 70px"
              :value="k.jumlah"
              @input="emit('update-jumlah', k.product_id, $event.target.value)"
            />
          </td>
          <td>{{ rupiah(k.subtotal) }}</td>
          <td><BaseButton label="Buang" variant="bahaya" kecil @click="emit('remove', k.product_id)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
