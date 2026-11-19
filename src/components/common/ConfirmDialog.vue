<script setup>
defineProps({
  show: { type: Boolean, default: false },
  pesan: { type: String, default: 'Yakin ingin melanjutkan?' }
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal" style="width: 360px">
      <p>{{ pesan }}</p>
      <div class="modal-aksi">
        <button class="btn btn-garis" @click="$emit('cancel')">Batal</button>
        <button class="btn btn-bahaya" @click="$emit('confirm')">Ya, hapus</button>
      </div>
    </div>
  </div>
</template>
