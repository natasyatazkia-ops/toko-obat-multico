<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Cari...' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field" style="margin-bottom: 0; flex: 1; min-width: 200px">
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
