<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">General Information</h2>
    </div>

    <div class="px-6 py-4">
      <div v-if="saved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
        Profile updated successfully.
      </div>
      <div v-if="saveError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ saveError }}
      </div>

      <form @submit.prevent="updateProfile">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="mb-4">
            <label for="firstname" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="firstname"
              v-model="form.firstname"
            />
          </div>
          <div class="mb-4">
            <label for="middlename" class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="middlename"
              v-model="form.middlename"
            />
          </div>
          <div class="mb-4">
            <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="lastname"
              v-model="form.lastname"
            />
          </div>
          <div class="mb-4">
            <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="company"
              v-model="form.company"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div class="mb-4">
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            id="address"
            v-model="form.address"
          />
        </div>

        <div class="flex items-center justify-end pt-4 border-t border-gray-200 mt-4">
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
</template>

<script>
import { state, setAdmin } from '@/stores/auth';
import { apiUpdateProfile } from '@/apis/profile';
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
        company: '',
        address: '',
        gadm_state_id: null,
        gadm_city_id: null,
      },
      states: [],
      statesLoading: false,
      cities: [],
      citiesLoading: false,
      saving: false,
      saved: false,
      saveError: null,
    };
  },
  mounted() {
    this.loadAdmin();
    this.loadStates();
  },
  methods: {
    loadAdmin() {
      const admin = state.admin;
      if (admin) {
        this.form.firstname = admin.firstname || '';
        this.form.middlename = admin.middlename || '';
        this.form.lastname = admin.lastname || '';
        this.form.company = admin.company || '';
        this.form.address = admin.address || '';
        if (admin.gadm_state_id) {
          this.form.gadm_state_id = admin.gadm_state_id;
          this.loadCities();
        }
        if (admin.gadm_city_id) {
          this.form.gadm_city_id = admin.gadm_city_id;
        }
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
    async updateProfile() {
      this.saving = true;
      this.saved = false;
      this.saveError = null;
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
      try {
        const { data } = await apiUpdateProfile(payload);
        if (data?.success && data?.admin) {
          setAdmin(data.admin);
        }
        this.saved = true;
      } catch (err) {
        this.saveError = err.response?.data?.error || 'Failed to update profile.';
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
