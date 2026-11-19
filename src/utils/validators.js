export const STOK_MENIPIS = 5

export function isPositiveInt(v) {
  return Number.isInteger(Number(v)) && Number(v) > 0 && String(v).trim() !== ''
}

export function isNonNegativeInt(v) {
  return Number.isInteger(Number(v)) && Number(v) >= 0 && String(v).trim() !== ''
}

// Mengembalikan pesan error (string) atau null kalau data barang valid
export function validateProduct(p, daftarBarang, idSendiri = null) {
  if (!String(p.kode || '').trim()) return 'Kode barang wajib diisi'
  if (!String(p.nama || '').trim()) return 'Nama barang wajib diisi'
  if (!p.category_id) return 'Kategori wajib dipilih'
  if (!String(p.satuan || '').trim()) return 'Satuan wajib diisi'
  if (!isPositiveInt(p.harga_modal)) return 'Harga modal harus berupa angka lebih dari 0'
  if (!isPositiveInt(p.harga_jual)) return 'Harga jual harus berupa angka lebih dari 0'
  if (!isNonNegativeInt(p.stok)) return 'Stok harus berupa angka 0 atau lebih'
  const kembar = daftarBarang.some(
    (b) => b.id !== idSendiri && b.kode.toLowerCase() === String(p.kode).trim().toLowerCase()
  )
  if (kembar) return 'Kode barang sudah dipakai barang lain'
  return null
}
