<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Job Postings</h1>
    <!-- Summary -->
    <div class="bg-white rounded-xl shadow-soft p-6">
      <h2 class="text-lg font-semibold mb-4">Job Postings Summary</h2>
      <p class="mb-2"><strong>Total Job Postings:</strong> {{ jobs.length }}</p>
      <p class="mb-2"><strong>Status Breakdown:</strong></p>
      <div class="flex flex-wrap gap-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Open: {{ jobStatusCounts.Open }}</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">In Progress: {{ jobStatusCounts['In Progress'] }}</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed: {{ jobStatusCounts.Completed }}</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Cancelled: {{ jobStatusCounts.Cancelled }}</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Dropped: {{ jobStatusCounts.Dropped }}</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown: {{ jobStatusCounts.Unknown }}</span>
      </div>
    </div>
    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          id="searchQuery"
          type="text"
          class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
          v-model="searchQuery"
          placeholder="Search by posted by, email, title, details, or keywords..."
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Budget Range (₱)</label>
        <div class="flex items-center gap-2">
          <input
            type="number"
            class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
            v-model.number="budgetMin"
            placeholder="Min"
            min="0"
          />
          <span class="text-gray-500">to</span>
          <input
            type="number"
            class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
            v-model.number="budgetMax"
            placeholder="Max"
            min="0"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Work Style</label>
        <MultiSelect
          :options="workStyleOptions"
          placeholder="Filter by work style..."
          v-model="filterWorkStyles"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Created Date Range</label>
        <div class="flex items-center gap-2">
          <input
            type="date"
            class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
            v-model="startDate"
            placeholder="Start Date"
          />
          <span class="text-gray-500">to</span>
          <input
            type="date"
            class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
            v-model="endDate"
            placeholder="End Date"
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Job Status</label>
        <MultiSelect
          :options="jobStatusOptions"
          placeholder="Filter by job status..."
          v-model="filterJobStatuses"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
        <MultiSelect
          :options="locationTypeOptions"
          placeholder="Filter by location type..."
          v-model="filterLocationTypes"
        />
      </div>
    </div>
    <!-- Job Postings -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in paginatedJobs" :key="job.id" class="bg-white rounded-xl shadow-soft overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold">{{ job.title || 'N/A' }}</h3>
        </div>
        <div class="px-6 py-4 space-y-2">
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
              <span v-for="(keyword, index) in job.search_keywords" :key="index" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">{{ keyword }}</span>
            </span>
            <span v-else>N/A</span>
          </p>
          <div class="mt-4 flex gap-2">
            <router-link :to="'/jobs/' + job.id" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-cyan-600 border border-cyan-200 hover:bg-cyan-50">View Full Details</router-link>
            <button
              v-if="job.job_status === 0 || job.job_status === 1"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-red-600 border border-red-200 hover:bg-red-50"
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
import MultiSelect from '@/components/forms/MultiSelect.vue';

export default {
  components: {
    Pagination,
    DropJobModal,
    MultiSelect,
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
      workStyleOptions: [
        { value: 'Full time', label: 'Full time' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Part time', label: 'Part time' },
      ],
      jobStatusOptions: [
        { value: 'Open', label: 'Open' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Dropped', label: 'Dropped' },
      ],
      locationTypeOptions: [
        { value: 'In person', label: 'In person' },
        { value: 'Remote', label: 'Remote' },
      ],
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
        const matchesWorkStyle = !this.filterWorkStyles.length || this.filterWorkStyles.includes(workStyle);

        const jobDate = job.created_at ? new Date(job.created_at).toISOString().split('T')[0] : null;
        const startDate = this.startDate || null;
        const endDate = this.endDate ? new Date(new Date(this.endDate).setDate(new Date(this.endDate).getDate() + 1)).toISOString().split('T')[0] : null;
        const matchesDate = (!startDate || !jobDate || jobDate >= startDate) &&
                           (!endDate || !jobDate || jobDate < endDate);

        const jobStatus = this.mapJobStatus(job.job_status);
        const matchesJobStatus = !this.filterJobStatuses.length || this.filterJobStatuses.includes(jobStatus);

        const locationType = this.mapLocationType(job.location?.type);
        const matchesLocationType = !this.filterLocationTypes.length || this.filterLocationTypes.includes(locationType);

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
