<script setup>
defineProps({
  judul: { type: String, required: true },
  nilai: { type: [String, Number], required: true },
  peringatan: { type: Boolean, default: false }
})
</script>

<template>
  <div :class="['summary-card', { peringatan }]">
    <div class="judul">{{ judul }}</div>
    <div class="nilai">{{ nilai }}</div>
  </div>
</template>
