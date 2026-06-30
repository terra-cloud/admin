<template>
  <div class="space-y-6">
    <div v-if="!isSuperadmin" class="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg">
      You do not have permission to manage Firebase configurations. Only superadmins can access this page.
    </div>

    <template v-if="isSuperadmin">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-text-primary">Firebase Configurations</h2>
        <button
          class="inline-flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          @click="openCreateModal"
        >
          <i class="fas fa-plus"></i> Add Config
        </button>
      </div>

      <div v-if="saved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg">
        {{ savedMessage }}
      </div>
      <div v-if="saveError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
        {{ saveError }}
      </div>

      <div v-if="loading" class="text-center py-12">
        <p class="text-text-muted-light">Loading configurations...</p>
      </div>

      <div v-else-if="configs.length === 0" class="bg-white rounded-xl shadow-soft p-12 text-center">
        <i class="fas fa-fire text-4xl text-gray-300 mb-4"></i>
        <p class="text-text-muted-light">No Firebase configurations yet.</p>
        <p class="text-sm text-text-muted-light mt-1">Click "Add Config" to create one.</p>
      </div>

      <div v-else class="grid gap-4">
        <div
          v-for="config in configs"
          :key="config.id"
          class="bg-white rounded-xl shadow-soft overflow-hidden border-2 transition-colors"
          :class="config.is_active ? 'border-blue-500' : 'border-transparent'"
        >
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <h3 class="text-base font-semibold text-text-primary">{{ config.name }}</h3>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="envBadgeClass(config.environment)"
              >
                {{ config.environment.toUpperCase() }}
              </span>
              <span
                v-if="config.is_active"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <i class="fas fa-check-circle"></i> Active
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="!config.is_active"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                @click="activateConfig(config.id)"
              >
                <i class="fas fa-play"></i> Activate
              </button>
              <button
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-text-muted-light hover:text-text-light hover:bg-gray-100 transition-colors"
                @click="openEditModal(config)"
              >
                <i class="fas fa-pencil"></i> Edit
              </button>
              <button
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                @click="confirmDelete(config)"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div>
              <span class="text-text-muted-light">Project ID:</span>
              <span class="ml-2 text-text-primary font-mono">{{ config.project_id }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">API Key:</span>
              <span class="ml-2 text-text-primary font-mono">{{ maskKey(config.api_key) }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">Auth Domain:</span>
              <span class="ml-2 text-text-primary">{{ config.auth_domain }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">Storage Bucket:</span>
              <span class="ml-2 text-text-primary">{{ config.storage_bucket }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">App ID:</span>
              <span class="ml-2 text-text-primary font-mono">{{ maskKey(config.app_id) }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">DB URL:</span>
              <span class="ml-2 text-text-primary">{{ config.db_url || '—' }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <ConfirmDialog
      :show="showDeleteModal"
      :currentId="selectedDeleteId"
      :message="'Are you sure you want to delete this Firebase configuration? This action cannot be undone.'"
      @confirm="deleteConfig"
      @close="closeDeleteModal"
    />

    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text-primary">
            {{ editingId ? 'Edit' : 'Add' }} Firebase Configuration
          </h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeFormModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="saveConfig">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.name"
                  required
                  placeholder="e.g. Production"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Environment *</label>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  v-model="form.environment"
                  required
                >
                  <option value="dev">Development</option>
                  <option value="uat">UAT</option>
                  <option value="prod">Production</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">API Key *</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.api_key"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Auth Domain *</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.auth_domain"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Database URL</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.db_url"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Project ID *</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.project_id"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Storage Bucket *</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.storage_bucket"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Messaging Sender ID</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.sender_id"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">App ID *</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.app_id"
                  required
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Measurement ID</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  v-model="form.measurement_id"
                />
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                @click="closeFormModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                :disabled="saving"
              >
                {{ saving ? 'Saving...' : (editingId ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { state } from '@/stores/auth';
import {
  apiListFirebaseConfigs,
  apiCreateFirebaseConfig,
  apiUpdateFirebaseConfig,
  apiDeleteFirebaseConfig,
  apiSetActiveFirebaseConfig,
} from '@/apis/firebaseConfig';
import { reinitializeFirebase } from '@/firebase';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

export default {
  components: { ConfirmDialog },
  data() {
    return {
      configs: [],
      loading: true,
      saving: false,
      saved: false,
      savedMessage: '',
      saveError: null,
      showFormModal: false,
      editingId: null,
      form: {
        name: '',
        environment: 'dev',
        api_key: '',
        auth_domain: '',
        db_url: '',
        project_id: '',
        storage_bucket: '',
        sender_id: '',
        app_id: '',
        measurement_id: '',
      },
      showDeleteModal: false,
      selectedDeleteId: null,
    };
  },
  computed: {
    isSuperadmin() {
      return state.admin?.type === 'superadmin';
    },
  },
  mounted() {
    if (this.isSuperadmin) {
      this.fetchConfigs();
    } else {
      this.loading = false;
    }
  },
  methods: {
    async fetchConfigs() {
      this.loading = true;
      try {
        const { data } = await apiListFirebaseConfigs();
        if (data?.success && data?.configs) {
          this.configs = data.configs;
        }
      } catch {
        this.saveError = 'Failed to load configurations.';
      } finally {
        this.loading = false;
      }
    },
    maskKey(key) {
      if (!key) return '';
      if (key.length <= 8) return '***';
      return key.slice(0, 4) + '...' + key.slice(-4);
    },
    envBadgeClass(env) {
      const map = {
        prod: 'bg-green-100 text-green-800',
        uat: 'bg-yellow-100 text-yellow-800',
        dev: 'bg-gray-100 text-gray-800',
      };
      return map[env] || 'bg-gray-100 text-gray-800';
    },
    openCreateModal() {
      this.editingId = null;
      this.form = {
        name: '',
        environment: 'dev',
        api_key: '',
        auth_domain: '',
        db_url: '',
        project_id: '',
        storage_bucket: '',
        sender_id: '',
        app_id: '',
        measurement_id: '',
      };
      this.showFormModal = true;
    },
    openEditModal(config) {
      this.editingId = config.id;
      this.form = {
        name: config.name,
        environment: config.environment,
        api_key: config.api_key,
        auth_domain: config.auth_domain,
        db_url: config.db_url || '',
        project_id: config.project_id,
        storage_bucket: config.storage_bucket,
        sender_id: config.sender_id || '',
        app_id: config.app_id,
        measurement_id: config.measurement_id || '',
      };
      this.showFormModal = true;
    },
    closeFormModal() {
      this.showFormModal = false;
      this.editingId = null;
    },
    async saveConfig() {
      this.saving = true;
      this.saved = false;
      this.saveError = null;
      try {
        const payload = {
          ...this.form,
          db_url: this.form.db_url || null,
          sender_id: this.form.sender_id || null,
          measurement_id: this.form.measurement_id || null,
        };
        if (this.editingId) {
          await apiUpdateFirebaseConfig(this.editingId, payload);
          this.savedMessage = 'Configuration updated successfully.';
        } else {
          await apiCreateFirebaseConfig(payload);
          this.savedMessage = 'Configuration created successfully.';
        }
        this.saved = true;
        this.closeFormModal();
        await this.fetchConfigs();
      } catch (err) {
        this.saveError = err.response?.data?.error || 'Failed to save configuration.';
      } finally {
        this.saving = false;
      }
    },
    async activateConfig(id) {
      this.saving = true;
      this.saveError = null;
      try {
        const { data } = await apiSetActiveFirebaseConfig(id);
        if (data?.success && data?.config) {
          await reinitializeFirebase(data.config);
          this.savedMessage = 'Configuration activated and applied in real-time.';
          this.saved = true;
        }
        await this.fetchConfigs();
      } catch (err) {
        this.saveError = err.response?.data?.error || 'Failed to activate configuration.';
      } finally {
        this.saving = false;
      }
    },
    confirmDelete(config) {
      this.selectedDeleteId = config.id;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedDeleteId = null;
    },
    async deleteConfig(configId) {
      try {
        await apiDeleteFirebaseConfig(configId);
        this.closeDeleteModal();
        this.savedMessage = 'Configuration deleted successfully.';
        this.saved = true;
        await this.fetchConfigs();
      } catch (error) {
        this.saveError = error.response?.data?.error || 'Failed to delete configuration.';
      }
    },
  },
};
</script>
