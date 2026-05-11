<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <div class="py-6">
      <router-link to="/admins" class="inline-flex items-center gap-2 text-text-muted-light hover:text-text-light mb-6">
        <i class="fas fa-arrow-left"></i> Back to Admins
      </router-link>

      <div v-if="loading" class="text-center py-12">
        <p class="text-text-muted-light">Loading admin...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <div v-else class="bg-white rounded-xl shadow-soft overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-text-primary">Edit Admin</h2>
        </div>

        <div class="px-6 py-4">
          <div v-if="saved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
            Admin updated successfully.
          </div>
          <div v-if="saveError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
            {{ saveError }}
          </div>

          <form @submit.prevent="saveAdmin">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="mb-4">
                <label for="editFirstname" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editFirstname"
                  v-model="form.firstname"
                />
              </div>
              <div class="mb-4">
                <label for="editMiddlename" class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editMiddlename"
                  v-model="form.middlename"
                />
              </div>
              <div class="mb-4">
                <label for="editLastname" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editLastname"
                  v-model="form.lastname"
                />
              </div>
              <div class="mb-4">
                <label for="editEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editEmail"
                  v-model="form.email"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="editCompany" class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editCompany"
                  v-model="form.company"
                />
              </div>
              <div class="mb-4">
                <label for="editType" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  id="editType"
                  v-model="form.type"
                  required
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="partner">Partner</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="editStatus" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  id="editStatus"
                  v-model="form.status"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                <SearchableSelect
                  :options="states"
                  :model-value="form.gadm_state_id"
                  icon="map"
                  placeholder="Search state..."
                  :loading="statesLoading"
                  @change="onStateChange"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">City / Municipality</label>
                <SearchableSelect
                  :options="cities"
                  :model-value="form.gadm_city_id"
                  icon="location_city"
                  placeholder="Search city..."
                  :loading="citiesLoading"
                  :disabled="!form.gadm_state_id"
                  @search="onCitySearch"
                  @change="onCityChange"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div class="mb-4">
                <label for="editAddress" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editAddress"
                  v-model="form.address"
                />
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
              <router-link
                to="/admins"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </router-link>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : 'Save changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiListAdmins, apiUpdateAdmin } from '@/apis/admin';
import { apiGetStates, apiGetCities } from '@/apis/gadm';
import SearchableSelect from '@/components/forms/SearchableSelect.vue';

export default {
  components: { SearchableSelect },
  data() {
    return {
      form: {
        firstname: '',
        middlename: '',
        lastname: '',
        email: '',
        company: '',
        type: 'partner',
        status: 'pending',
        address: '',
        gadm_state_id: null,
        gadm_city_id: null,
      },
      originalStateName: '',
      originalCityName: '',
      pendingStateId: null,
      pendingCityId: null,
      states: [],
      statesLoading: false,
      cities: [],
      citiesLoading: false,
      loading: true,
      saving: false,
      error: null,
      saved: false,
      saveError: null,
    };
  },
  async mounted() {
    await this.fetchAdmin();
  },
  methods: {
    async fetchAdmin() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apiListAdmins();
        if (data?.success && data?.admins) {
          const admin = data.admins.find(a => a.id === this.$route.params.id);
          if (!admin) {
            this.error = 'Admin not found.';
            return;
          }
          this.form = {
            firstname: admin.firstname || '',
            middlename: admin.middlename || '',
            lastname: admin.lastname || '',
            email: admin.email || '',
            company: admin.company || '',
            type: admin.type || 'partner',
            status: admin.status || 'pending',
            address: admin.address || '',
            gadm_state_id: null,
            gadm_city_id: null,
          };
          this.originalStateName = admin.state || '';
          this.originalCityName = admin.city || '';
          this.pendingStateId = admin.gadm_state_id || null;
          this.pendingCityId = admin.gadm_city_id || null;
          await this.loadStates();
        } else {
          this.error = 'Failed to load admin data.';
        }
      } catch (err) {
        this.error = 'Failed to load admin.';
      } finally {
        this.loading = false;
      }
    },
    async loadStates() {
      this.statesLoading = true;
      try {
        const { data } = await apiGetStates();
        this.states = (data.data || []).map(s => ({
          id: s.id,
          name: s.display_name || s.name,
        }));

        let stateId = this.pendingStateId;
        if (!stateId && this.originalStateName) {
          const match = this.states.find(s => s.name.toLowerCase() === this.originalStateName.toLowerCase());
          if (match) stateId = match.id;
        }

        if (stateId) {
          this.form.gadm_state_id = stateId;
          await this.loadCities();
        }
      } catch {
        // silently fail
      } finally {
        this.statesLoading = false;
      }
    },
    async loadCities(keyword) {
      if (!this.form.gadm_state_id) return;
      this.citiesLoading = true;
      try {
        const params = { map_state_id: this.form.gadm_state_id, keyword: keyword || '' };
        const { data } = await apiGetCities(params);
        this.cities = (data.data || []).map(c => ({
          id: c.id,
          name: c.display_name || c.name,
        }));

        let cityId = this.pendingCityId;
        if (!cityId && !keyword && this.originalCityName) {
          const match = this.cities.find(c => c.name.toLowerCase() === this.originalCityName.toLowerCase());
          if (match) cityId = match.id;
        }

        if (cityId) {
          this.form.gadm_city_id = cityId;
        }
      } catch {
        // silently fail
      } finally {
        this.citiesLoading = false;
      }
    },
    onStateChange(opt) {
      this.form.gadm_state_id = opt ? opt.id : null;
      this.form.gadm_city_id = null;
      this.cities = [];
      if (this.form.gadm_state_id) {
        this.loadCities();
      }
    },
    onCitySearch(keyword) {
      if (this.form.gadm_state_id && keyword) {
        this.loadCities(keyword);
      }
    },
    onCityChange(opt) {
      this.form.gadm_city_id = opt ? opt.id : null;
    },
    async saveAdmin() {
      this.saving = true;
      this.saved = false;
      this.saveError = null;
      try {
        const payload = { ...this.form };
        if (this.form.gadm_state_id) {
          const state = this.states.find(s => s.id === this.form.gadm_state_id);
          payload.state = state ? state.name : null;
        } else {
          payload.state = null;
        }
        if (this.form.gadm_city_id) {
          const city = this.cities.find(c => c.id === this.form.gadm_city_id);
          payload.city = city ? city.name : null;
        } else {
          payload.city = null;
        }
        await apiUpdateAdmin(this.$route.params.id, payload);
        this.saved = true;
      } catch (err) {
        this.saveError = err.response?.data?.error || 'Failed to update admin.';
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
