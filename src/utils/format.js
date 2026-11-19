export function rupiah(angka) {
  return 'Rp' + Number(angka || 0).toLocaleString('id-ID')
}

export function todayISO() {
  const d = new Date()
  const bulan = String(d.getMonth() + 1).padStart(2, '0')
  const hari = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${bulan}-${hari}`
}

export function thisMonth() {
  return todayISO().slice(0, 7)
}
