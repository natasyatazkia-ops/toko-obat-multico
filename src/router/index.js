import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MainLayout from '../layouts/MainLayout.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import StockInView from '../views/StockInView.vue'
import TransactionView from '../views/TransactionView.vue'
import ReportView from '../views/ReportView.vue'

const SEMUA = ['Pengelola', 'Petugas Toko']

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'beranda' } },
      { path: 'beranda', name: 'beranda', component: DashboardView, meta: { title: 'Beranda', roles: SEMUA } },
      { path: 'barang', name: 'barang', component: ProductsView, meta: { title: 'Data Barang', roles: SEMUA } },
      { path: 'barang-masuk', name: 'barang-masuk', component: StockInView, meta: { title: 'Barang Masuk', roles: SEMUA } },
      { path: 'transaksi', name: 'transaksi', component: TransactionView, meta: { title: 'Transaksi', roles: SEMUA } },
      { path: 'laporan', name: 'laporan', component: ReportView, meta: { title: 'Laporan', roles: ['Pengelola'] } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Penjaga halaman: cek login dan cek role
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'beranda' }
  }
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    auth.setNotice('Anda tidak punya akses ke halaman itu')
    return { name: 'beranda' }
  }
})

export default router
