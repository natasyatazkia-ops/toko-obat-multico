import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import usersSeed from '../seed/users.json'
import { loadOrSeed, loadValue, save, remove } from '../utils/storage'

export const useAuthStore = defineStore('auth', () => {
  // Daftar pengguna dimuat dari seed saat pertama kali, lalu disimpan di localStorage
  const users = ref(loadOrSeed('users', usersSeed))
  const user = ref(loadValue('session'))
  const notice = ref('')

  watch(users, (v) => save('users', v), { deep: true })

  const isLoggedIn = computed(() => user.value !== null)
  const role = computed(() => (user.value ? user.value.role : null))

  function login(username, password) {
    if (!String(username).trim() || !String(password).trim()) {
      return { ok: false, message: 'Username dan password wajib diisi' }
    }
    const ditemukan = users.value.find(
      (u) => u.username === String(username).trim() && u.password === password
    )
    if (!ditemukan) return { ok: false, message: 'Username atau password salah' }

    user.value = {
      id: ditemukan.id,
      nama: ditemukan.nama,
      username: ditemukan.username,
      role: ditemukan.role
    }
    save('session', user.value)
    return { ok: true, message: 'Login berhasil', data: user.value }
  }

  function logout() {
    user.value = null
    notice.value = ''
    remove('session')
  }

  function setNotice(pesan) {
    notice.value = pesan
  }

  return { users, user, notice, isLoggedIn, role, login, logout, setNotice }
})
