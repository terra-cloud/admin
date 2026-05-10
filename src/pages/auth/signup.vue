<template>
  <div class="auth-bg relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col justify-center w-full max-w-md">
      <div class="flex flex-col items-center justify-center p-6 md:p-10 bg-card-light dark:bg-card-dark rounded-xl shadow-lifted">
        <div class="flex flex-col items-center gap-4 mb-8">
          <svg class="text-primary" fill="none" height="48" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <div class="flex flex-col items-center gap-2 text-center">
            <p class="text-text-light dark:text-text-dark text-3xl font-bold tracking-tight">Create Account</p>
            <p class="text-text-muted-light dark:text-text-muted-dark text-base font-normal">Join Terra PH Admin today.</p>
          </div>
        </div>

        <div v-if="error" class="w-full mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">{{ error }}</div>
        <div v-if="success" class="w-full mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">{{ success }}</div>

        <div class="w-full flex flex-col gap-6">
          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Account Type <span class="text-primary">*</span></p>
            <div class="flex gap-3">
              <button type="button" @click="adminType = 'partner'" :class="['flex-1 flex items-center justify-center gap-2 rounded-lg h-14 text-base font-medium transition-all duration-200 border-2', adminType === 'partner' ? 'bg-primary/10 text-primary border-primary' : 'bg-input-light dark:bg-input-dark text-text-muted-light dark:text-text-muted-dark border-transparent hover:border-gray-300 dark:hover:border-gray-600']">
                <span class="material-symbols-outlined">business</span> Partner
              </button>
              <button type="button" @click="adminType = 'staff'" :class="['flex-1 flex items-center justify-center gap-2 rounded-lg h-14 text-base font-medium transition-all duration-200 border-2', adminType === 'staff' ? 'bg-primary/10 text-primary border-primary' : 'bg-input-light dark:bg-input-dark text-text-muted-light dark:text-text-muted-dark border-transparent hover:border-gray-300 dark:hover:border-gray-600']">
                <span class="material-symbols-outlined">badge</span> Staff
              </button>
            </div>
          </label>

          <div class="flex gap-4">
            <label class="flex flex-1 flex-col gap-2">
              <p class="text-text-light dark:text-text-dark text-sm font-medium">First Name <span class="text-primary">*</span></p>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">badge</span>
                <input v-model="firstname" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-4 text-base font-normal shadow-soft" placeholder="First name"/>
              </div>
            </label>
            <label class="flex flex-1 flex-col gap-2">
              <p class="text-text-light dark:text-text-dark text-sm font-medium">Last Name <span class="text-primary">*</span></p>
              <div class="relative flex items-center">
                <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">badge</span>
                <input v-model="lastname" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-4 text-base font-normal shadow-soft" placeholder="Last name"/>
              </div>
            </label>
          </div>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Email <span class="text-primary">*</span></p>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">email</span>
              <input v-model="email" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-4 text-base font-normal shadow-soft" placeholder="Enter your email"/>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Password</p>
            <div class="relative flex w-full items-center rounded-lg">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">lock</span>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-12 text-base font-normal shadow-soft" placeholder="Enter your password"/>
              <button type="button" aria-label="Toggle password visibility" class="absolute right-4 text-text-muted-light dark:text-text-muted-dark cursor-pointer" @click="showPassword = !showPassword">
                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">Confirm Password</p>
            <div class="relative flex w-full items-center rounded-lg">
              <span class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark">lock</span>
              <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark pl-12 pr-12 text-base font-normal shadow-soft" placeholder="Confirm your password"/>
              <button type="button" aria-label="Toggle password visibility" class="absolute right-4 text-text-muted-light dark:text-text-muted-dark cursor-pointer" @click="showConfirmPassword = !showConfirmPassword">
                <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </label>

          <template v-if="adminType === 'staff'">
            <label class="flex flex-col gap-2">
              <p class="text-text-light dark:text-text-dark text-sm font-medium">Partner / Employer <span class="text-primary">*</span></p>
              <SearchableSelect
                :options="partners"
                icon="business"
                placeholder="Search partner..."
                :loading="partnersLoading"
                @change="onPartnerChange"
              />
            </label>
          </template>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">State / Province</p>
            <SearchableSelect
              :options="states"
              icon="map"
              placeholder="Search state..."
              :loading="statesLoading"
              @change="onStateChange"
            />
          </label>

          <label class="flex flex-col gap-2">
            <p class="text-text-light dark:text-text-dark text-sm font-medium">City / Municipality</p>
            <SearchableSelect
              :options="cities"
              icon="location_city"
              placeholder="Search city..."
              :loading="citiesLoading"
              :disabled="!selectedStateId"
              @search="onCitySearch"
              @change="onCityChange"
            />
          </label>
        </div>

        <div class="w-full mt-8 flex flex-col gap-4">
          <button @click="signup" :disabled="loading" class="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold tracking-wide shadow-soft hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200">
            <span v-if="loading" class="truncate">Creating account...</span>
            <span v-else class="truncate">Sign Up</span>
          </button>
          <p class="text-text-muted-light dark:text-text-muted-dark text-sm text-center">
            Already have an account?
            <router-link class="font-medium text-primary hover:underline" to="/login">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiRegister, apiListPartners } from '@/apis/auth'
import { apiGetStates, apiGetCities } from '@/apis/gadm'
import { setAccessToken, setAdmin } from '@/stores/auth'

export default {
  name: 'Signup',
  data() {
    return {
      adminType: 'partner',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      error: '',
      success: '',
      loading: false,
      partners: [],
      partnersLoading: false,
      selectedPartnerId: null,
      states: [],
      statesLoading: false,
      selectedStateId: null,
      selectedStateName: '',
      cities: [],
      citiesLoading: false,
      selectedCityId: null,
      selectedCityName: '',
      citySearchKeyword: '',
    };
  },
  watch: {
    adminType(val) {
      if (val === 'staff' && this.partners.length === 0) {
        this.fetchPartners();
      }
    },
  },
  mounted() {
    this.fetchPartners();
    this.fetchStates();
  },
  methods: {
    async fetchPartners() {
      this.partnersLoading = true;
      try {
        const { data } = await apiListPartners();
        this.partners = (data.partners || []).map(p => ({
          id: p.id,
          name: [p.firstname, p.lastname].filter(Boolean).join(' ') || p.email,
        }));
      } catch {
        // silently fail
      } finally {
        this.partnersLoading = false;
      }
    },
    async fetchStates() {
      this.statesLoading = true;
      try {
        const { data } = await apiGetStates();
        this.states = (data.data || []).map(s => ({
          id: s.id,
          name: s.display_name || s.name,
        }));
      } catch {
        // silently fail
      } finally {
        this.statesLoading = false;
      }
    },
    async fetchCities(keyword) {
      if (!this.selectedStateId) return;
      this.citiesLoading = true;
      try {
        const { data } = await apiGetCities({ map_state_id: this.selectedStateId, keyword: keyword || '' });
        this.cities = (data.data || []).map(c => ({
          id: c.id,
          name: c.display_name || c.name,
        }));
      } catch {
        // silently fail
      } finally {
        this.citiesLoading = false;
      }
    },
    onPartnerChange(opt) {
      this.selectedPartnerId = opt ? opt.id : null;
    },
    onStateChange(opt) {
      this.selectedStateId = opt ? opt.id : null;
      this.selectedStateName = opt ? opt.name : '';
      this.selectedCityId = null;
      this.selectedCityName = '';
      this.cities = [];
      if (this.selectedStateId) {
        this.fetchCities();
      }
    },
    onCitySearch(keyword) {
      this.citySearchKeyword = keyword;
      if (this.selectedStateId && keyword) {
        this.fetchCities(keyword);
      }
    },
    onCityChange(opt) {
      this.selectedCityId = opt ? opt.id : null;
      this.selectedCityName = opt ? opt.name : '';
    },
    async signup() {
      this.error = '';
      this.success = '';

      if (!this.firstname || !this.lastname || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'All fields are required';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      if (this.adminType === 'staff' && !this.selectedPartnerId) {
        this.error = 'Please select a partner';
        return;
      }

      this.loading = true;

      try {
        const response = await apiRegister({
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          type: this.adminType,
          employer_id: this.adminType === 'staff' ? this.selectedPartnerId : null,
          state: this.selectedStateName || null,
          city: this.selectedCityName || null,
        });
        if (response.data?.access_token) {
          setAccessToken(response.data.access_token)
          setAdmin(response.data.admin)
          this.$router.push({name: 'dashboard'})
        } else {
          this.success = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 3000)
        }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Registration failed';
      } finally {
        this.loading = false
      }
    },
  },
};
</script>
