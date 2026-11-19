// Penyimpanan localStorage. Kalau data belum ada, isi dulu dari file JSON seed.
const PREFIX = 'multico:'

export function loadOrSeed(key, seed) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw !== null) return JSON.parse(raw)
  } catch (e) {
    console.warn('Data localStorage rusak, memakai data seed', key)
  }
  const salinan = JSON.parse(JSON.stringify(seed))
  save(key, salinan)
  return salinan
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {
    console.warn('Gagal menyimpan ke localStorage', key)
  }
}

export function loadValue(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch (e) {
    return fallback
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

// Menghapus semua data aplikasi, jadi data awal dimuat ulang dari seed
export function resetAll() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}
