<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

// Menu diambil dari daftar route, jadi cuma halaman yang boleh dibuka role ini yang tampil
const menu = computed(() => {
  const induk = router.options.routes.find((r) => r.path === '/')
  return induk.children.filter((r) => r.meta && r.meta.title && r.meta.roles.includes(auth.role))
})
</script>

<template>
  <nav class="sidemenu">
    <RouterLink v-for="m in menu" :key="m.name" :to="{ name: m.name }">{{ m.meta.title }}</RouterLink>
  </nav>
</template>
