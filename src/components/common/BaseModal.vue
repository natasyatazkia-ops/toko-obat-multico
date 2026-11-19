<script setup>
defineProps({
  show: { type: Boolean, default: false }
})
</script>

<template>
  <div v-if="show" class="overlay">
    <div class="modal"><slot /></div>
  </div>
</template>
