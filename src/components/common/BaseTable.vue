<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label, format? }]
  rows: { type: Array, default: () => [] },
  showActions: { type: Boolean, default: false },
  emptyText: { type: String, default: 'Belum ada data' }
})
defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key">{{ c.label }}</th>
          <th v-if="showActions">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td class="kosong" :colspan="columns.length + (showActions ? 1 : 0)">{{ emptyText }}</td>
        </tr>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="c in columns" :key="c.key">
            <slot :name="'cell-' + c.key" :row="row" :value="row[c.key]">
              {{ c.format ? c.format(row[c.key], row) : row[c.key] }}
            </slot>
          </td>
          <td v-if="showActions">
            <button class="btn btn-garis btn-kecil" @click="$emit('edit', row)">Ubah</button>
            <button class="btn btn-bahaya btn-kecil" style="margin-left: 6px" @click="$emit('delete', row)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
