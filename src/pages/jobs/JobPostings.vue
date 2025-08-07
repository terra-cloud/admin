<template>
  <div class="container-fluid">
    <h1 class="mb-4">Job Postings</h1>
    <!-- Summary -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="card-title mb-0">Job Postings Summary</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-12">
            <p><strong>Total Job Postings:</strong> {{ jobs.length }}</p>
            <p><strong>Status Breakdown:</strong></p>
            <div>
              <span class="badge bg-primary me-2">Open: {{ jobStatusCounts.Open }}</span>
              <span class="badge bg-info me-2">In Progress: {{ jobStatusCounts['In Progress'] }}</span>
              <span class="badge bg-success me-2">Completed: {{ jobStatusCounts.Completed }}</span>
              <span class="badge bg-warning me-2">Cancelled: {{ jobStatusCounts.Cancelled }}</span>
              <span class="badge bg-danger me-2">Dropped: {{ jobStatusCounts.Dropped }}</span>
              <span class="badge bg-secondary">Unknown: {{ jobStatusCounts.Unknown }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Filters -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <label for="searchQuery" class="form-label">Search</label>
        <input
          id="searchQuery"
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search by posted by, email, title, details, or keywords..."
        />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Budget Range (₱)</label>
        <div class="input-group">
          <input
            type="number"
            class="form-control"
            v-model.number="budgetMin"
            placeholder="Min"
            min="0"
          />
          <span class="input-group-text">to</span>
          <input
            type="number"
            class="form-control"
            v-model.number="budgetMax"
            placeholder="Max"
            min="0"
          />
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <label for="workStyle" class="form-label">Work Style</label>
        <select id="workStyle" class="form-select" multiple v-model="filterWorkStyles">
          <option value="All">All</option>
          <option value="Full time">Full time</option>
          <option value="Contract">Contract</option>
          <option value="Part time">Part time</option>
        </select>
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Created Date Range</label>
        <div class="input-group">
          <input
            type="date"
            class="form-control"
            v-model="startDate"
            placeholder="Start Date"
          />
          <span class="input-group-text">to</span>
          <input
            type="date"
            class="form-control"
            v-model="endDate"
            placeholder="End Date"
          />
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <label for="jobStatus" class="form-label">Job Status</label>
        <select id="jobStatus" class="form-select" multiple v-model="filterJobStatuses">
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Dropped">Dropped</option>
        </select>
      </div>
      <div class="col-md-4 mb-3">
        <label for="locationType" class="form-label">Location Type</label>
        <select id="locationType" class="form-select" multiple v-model="filterLocationTypes">
          <option value="All">All</option>
          <option value="In person">In person</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
    </div>
    <!-- Job Postings -->
    <div class="row mb-4">
      <div v-for="job in paginatedJobs" :key="job.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">{{ job.title || 'N/A' }}</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <p><strong>Posted By:</strong> {{ job?.author?.display_name || 'N/A' }}</p>
                <p><strong>Email:</strong> {{ job?.author?.email || 'N/A' }}</p>
                <p><strong>Created At:</strong> {{ formatDate(job.created_at) }}</p>
                <p><strong>Budget:</strong> ₱{{ job.budget?.budget || 'N/A' }} <span v-if="job.budget?.is_negotiable">(Negotiable)</span></p>
                <p><strong>Details:</strong> {{ job.details?.details || 'N/A' }}</p>
                <p><strong>Work Style:</strong> {{ mapWorkStyle(job.details?.work_style) }}</p>
                <p><strong>Schedule:</strong> {{ formatDate(job.schedule?.date) }} ({{ job.schedule?.dateType || 'N/A' }}, {{ mapTimePreferences(job.schedule?.timePreferences) }})</p>
                <p><strong>Job Status:</strong> {{ mapJobStatus(job.job_status) }}</p>
                <p><strong>Location:</strong> {{ job.location?.stringified_address || 'N/A' }} ({{ mapLocationType(job.location?.type) }})</p>
                <p><strong>Search Keywords:</strong>
                  <span v-if="job.search_keywords && job.search_keywords.length">
                    <span v-for="(keyword, index) in job.search_keywords" :key="index" class="badge bg-primary me-1">{{ keyword }}</span>
                  </span>
                  <span v-else>N/A</span>
                </p>
                <div class="mt-2">
                  <router-link :to="'/jobs/' + job.id" class="btn btn-sm btn-outline-info me-2">View Full Details</router-link>
                  <button
                    v-if="job.job_status === 0 || job.job_status === 1"
                    class="btn btn-sm btn-outline-danger"
                    @click="showDropDialog(job.id, job.title)"
                  >
                    Drop
                  </button>
                </div>
                <DropJobModal
                  v-if="showDialog && selectedJobId === job.id"
                  :job-id="job.id"
                  :job-title="job.title"
                  @confirm="confirmDrop"
                  @close="cancelDrop"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Pagination -->
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
</template>

<script>
import { db } from '@/firebase';
import { collection, query, orderBy, limit, startAfter, onSnapshot, getCountFromServer, doc, setDoc } from 'firebase/firestore';
import Pagination from '@/components/Pagination.vue';
import DropJobModal from './components/DropJobModal.vue';

export default {
  components: {
    Pagination,
    DropJobModal,
  },
  data() {
    return {
      jobs: [],
      currentPage: 1,
      jobsPerPage: 20,
      totalJobs: 0,
      lastVisible: null,
      searchQuery: '',
      budgetMin: null,
      budgetMax: null,
      filterWorkStyles: [],
      startDate: null,
      endDate: null,
      filterJobStatuses: [],
      filterLocationTypes: [],
      statusSet: [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Rejected' },
      ],
      showDialog: false,
      selectedJobId: null,
      selectedJobTitle: '',
    };
  },
  computed: {
    jobStatusCounts() {
      const counts = {
        Open: 0,
        'In Progress': 0,
        Completed: 0,
        Cancelled: 0,
        Dropped: 0,
        Unknown: 0,
      };
      this.jobs.forEach(job => {
        const status = this.mapJobStatus(job.job_status);
        counts[status] = (counts[status] || 0) + 1;
      });
      return counts;
    },
    filteredJobs() {
      return this.jobs.filter(job => {
        const searchQuery = this.searchQuery.toLowerCase();
        const displayName = job.author?.display_name?.toLowerCase() || '';
        const email = job.author?.email?.toLowerCase() || '';
        const title = job.job_request?.title?.toLowerCase() || '';
        const details = job.details?.details?.toLowerCase() || '';
        const keywords = job.search_keywords?.join(' ').toLowerCase() || '';
        const matchesSearch = !this.searchQuery ||
          displayName.includes(searchQuery) ||
          email.includes(searchQuery) ||
          title.includes(searchQuery) ||
          details.includes(searchQuery) ||
          keywords.includes(searchQuery);

        const budget = job.budget?.budget || 0;
        const matchesBudget = (!this.budgetMin || budget >= this.budgetMin) &&
                             (!this.budgetMax || budget <= this.budgetMax);

        const workStyle = this.mapWorkStyle(job.details?.work_style);
        const effectiveWorkStyles = this.filterWorkStyles.includes('All') ? ['Full time', 'Contract', 'Part time'] : this.filterWorkStyles;
        const matchesWorkStyle = !this.filterWorkStyles.length || effectiveWorkStyles.includes(workStyle);

        const jobDate = job.created_at ? new Date(job.created_at).toISOString().split('T')[0] : null;
        const startDate = this.startDate || null;
        const endDate = this.endDate ? new Date(new Date(this.endDate).setDate(new Date(this.endDate).getDate() + 1)).toISOString().split('T')[0] : null;
        const matchesDate = (!startDate || !jobDate || jobDate >= startDate) &&
                           (!endDate || !jobDate || jobDate < endDate);

        const jobStatus = this.mapJobStatus(job.job_status);
        const effectiveJobStatuses = this.filterJobStatuses.includes('All') ? ['Open', 'In Progress', 'Completed', 'Cancelled', 'Dropped'] : this.filterJobStatuses;
        const matchesJobStatus = !this.filterJobStatuses.length || effectiveJobStatuses.includes(jobStatus);

        const locationType = this.mapLocationType(job.location?.type);
        const effectiveLocationTypes = this.filterLocationTypes.includes('All') ? ['Unknown', 'In person', 'Remote'] : this.filterLocationTypes;
        const matchesLocationType = !this.filterLocationTypes.length || effectiveLocationTypes.includes(locationType);

        return matchesSearch && matchesBudget && matchesWorkStyle && matchesDate && matchesJobStatus && matchesLocationType;
      });
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      const end = start + this.jobsPerPage;
      return this.filteredJobs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.jobsPerPage);
    },
    tableData() {
      const from = this.filteredJobs.length === 0 ? 0 : (this.currentPage - 1) * this.jobsPerPage + 1;
      const to = Math.min(from + this.paginatedJobs.length - 1, this.filteredJobs.length);
      return {
        from,
        to,
        totalItems: this.filteredJobs.length,
      };
    },
  },
  methods: {
    async fetchJobs() {
      const jobsQuery = query(
        collection(db, 'job-posting'),
        orderBy('created_at', 'desc')
      );
      onSnapshot(jobsQuery, (snapshot) => {
        this.jobs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          schedule: doc.data().job_request?.schedule || {},
          title: doc.data().job_request?.title || 'N/A',
          job_status: doc.data().job_status || 0,
        }));
        this.lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      }, (error) => {
        console.error('Error fetching jobs:', error);
        alert('Failed to load job postings');
      });
    },
    async fetchTotalJobs() {
      const coll = collection(db, 'job-posting');
      const snapshot = await getCountFromServer(coll);
      this.totalJobs = snapshot.data().count;
    },
    showDropDialog(jobId, jobTitle) {
      this.selectedJobId = jobId;
      this.selectedJobTitle = jobTitle;
      this.showDialog = true;
    },
    async confirmDrop(jobId) {
      try {
        const jobRef = doc(db, 'job-posting', jobId);
        await setDoc(jobRef, { job_status: 4 }, { merge: true });
        console.log(`Job ${jobId} dropped (status set to Dropped)`);
        this.showDialog = false;
        this.selectedJobId = null;
        this.selectedJobTitle = '';
      } catch (error) {
        console.error('Error dropping job:', error);
        alert('Failed to drop job posting');
      }
    },
    cancelDrop() {
      this.showDialog = false;
      this.selectedJobId = null;
      this.selectedJobTitle = '';
    },
    mapAccountType(accountType) {
      const types = {
        1: 'User',
        2: 'Employer',
      };
      return types[accountType] || 'Unknown';
    },
    displayStatus(status) {
      const index = this.statusSet.findIndex(item => item.value === status);
      return index !== -1 ? this.statusSet[index].message : 'Unknown';
    },
    mapWorkStyle(workStyle) {
      const styles = {
        1: 'Full time',
        2: 'Contract',
        3: 'Part time',
      };
      return styles[workStyle] || 'Unknown';
    },
    mapJobStatus(status) {
      const statuses = {
        0: 'Open',
        1: 'In Progress',
        2: 'Completed',
        3: 'Cancelled',
        4: 'Dropped',
      };
      return statuses[status] || 'Unknown';
    },
    mapLocationType(type) {
      const types = {
        0: 'Unknown',
        1: 'In person',
        2: 'Remote',
      };
      return types[type] || 'Unknown';
    },
    mapTimePreferences(pref) {
      const prefs = {
        '0': 'Any Time',
        '1': 'Morning',
        '2': 'Afternoon',
        '3': 'Evening',
      };
      return prefs[pref] || 'Unknown';
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    resetPagination() {
      this.currentPage = 1;
      this.lastVisible = null;
    },
  },
  watch: {
    searchQuery() {
      this.resetPagination();
    },
    budgetMin() {
      this.resetPagination();
    },
    budgetMax() {
      this.resetPagination();
    },
    filterWorkStyles() {
      this.resetPagination();
    },
    startDate() {
      this.resetPagination();
    },
    endDate() {
      this.resetPagination();
    },
    filterJobStatuses() {
      this.resetPagination();
    },
    filterLocationTypes() {
      this.resetPagination();
    },
  },
  mounted() {
    this.fetchTotalJobs();
    this.fetchJobs();
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
.card.h-100 {
  display: flex;
  flex-direction: column;
}
.form-select[multiple] {
  height: 100px;
}
.btn-sm.me-2 {
  margin-right: 0.5rem;
}
</style>