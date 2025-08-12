<template>
  <div class="container-fluid">
    <h1 class="mb-4">News Management</h1>
    <!-- Add/Edit Form -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="card-title mb-0">{{ editMode ? 'Edit News' : 'Add News' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveNews">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="title" class="form-label">Title</label>
              <input
                id="title"
                type="text"
                class="form-control"
                v-model="currentNews.title"
                required
                placeholder="Enter news title"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="type" class="form-label">Type</label>
              <select id="type" class="form-select" v-model="currentNews.type" required>
                <option value="General">General</option>
                <option value="Event">Event</option>
                <option value="Update">Update</option>
              </select>
            </div>
            <div class="col-12 mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                id="description"
                class="form-control"
                v-model="currentNews.description"
                required
                rows="4"
                placeholder="Enter news description"
              ></textarea>
            </div>
            <div class="col-md-6 mb-3">
              <label for="status" class="form-label">Status</label>
              <select id="status" class="form-select" v-model.number="currentNews.status" required>
                <option :value="0">Draft</option>
                <option :value="1">Published</option>
                <option :value="2">Archived</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="image" class="form-label">Image</label>
              <input
                id="image"
                type="file"
                class="form-control"
                accept="image/*"
                @change="handleImageUpload"
              />
              <div v-if="currentNews.image_url" class="mt-2">
                <img :src="currentNews.image_url" alt="News Image" class="img-thumbnail" style="max-width: 100px;" />
              </div>
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-success me-2">{{ editMode ? 'Update' : 'Add' }}</button>
              <button v-if="editMode" type="button" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- News List -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">News List</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Type</th>
                <th>Image</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="news in paginatedNews" :key="news.id">
                <td>{{ news.title }}</td>
                <td>{{ $filters.truncate(news.description, 50) }}</td>
                <td>
                  <span :class="getStatusBadgeClass(news.status)">
                    {{ mapStatus(news.status) }}
                  </span>
                </td>
                <td>{{ news.type }}</td>
                <td>
                  <img
                    v-if="news.image_url"
                    :src="news.image_url"
                    alt="News Image"
                    class="img-thumbnail"
                    style="max-width: 50px;"
                  />
                  <span v-else>N/A</span>
                </td>
                <td>{{ news.created_at }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info me-2" @click="editNews(news)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteNews(news.id, news.image_url)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 1"
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
</template>

<script>
import NewsDataService from '@/services/NewsDataService';
import Pagination from '@/components/Pagination.vue';
import { ref } from 'vue';

export default {
  components: {
    Pagination,
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
      imageFile: null,
      editMode: false,
      currentPage: 1,
      newsPerPage: 10,
    };
  },
  computed: {
    paginatedNews() {
      const start = (this.currentPage - 1) * this.newsPerPage;
      const end = start + this.newsPerPage;
      return this.newsList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.newsList.length / this.newsPerPage);
    },
    tableData() {
      const from = this.newsList.length === 0 ? 0 : (this.currentPage - 1) * this.newsPerPage + 1;
      const to = Math.min(from + this.paginatedNews.length - 1, this.newsList.length);
      return {
        from,
        to,
        totalItems: this.newsList.length,
      };
    },
  },
  filters: {
    truncate(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
  },
  methods: {
    async fetchNews() {
      NewsDataService.getAll((news) => {
        this.newsList = news;
      });
    },
    async saveNews() {
      try {
        if (this.editMode) {
          await NewsDataService.update(this.currentNews.id, this.currentNews, this.imageFile);
          alert('News updated successfully!');
        } else {
          await NewsDataService.create(this.currentNews, this.imageFile);
          alert('News created successfully!');
        }
        this.resetForm();
      } catch (error) {
        console.error('Error saving news:', error);
        alert('Failed to save news');
      }
    },
    editNews(news) {
      this.currentNews = { ...news };
      this.imageFile = null;
      this.editMode = true;
    },
    async deleteNews(id, image_url) {
      if (confirm('Are you sure you want to delete this news?')) {
        try {
          await NewsDataService.delete(id, image_url);
          alert('News deleted successfully!');
        } catch (error) {
          console.error('Error deleting news:', error);
          alert('Failed to delete news');
        }
      }
    },
    handleImageUpload(event) {
      this.imageFile = event.target.files[0];
    },
    resetForm() {
      this.currentNews = {
        id: null,
        title: '',
        description: '',
        status: 0,
        type: 'General',
        image_url: ''
      };
      this.imageFile = null;
      this.editMode = false;
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
        0: 'badge bg-secondary',
        1: 'badge bg-success',
        2: 'badge bg-warning',
      };
      return classes[status] || 'badge bg-dark';
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
    },
  },
  mounted() {
    this.fetchNews();
  },
};
</script>

<style scoped>
.card-body p {
  margin-bottom: 0.5rem;
}
.card-body strong {
  font-weight: 600;
}
.badge {
  font-size: 0.8rem;
}
.table-responsive {
  margin-bottom: 1rem;
}
.img-thumbnail {
  max-width: 100px;
}
</style>