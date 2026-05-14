<template>
  <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">Dashboard</h1>
        <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
          Overview of all platform activity across Terra PH.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-primary hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Total Users</span>
          <span class="material-symbols-outlined text-primary text-xl">people</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.users.total) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ stats.users.employers }} Employers &middot; {{ stats.users.terrans }} Terrans</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-indigo-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Admins</span>
          <span class="material-symbols-outlined text-indigo-500 text-xl">admin_panel_settings</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.admins.total) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ stats.admins.active }} active &middot; {{ stats.admins.pending }} pending</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-emerald-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Vehicle Listings</span>
          <span class="material-symbols-outlined text-emerald-500 text-xl">directions_car</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.vehicleListings.total) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ stats.vehicleListings.active }} active &middot; {{ stats.vehicleListings.pending }} pending</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-amber-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Vehicle Bookings</span>
          <span class="material-symbols-outlined text-amber-500 text-xl">calendar_month</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.vehicleBookings.total) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ stats.vehicleBookings.active }} active &middot; {{ stats.vehicleBookings.pending }} pending</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-violet-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Service Bookings</span>
          <span class="material-symbols-outlined text-violet-500 text-xl">handyman</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.serviceBookings.total) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ stats.serviceBookings.onGoing }} ongoing &middot; {{ stats.serviceBookings.completed }} completed</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-rose-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Revenue</span>
          <span class="material-symbols-outlined text-rose-500 text-xl">payments</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">₱{{ formatRevenue(stats.payments.totalRevenue) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ stats.payments.paid }} paid &middot; {{ stats.payments.pending }} pending</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      <div class="bg-white rounded-xl shadow-soft p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-text-light">Monthly Revenue</h2>
          <span class="material-symbols-outlined text-text-muted-light text-lg">trending_up</span>
        </div>
        <div class="relative" style="height: 220px;">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-text-light">KYC Verification</h2>
          <span class="material-symbols-outlined text-text-muted-light text-lg">verified</span>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="text-sm text-text-light">Approved</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-text-light">{{ formatNumber(stats.kyc.approved) }}</span>
              <span class="text-xs text-text-muted-light w-12 text-right">{{ kycPercent('approved') }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full transition-all" :style="{ width: kycPercent('approved') + '%' }"></div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-amber-400"></span>
              <span class="text-sm text-text-light">Pending</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-text-light">{{ formatNumber(stats.kyc.pending) }}</span>
              <span class="text-xs text-text-muted-light w-12 text-right">{{ kycPercent('pending') }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-amber-400 h-2 rounded-full transition-all" :style="{ width: kycPercent('pending') + '%' }"></div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="text-sm text-text-light">Rejected</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-text-light">{{ formatNumber(stats.kyc.rejected) }}</span>
              <span class="text-xs text-text-muted-light w-12 text-right">{{ kycPercent('rejected') }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-red-500 h-2 rounded-full transition-all" :style="{ width: kycPercent('rejected') + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
      <div class="bg-white rounded-xl shadow-soft p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-text-light">Recent Users</h2>
          <router-link to="/user-management" class="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View All</router-link>
        </div>
        <div class="space-y-3">
          <div v-for="user in recentUsers" :key="user.id" class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <img v-if="user.photo_url" :src="user.photo_url" class="w-8 h-8 rounded-full object-cover" />
            <span v-else class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{{ initials(user) }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-light truncate">{{ user.name }} {{ user.last_name }}</p>
              <p class="text-xs text-text-muted-light truncate">{{ user.email }}</p>
            </div>
            <span class="text-xs text-text-muted-light whitespace-nowrap">{{ timeAgo(user.created_at) }}</span>
          </div>
          <div v-if="recentUsers.length === 0" class="text-center py-6 text-sm text-text-muted-light">No recent users</div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-soft p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-text-light">Recent Vehicle Bookings</h2>
          <router-link to="/vehicle-bookings" class="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View All</router-link>
        </div>
        <div class="space-y-3">
          <div v-for="booking in recentVehicleBookings" :key="booking.id" class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span class="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-amber-500 text-lg">directions_car</span>
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-light truncate">{{ booking.lessee?.name + ' ' + booking.lessee?.lastName }}</p>
              <p class="text-xs text-text-muted-light truncate">{{ booking.rental_details.info?.plateNumber }} {{ booking.rental_details.info?.model + ' ' + booking.rental_details.info?.year }}</p>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="statusClass(booking.status)">
              {{ booking.status }}
            </span>
          </div>
          <div v-if="recentVehicleBookings.length === 0" class="text-center py-6 text-sm text-text-muted-light">No recent bookings</div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-soft p-5 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-text-light">Recent Payments</h2>
          <router-link to="/workbits-payments" class="text-xs font-medium text-primary hover:text-primary/80 transition-colors">View All</router-link>
        </div>
        <div class="space-y-3">
          <div v-for="payment in recentPayments" :key="payment.id" class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <span class="material-symbols-outlined text-rose-500 text-lg">receipt</span>
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-text-light truncate">₱{{ formatRevenue(payment.paymentData?.amount) }}</p>
              <p class="text-xs text-text-muted-light truncate">{{ formatDate(payment.paymentData?.date) }}</p>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="paymentStatusClass(payment?.status)">
              {{ payment?.status || 'unknown' }}
            </span>
          </div>
          <div v-if="recentPayments.length === 0" class="text-center py-6 text-sm text-text-muted-light">No recent payments</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import VehicleListingsDataService from '@/services/VehicleListingsDataService'
import VehicleBookingsDataService from '@/services/VehicleBookingsDataService'
import ServiceBookingsDataService from '@/services/ServiceBookingsDataService'
import WorkbitsPaymentsDataService from '@/services/WorkbitsPaymentsDataService'
import { apiListAdmins } from '@/apis/admin'
import Chart from 'chart.js/auto'

export default {
  data() {
    return {
      lastUpdated: '—',
      stats: {
        users: { total: 0, employers: 0, terrans: 0 },
        admins: { total: 0, active: 0, pending: 0 },
        vehicleListings: { total: 0, active: 0, pending: 0, suspended: 0 },
        vehicleBookings: { total: 0, active: 0, pending: 0, completed: 0, cancelled: 0 },
        serviceBookings: { total: 0, onGoing: 0, completed: 0, pendingAcceptance: 0, accepted: 0, delivered: 0, cancelled: 0 },
        payments: { total: 0, totalRevenue: 0, paid: 0, pending: 0, failed: 0, expired: 0 },
        kyc: { approved: 0, pending: 0, rejected: 0 },
      },
      recentUsers: [],
      recentVehicleBookings: [],
      recentPayments: [],
      allUsers: [],
      chart: null,
    }
  },
  computed: {
    kycTotal() {
      return this.stats.kyc.approved + this.stats.kyc.pending + this.stats.kyc.rejected || 1
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return '—';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatNumber(n) {
      n = Number(n) || 0
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
      return n.toLocaleString()
    },
    formatRevenue(n) {
      n = Number(n) || 0
      return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    kycPercent(key) {
      return ((this.stats.kyc[key] / this.kycTotal) * 100).toFixed(1)
    },
    initials(user) {
      const first = (user.name || '')[0] || ''
      const last = (user.last_name || '')[0] || ''
      return (first + last).toUpperCase() || '?'
    },
    timeAgo(date) {
      if (!date) return ''
      const now = new Date()
      const d = date.toDate ? date.toDate() : new Date(date)
      const diff = Math.floor((now - d) / 1000)
      if (diff < 60) return 'just now'
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
      if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
      return d.toLocaleDateString()
    },
    statusClass(status) {
      const s = (status || '').toLowerCase()
      if (s === 'active' || s === 'completed' || s === 'paid') return 'bg-emerald-100 text-emerald-700'
      if (s === 'pending' || s === 'pendingacceptance' || s === 'pending_acceptance') return 'bg-amber-100 text-amber-700'
      if (s === 'cancelled' || s === 'failed' || s === 'expired') return 'bg-red-100 text-red-700'
      if (s === 'ongoing' || s === 'on_going' || s === 'accepted') return 'bg-blue-100 text-blue-700'
      if (s === 'delivered') return 'bg-violet-100 text-violet-700'
      return 'bg-gray-100 text-gray-700'
    },
    paymentStatusClass(status) {
      const s = (status || '').toLowerCase()
      if (s === 'paid') return 'bg-emerald-100 text-emerald-700'
      if (s === 'pending') return 'bg-amber-100 text-amber-700'
      if (s === 'failed' || s === 'expired') return 'bg-red-100 text-red-700'
      return 'bg-gray-100 text-gray-700'
    },
    updateTimestamp() {
      this.lastUpdated = new Date().toLocaleTimeString()
    },

    async fetchUserStats() {
      try {
        const coll = collection(db, 'users')
        const snapshot = await getDocs(coll)
        let total = 0, employers = 0, terrans = 0
        let approved = 0, pendingKyc = 0, rejected = 0
        const recent = []
        snapshot.forEach(doc => {
          const data = { id: doc.id, ...doc.data() }
          total++
          if (data.account_type === 2) employers++
          else if (data.account_type === 1) terrans++
          if (data.kyc_validated === 1) approved++
          else if (data.kyc_validated === 0) pendingKyc++
          else if (data.kyc_validated === -1) rejected++
          recent.push(data)
        })
        this.allUsers = recent
        this.stats.users = { total, employers, terrans }
        this.stats.kyc = { approved, pending: pendingKyc, rejected }
        recent.sort((a, b) => {
          const aTime = a.created_at?.toDate?.()?.getTime() || a.created_at || 0
          const bTime = b.created_at?.toDate?.()?.getTime() || b.created_at || 0
          return bTime - aTime
        })
        this.recentUsers = recent.slice(0, 5)
        this.updateTimestamp()
      } catch (e) {
        console.error('Error fetching user stats:', e)
      }
    },

    async fetchAdminStats() {
      try {
        const res = await apiListAdmins()
        const admins = res.data.admins || []
        this.stats.admins = {
          total: admins.length,
          active: admins.filter(a => a.status === 'active').length,
          pending: admins.filter(a => a.status === 'pending').length,
        }
        this.updateTimestamp()
      } catch (e) {
        console.error('Error fetching admin stats:', e)
      }
    },

    async fetchVehicleListingsStats() {
      const s = await VehicleListingsDataService.getStats()
      this.stats.vehicleListings = s
      this.updateTimestamp()
    },

    async fetchVehicleBookingsStats() {
      const s = await VehicleBookingsDataService.getStats()
      this.stats.vehicleBookings = s
      this.updateTimestamp()
    },

    async fetchVehicleBookingsRecent() {
      try {
        const coll = collection(db, 'vehicle-bookings')
        const q = query(coll, orderBy('createdAt', 'desc'), limit(5))
        const snap = await getDocs(q)
        this.recentVehicleBookings = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        this.updateTimestamp()
      } catch (e) {
        console.error('Error fetching recent vehicle bookings:', e)
      }
    },

    async fetchServiceBookingsStats() {
      const s = await ServiceBookingsDataService.getStats()
      this.stats.serviceBookings = s
      this.updateTimestamp()
    },

    async fetchPaymentsStats() {
      const s = await WorkbitsPaymentsDataService.getStats()
      this.stats.payments = s
      this.updateTimestamp()
    },

    async fetchRecentPayments() {
      try {
        const coll = collection(db, 'workbits-payments')
        const q = query(coll, orderBy('createdAt', 'desc'), limit(5))
        const snap = await getDocs(q)
        this.recentPayments = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        this.updateTimestamp()
      } catch (e) {
        console.error('Error fetching recent payments:', e)
      }
    },

    initChart() {
      const canvas = this.$refs.revenueChart
      if (!canvas) return
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const now = new Date()
      const currentMonth = now.getMonth()
      const labels = []
      for (let i = 5; i >= 0; i--) {
        labels.push(months[(currentMonth - i + 12) % 12])
      }

      const monthlyRevenue = Array(6).fill(0)
      this.recentPayments.forEach(p => {
        if (!p.createdAt) return
        const d = p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt)
        if (d.getFullYear() !== now.getFullYear()) return
        for (let i = 0; i < 6; i++) {
          const targetMonth = (currentMonth - 5 + i + 12) % 12
          if (d.getMonth() === targetMonth) {
            monthlyRevenue[i] += Number(p.paymentData?.amount || 0)
          }
        }
      })

      if (this.chart) this.chart.destroy()

      const ctx = canvas.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Revenue',
            data: monthlyRevenue,
            borderColor: '#137fec',
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220)
              g.addColorStop(0, 'rgba(19, 127, 236, 0.2)')
              g.addColorStop(1, 'rgba(19, 127, 236, 0)')
              return g
            },
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#137fec',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => '$' + Number(ctx.raw).toLocaleString(undefined, { minimumFractionDigits: 2 }),
              },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 10 } },
            },
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9', drawTicks: false },
              ticks: {
                color: '#94a3b8',
                font: { size: 10 },
                callback: (val) => '$' + Number(val).toLocaleString(),
              },
            },
          },
        },
      })
    },
  },
  mounted() {
    this.fetchUserStats()
    this.fetchAdminStats()
    this.fetchVehicleListingsStats()
    this.fetchVehicleBookingsStats()
    this.fetchVehicleBookingsRecent()
    this.fetchServiceBookingsStats()
    this.fetchPaymentsStats()
    this.fetchRecentPayments()
    this.$nextTick(() => {
      setTimeout(() => this.initChart(), 300)
    })
  },
  watch: {
    recentPayments: {
      handler() {
        this.$nextTick(() => this.initChart())
      },
      deep: true,
    },
  },
}
</script>
