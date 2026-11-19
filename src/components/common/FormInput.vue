<script setup>
defineProps({
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' }, // text, number, date, select
  options: { type: Array, default: () => [] }, // untuk select: [{ value, label }]
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label>{{ label }}</label>
    <select
      v-if="type === 'select'"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">-- Pilih --</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>
