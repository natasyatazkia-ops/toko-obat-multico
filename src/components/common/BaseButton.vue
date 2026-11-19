<script setup>
defineProps({
  label: { type: String, default: '' },
  variant: { type: String, default: 'primer' }, // primer, bahaya, garis
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  kecil: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['btn', 'btn-' + variant, { 'btn-kecil': kecil }]"
    @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
