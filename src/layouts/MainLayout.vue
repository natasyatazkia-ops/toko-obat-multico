<script setup>
import NavBar from '../components/layout/NavBar.vue'
import SideMenu from '../components/layout/SideMenu.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <NavBar />
  <div class="layout-body">
    <SideMenu />
    <main class="konten">
      <div v-if="auth.notice" class="alert alert-peringatan">
        {{ auth.notice }}
        <button class="btn btn-garis btn-kecil" style="margin-left: 10px" @click="auth.setNotice('')">Tutup</button>
      </div>
      <RouterView />
    </main>
  </div>
</template>
