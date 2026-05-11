<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-text-light">News</h1>
      <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-primary text-white hover:bg-primary/90" @click="showForm = true">
        <i class="fas fa-plus" aria-hidden="true"></i>
        Add News
      </button>
    </div>

    <Toast
      :message="toastMessage"
      :type="toastType"
      :showConfirmButtons="false"
      @cancel="hideToast"
    />

    <ConfirmDialog
      :show="isConfirmDialogVisible"
      :message="confirmMessage"
      :currentId="confirmId"
      @confirm="confirmDelete"
      @close="hideConfirmDialog"
    />

    <div class="bg-white rounded-xl shadow-soft p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label for="searchQuery" class="block text-sm font-medium text-text-muted-light mb-1.5">Search News</label>
          <input
            id="searchQuery"
            type="text"
            class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none focus:ring-2 focus:ring-primary/50 outline-none"
            v-model="searchQuery"
            placeholder="Search by title or description..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-muted-light mb-1.5">Filter by Status</label>
          <MultiSelect
            :options="statusOptions"
            placeholder="Filter by status..."
            v-model="filterStatuses"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-muted-light mb-1.5">Filter by Type</label>
          <MultiSelect
            :options="typeOptions"
            placeholder="Filter by type..."
            v-model="filterTypes"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-center px-4 py-3 text-xs font-semibold text-text-muted-light uppercase tracking-wider">Image</th>
              <th @click="sort('title')" class="sortable px-4 py-3 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-left" :class="{ 'text-primary': sortKey === 'title' }">
                Title
                <i class="fas" :class="sortIcon('title')"></i>
              </th>
              <th @click="sort('description')" class="sortable px-4 py-3 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-left" :class="{ 'text-primary': sortKey === 'description' }">
                Description
                <i class="fas" :class="sortIcon('description')"></i>
              </th>
              <th @click="sort('status')" class="sortable px-4 py-3 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-left" :class="{ 'text-primary': sortKey === 'status' }">
                Status
                <i class="fas" :class="sortIcon('status')"></i>
              </th>
              <th @click="sort('type')" class="sortable px-4 py-3 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-left" :class="{ 'text-primary': sortKey === 'type' }">
                Type
                <i class="fas" :class="sortIcon('type')"></i>
              </th>
              <th class="px-4 py-3 text-xs font-semibold text-text-muted-light uppercase tracking-wider text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="news in paginatedNews" :key="news.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="text-center px-4 py-3">
                <img
                  v-if="news.image_url"
                  :src="news.image_url"
                  alt="News Image"
                  class="rounded-lg object-cover inline-block"
                  style="width: 50px; height: 50px;"
                />
                <span v-else class="text-sm text-text-muted-light">N/A</span>
              </td>
              <td class="px-4 py-3 text-sm text-text-light">{{ news.title }}</td>
              <td class="px-4 py-3 text-sm text-text-light">{{ $filters.truncate(news.description, 50) }}</td>
              <td class="px-4 py-3">
                <span :class="getStatusBadgeClass(news.status)">
                  {{ mapStatus(news.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-light">{{ news.type }}</td>
              <td class="px-4 py-3">
                <button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-gray-300 text-text-light hover:bg-gray-50 mr-2" @click="editNews(news)">Edit</button>
                <button class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-red-300 text-red-600 hover:bg-red-50" @click="deleteNews(news.id, news.image_url)">Delete</button>
              </td>
            </tr>
            <tr v-if="paginatedNews.length === 0">
              <td colspan="6" class="text-center px-4 py-8 text-sm text-text-muted-light">No news found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        :tableData="tableData"
        @setPage="setPage"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @firstPage="setPage(1)"
        @lastPage="setPage(totalPages)"
      />
    </div>

    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="cancelEdit">
      <div class="bg-white rounded-xl shadow-lifted max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-text-light">{{ editMode ? 'Edit News' : 'Add News' }}</h2>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted-light hover:bg-gray-100 transition-colors" @click="cancelEdit" :disabled="isSaving">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="saveNews">
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="title" class="block text-sm font-medium text-text-muted-light mb-1.5">Title</label>
                <input
                  id="title"
                  type="text"
                  class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none focus:ring-2 focus:ring-primary/50 outline-none"
                  v-model="currentNews.title"
                  required
                  placeholder="Enter news title"
                  :disabled="isSaving"
                />
              </div>
              <div>
                <label for="type" class="block text-sm font-medium text-text-muted-light mb-1.5">Type</label>
                <select id="type" class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none focus:ring-2 focus:ring-primary/50 outline-none" v-model="currentNews.type" required :disabled="isSaving">
                  <option value="General">General</option>
                  <option value="Event">Event</option>
                  <option value="Update">Update</option>
                </select>
              </div>
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-text-muted-light mb-1.5">Description</label>
              <textarea
                id="description"
                class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none focus:ring-2 focus:ring-primary/50 outline-none"
                v-model="currentNews.description"
                rows="4"
                placeholder="Enter news description"
                :disabled="isSaving"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="status" class="block text-sm font-medium text-text-muted-light mb-1.5">Status</label>
                <select id="status" class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none focus:ring-2 focus:ring-primary/50 outline-none" v-model.number="currentNews.status" required :disabled="isSaving">
                  <option :value="0">Draft</option>
                  <option :value="1">Published</option>
                  <option :value="2">Archived</option>
                </select>
              </div>
              <div>
                <label for="imageUploader" class="block text-sm font-medium text-text-muted-light mb-1.5">Image</label>
                <ImageUploader
                  :mainAspectRatio="16/9"
                  :photo="currentNews.image_url"
                  :dimensionText="'Recommended: 800x800px'"
                  :minHeight="'100'"
                  :maxHeight="'100'"
                  :disabled="isSaving"
                  @setPhoto="updateImage"
                />
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300 text-text-light hover:bg-gray-50" @click="cancelEdit" :disabled="isSaving">Cancel</button>
            <button type="submit" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-primary text-white hover:bg-primary/90" :disabled="isSaving">
              <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" role="status" aria-hidden="true"></span>
              <i v-if="!isSaving" class="fas fa-plus" aria-hidden="true"></i>
              {{ isSaving ? 'Saving...' : editMode ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NewsDataService from '@/services/NewsDataService';
import Pagination from '@/components/Pagination.vue';
import Toast from '@/components/Toast.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import MultiSelect from '@/components/forms/MultiSelect.vue';

export default {
  components: {
    Pagination,
    Toast,
    ConfirmDialog,
    ImageUploader,
    MultiSelect
  },
  data() {
    return {
      newsList: [],
      currentNews: {
        id: null,
        title: '',
        description: '',
        status: 0,
        type: 'General',
        image_url: ''
      },
      editMode: false,
      showForm: false,
      currentPage: 1,
      newsPerPage: 10,
      toastMessage: '',
      toastType: '',
      isConfirmDialogVisible: false,
      confirmMessage: '',
      confirmId: null,
      isSaving: false,
      sortKey: '',
      sortOrder: 'asc',
      searchQuery: '',
      filterStatuses: [],
      filterTypes: [],
      statusOptions: [
        { value: 'Draft', label: 'Draft' },
        { value: 'Published', label: 'Published' },
        { value: 'Archived', label: 'Archived' },
      ],
      typeOptions: [
        { value: 'General', label: 'General' },
        { value: 'Event', label: 'Event' },
        { value: 'Update', label: 'Update' },
      ]
    };
  },
  computed: {
    filteredNews() {
      return this.newsList.filter(news => {
        const title = news.title ? news.title.toLowerCase() : '';
        const description = news.description ? news.description.toLowerCase() : '';
        const status = this.mapStatus(news.status).toLowerCase();
        const type = news.type ? news.type.toLowerCase() : '';
        const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : '';
        const matchesText = searchQuery === '' ||
          title.includes(searchQuery) ||
          description.includes(searchQuery);
        const matchesStatus = this.filterStatuses.length === 0 || this.filterStatuses.includes(this.mapStatus(news.status));
        const matchesType = this.filterTypes.length === 0 || this.filterTypes.includes(news.type);
        return matchesText && matchesStatus && matchesType;
      });
    },
    sortedNews() {
      if (!this.sortKey) return this.filteredNews;
      const sorted = [...this.filteredNews];
      const order = this.sortOrder === 'asc' ? 1 : -1;
      return sorted.sort((a, b) => {
        let aValue = a[this.sortKey];
        let bValue = b[this.sortKey];
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        return aValue > bValue ? order : aValue < bValue ? -order : 0;
      });
    },
    paginatedNews() {
      const start = (this.currentPage - 1) * this.newsPerPage;
      const end = start + this.newsPerPage;
      return this.sortedNews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedNews.length / this.newsPerPage);
    },
    tableData() {
      const from = this.sortedNews.length === 0 ? 0 : (this.currentPage - 1) * this.newsPerPage + 1;
      const to = Math.min(from + this.paginatedNews.length - 1, this.sortedNews.length);
      return {
        from,
        to,
        totalItems: this.sortedNews.length,
      };
    }
  },
  methods: {
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
        this.currentPage = 1;
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
      }
      return 'fa-sort';
    },
    showToast(message, type) {
      if (['success', 'error'].includes(type)) {
        this.toastMessage = message;
        this.toastType = type;
      }
    },
    hideToast() {
      this.toastMessage = '';
      this.toastType = '';
    },
    showConfirmDialog(message, id) {
      this.confirmMessage = message;
      this.confirmId = id;
      this.isConfirmDialogVisible = true;
    },
    hideConfirmDialog() {
      this.isConfirmDialogVisible = false;
      this.confirmMessage = '';
      this.confirmId = null;
    },
    async confirmDelete(id) {
      if (id) {
        try {
          await NewsDataService.delete(id, this.newsList.find(n => n.id === id)?.image_url);
          this.showToast('News deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting news:', error);
          this.showToast('Failed to delete news: ' + error.message, 'error');
        }
      }
      this.hideConfirmDialog();
    },
    async fetchNews() {
      NewsDataService.getAll((news) => {
        this.newsList = news.filter(n => {
          if (!n.id) {
            console.error('Skipping news item with null ID:', n);
            return false;
          }
          return true;
        });
        if (this.newsList.length !== news.length) {
          console.warn('Filtered out', news.length - this.newsList.length, 'news items with null IDs');
        }
      });
    },
    async saveNews() {
      if (this.isSaving) return;
      this.isSaving = true;
      if (!this.currentNews.title || !this.currentNews.type) {
        this.showToast('Please fill in all required fields (Title, Type).', 'error');
        this.isSaving = false;
        return;
      }
      try {
        let imageToUpload = null;
        if (this.currentNews.image_url && this.currentNews.image_url.startsWith('data:')) {
          try {
            const response = await fetch(this.currentNews.image_url);
            if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
            const blob = await response.blob();
            imageToUpload = new File([blob], `news_image_${Date.now()}.png`, { type: 'image/png' });
          } catch (error) {
            console.error('Error converting image:', error);
            this.showToast('Failed to process image: ' + error.message, 'error');
            this.isSaving = false;
            return;
          }
        } else if (this.currentNews.image_url && !this.editMode) {
          this.currentNews.image_url = '';
        }
        if (this.editMode) {
          if (!this.currentNews.id) {
            console.error('Cannot update: Invalid document ID:', this.currentNews.id);
            this.showToast('Error: Cannot update news. No valid document ID provided.', 'error');
            this.isSaving = false;
            return;
          }
          await NewsDataService.update(this.currentNews.id, this.currentNews, imageToUpload);
          this.showToast('News updated successfully!', 'success');
        } else {
          await NewsDataService.create(this.currentNews, imageToUpload);
          this.showToast('News created successfully!', 'success');
        }
        this.showForm = false;
        this.resetForm();
      } catch (error) {
        console.error('Error saving news:', error);
        this.showToast('Failed to save news: ' + error.message, 'error');
      } finally {
        this.isSaving = false;
      }
    },
    editNews(news) {
      if (!news.id) {
        console.error('Cannot edit news: Invalid document ID:', news.id);
        this.showToast('Error: Cannot edit news. Invalid document ID.', 'error');
        return;
      }
      this.currentNews = { ...news, id: news.id };
      this.editMode = true;
      this.showForm = true;
    },
    deleteNews(id, image_url) {
      if (!id) {
        console.error('Cannot delete news: Invalid document ID:', id);
        this.showToast('Error: Cannot delete news. Invalid document ID.', 'error');
        return;
      }
      this.showConfirmDialog('Are you sure you want to delete this news?', id);
    },
    updateImage(image) {
      this.currentNews.image_url = image;
    },
    resetForm() {
      if (this.currentNews.image_url && this.currentNews.image_url.startsWith('blob:')) {
        URL.revokeObjectURL(this.currentNews.image_url);
      }
      this.currentNews = {
        id: null,
        title: '',
        description: '',
        status: 0,
        type: 'General',
        image_url: ''
      };
      this.editMode = false;
      this.isSaving = false;
      this.showForm = false;
    },
    cancelEdit() {
      this.resetForm();
    },
    mapStatus(status) {
      const statuses = {
        0: 'Draft',
        1: 'Published',
        2: 'Archived',
      };
      return statuses[status] || 'Unknown';
    },
    getStatusBadgeClass(status) {
      const classes = {
        0: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700',
        1: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700',
        2: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700',
      };
      return classes[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700';
    },
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    filterStatuses() {
      this.currentPage = 1;
    },
    filterTypes() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchNews();
  },
  beforeUnmount() {
    if (this.currentNews.image_url && this.currentNews.image_url.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentNews.image_url);
    }
  }
};
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}
.sortable:hover {
  background-color: #f8f9fa;
}
</style>
