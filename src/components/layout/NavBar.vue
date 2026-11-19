<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function keluar() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <div class="judul">MULTICO</div>
    <div class="user">
      <span>{{ auth.user?.nama }} ({{ auth.role }})</span>
      <button class="btn btn-garis btn-kecil" @click="keluar">Keluar</button>
    </div>
  </header>
</template>
