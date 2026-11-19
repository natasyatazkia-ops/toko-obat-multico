<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import FormInput from '../components/common/FormInput.vue'
import BaseButton from '../components/common/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const pesan = ref('')

function masuk() {
  const hasil = auth.login(username.value, password.value)
  if (!hasil.ok) {
    pesan.value = hasil.message
    return
  }
  router.push({ name: 'beranda' })
}
</script>

<template>
  <div class="login-wrap">
    <form class="login-box" @submit.prevent="masuk">
      <h1>MULTICO</h1>
      <div class="sub">Toko Obat &amp; Cosmetik</div>
      <div v-if="pesan" class="alert alert-bahaya">{{ pesan }}</div>
      <FormInput v-model="username" label="Username" />
      <FormInput v-model="password" label="Password" type="password" />
      <BaseButton label="Masuk" type="submit" style="width: 100%" />
      <div class="hint">
        Akun contoh: pengelola / pengelola123 dan petugas1 / petugas123
      </div>
    </form>
  </div>
</template>
