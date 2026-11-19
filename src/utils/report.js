// Menghitung laporan bulanan dari data transaksi dan barang masuk
export function buildMonthlyReport(month, transactions, stockIns) {
  const perHari = {}
  const ambil = (tgl) => (perHari[tgl] ??= { tanggal: tgl, penjualan: 0, barang_masuk: 0 })

  transactions
    .filter((t) => t.tanggal.startsWith(month))
    .forEach((t) => (ambil(t.tanggal).penjualan += t.total))

  stockIns
    .filter((s) => s.tanggal.startsWith(month))
    .forEach((s) => (ambil(s.tanggal).barang_masuk += s.jumlah * s.harga_modal))

  const per_hari = Object.values(perHari).sort((a, b) => a.tanggal.localeCompare(b.tanggal))
  return {
    bulan: month,
    total_penjualan: per_hari.reduce((a, r) => a + r.penjualan, 0),
    total_barang_masuk: per_hari.reduce((a, r) => a + r.barang_masuk, 0),
    per_hari
  }
}
