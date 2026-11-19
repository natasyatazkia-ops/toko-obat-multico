# Sistem Informasi Toko Obat & Cosmetik MULTICO

Tugas UTS Pemrograman Berbasis Komponen. Dibuat dengan Vue.js v3 (`<script setup>`), Vue Router, Pinia, dan Vite.

## Cara menjalankan

Butuh Node.js (versi terbaru). Di terminal VS Code, dari folder proyek ini:

```
npm install
npm run dev
```

Lalu buka alamat yang muncul di terminal (biasanya http://localhost:5173).

## Akun contoh

| Role | Username | Password |
|---|---|---|
| Pengelola | pengelola | pengelola123 |
| Petugas Toko | petugas1 | petugas123 |

## Struktur folder

```
src/
  seed/         data awal (JSON): users, categories, products, stock_ins, transactions, transaction_items
  stores/       Pinia store: auth, products, stockIns, transactions
  router/       Vue Router + penjaga halaman berdasarkan role
  layouts/      MainLayout (NavBar + SideMenu + halaman)
  views/        halaman: Login, Beranda, Data Barang, Barang Masuk, Transaksi, Laporan
  components/   komponen kecil: common (reusable), layout, products, stock, transaction
  utils/        storage (localStorage), validasi, format, laporan
  assets/       main.css (palet warna dan gaya)
```

## Data awal dan localStorage

Saat aplikasi dimulai (src/main.js memanggil initStores), semua store diinisialisasi. Saat pertama dijalankan, data diambil dari file JSON di `src/seed` lalu disimpan ke localStorage dengan awalan `multico:`. Setelah itu semua perubahan (tambah, ubah, hapus, transaksi) disimpan otomatis dan tetap ada walau halaman dimuat ulang.

Untuk mengembalikan ke data awal, buka DevTools > Application > Local Storage, hapus semua kunci berawalan `multico:`, lalu muat ulang halaman.

Semua nama barang dan harga di data seed hanyalah contoh, bukan data toko yang sebenarnya.
