<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 class="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Job Posting Details</h1>
      </div>
      <div class="flex gap-3">
        <button
          class="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
          <span class="material-symbols-outlined mr-2 text-base">edit</span>
          Edit Job
        </button>
        <button
          class="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
          Change Status
        </button>
        <button
          class="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent text-destructive text-sm font-bold hover:bg-destructive/10 transition-all">
          <span class="material-symbols-outlined mr-2 text-base">delete</span>
          Delete Job
        </button>
      </div>
    </div>
    <div class="space-y-6">
      <div class="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
        <div class="flex justify-between items-start">
          <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Job Information</h2>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block mb-1">Job Title</label>
            <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">Senior Software
              Engineer (Frontend)</p>
          </div>
          <div>
            <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block mb-1">Company
              Name</label>
            <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">Innovate Inc.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark mr-2">calendar_today</span>
            <div>
              <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block">Date Created</label>
              <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">Oct 26, 2023</p>
            </div>
          </div>
          <div class="flex items-center">
            <span
              class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark mr-2">update</span>
            <div>
              <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block">Last Updated</label>
              <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">Nov 01, 2023</p>
            </div>
          </div>
        </div>
        <div>
          <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block mb-1">Full Job
            Description</label>
          <p class="text-base text-text-primary-light dark:text-text-primary-dark leading-relaxed">
            We are looking for a talented Senior Frontend Software Engineer to join our dynamic team. The ideal
            candidate will have a strong background in modern JavaScript frameworks (React, Vue, or Angular), a passion
            for building beautiful and performant user interfaces, and a commitment to writing clean, maintainable code.
            You will be responsible for leading the development of new features, mentoring junior engineers, and working
            closely with product and design teams to deliver exceptional user experiences.
          </p>
        </div>
      </div>
      <div class="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
        <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Budget Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block mb-1">Salary
              Range</label>
            <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">$120,000 - $150,000</p>
          </div>
          <div>
            <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block mb-1">Currency</label>
            <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">USD</p>
          </div>
          <div>
            <label class="text-sm text-text-secondary-light dark:text-text-secondary-dark block mb-1">Employment
              Type</label>
            <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">Full-time</p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
          <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Author Information</h2>
          <div class="flex items-center gap-4">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
              data-alt="Profile picture of Jane Doe"
              style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdw9v1aW7k6Hoz7dqNxEHEb6y1vkM3EAV39p7BZx45ch_eoZjs9uokSKuy25otaZEjfWmH37Hx5uwyFHXliLLXJ0CuONE_oGYnZZa-Sv0VKTRCZdo3lnLVH0hAzTQxdc-b-f-Usej9s738RiQ7lC45TKdpKzXfCwFgYoT6YAoryQyXYawoGEj_fVNLzw5EbY27LRAsdVowKxHDy6kUNQHiRNjiVyAkpVmGbZEYyapHT93Et9n2lyp-UahDIygbF4oyTXbY0lLFtwJu");'>
            </div>
            <div>
              <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">Jane Doe</p>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">jane.doe@innovate.com</p>
            </div>
          </div>
        </div>
        <div
          class="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
          <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Location</h2>
          <div class="flex items-center gap-4">
            <span
              class="material-symbols-outlined text-3xl text-text-secondary-light dark:text-text-secondary-dark">location_on</span>
            <div>
              <p class="text-base text-text-primary-light dark:text-text-primary-dark font-medium">San Francisco, CA</p>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Hybrid</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
        <h2 class="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-6">Job Offers</h2>
        <div class="space-y-6">
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                  data-alt="Profile picture of John Smith"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9SgKQQA_ouJodbtzPBNnHY5uvYvkoj9q3mBDch5sbTivYGBDRrtpiyHRrIQWcpSgI3tUGMBhQXJuCtkqfrDITeEnrSI5iTkyPlMtXJtbxMmjmPJotW-g7U9yQyAM0QL_13Ni2zLk0X_hviqp9DhdyCF--BNRNtYlSr_Ls2RGoYZuxfG_DhGOZZAhcpaCDQq5t_qHONYGfGaI_cfxx29Ix7shi5mSE3Ys4N19_J5d80wgHUeuDPvDnynii1EL39y2Wzap0FA2Tjm5c");'>
                </div>
                <div>
                  <p class="text-base font-medium text-text-primary-light dark:text-text-primary-dark">John Smith</p>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">john.smith@example.com</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-base font-medium text-text-primary-light dark:text-text-primary-dark">$135,000</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Nov 02, 2023</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Offer Details:</p>
              <p class="text-base text-text-primary-light dark:text-text-primary-dark">Excited about the opportunity. My
                counter-offer includes a signing bonus and an additional week of vacation.</p>
            </div>
          </div>
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                  data-alt="Profile picture of Emily White"
                  style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQmaksGCU9aMOQSnrbG9hmEYGaGfvyMKfsbVpvyrRsQqbG8DM9xFiUMJ8tKh0caRowtz2pTmHfHB3DWMTrwEN6Py7u3gcoabV92LDFrU15G5j5UEsa_QlQwsvfwsWUrcsdO0WhrrV7Oe6TeQVCVT_mTv3nr5B4WxvvB6a5a43wrWfAGpYShKR4tRLcfhCkatA_20kYSHV4ukC4t0Pw1IbXnEH4lBqye90jSCGSeN1Rqm6Tw1TkpOj0tVsJr-WNWCTAibToe1UFnz1d");'>
                </div>
                <div>
                  <p class="text-base font-medium text-text-primary-light dark:text-text-primary-dark">Emily White</p>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">emily.white@example.com</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-base font-medium text-text-primary-light dark:text-text-primary-dark">$140,000</p>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Nov 03, 2023</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">Offer Details:</p>
              <p class="text-base text-text-primary-light dark:text-text-primary-dark">I am very interested in this
                role. My proposed salary is based on my extensive experience and the value I can bring to the team.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      job: {},
      jobOffers: [],
    };
  },
  methods: {
    async fetchJob() {
      try {
        const jobId = this.$route.params.jobId;
        const jobDoc = await getDoc(doc(db, 'job-posting', jobId));
        if (jobDoc.exists()) {
          this.job = { id: jobDoc.id, ...jobDoc.data() };
          await this.fetchJobOffers(jobId);
        } else {
          console.error('Job not found for ID:', jobId);
          alert('Job not found');
          this.$router.push('/job-postings');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        alert('Failed to load job details');
      }
    },
    async fetchJobOffers(jobId) {
      try {
        const offersQuery = query(
          collection(db, 'job-offers'),
          where('job_id', '==', jobId)
        );
        const querySnapshot = await getDocs(offersQuery);
        const offers = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            reference_id: doc.id, // Firestore document ID (e.g., "1752548039259")
            id: doc.id,
            doc_id: data.id, // Internal id field (e.g., "1752548039259")
            ...data,
            counterOffers: [],
          };
        });

        // Log all job_offer_id values in job-counter-offers for debugging
        const allCounterOffersQuery = query(collection(db, 'job-counter-offers'));
        const allCounterOffersSnapshot = await getDocs(allCounterOffersQuery);
        const allJobOfferIds = allCounterOffersSnapshot.docs.map(doc => doc.data().job_offer_id);

        for (const offer of offers) {
          const counterOffersQuery = query(
            collection(db, 'job-counter-offers'),
            where('job_offer_id', '==', offer.reference_id) // Uses Firestore document ID
          );
          const counterOffersSnapshot = await getDocs(counterOffersQuery);
          offer.counterOffers = counterOffersSnapshot.docs.map(doc => ({
            id: doc.id, // Firestore document ID for counter-offer
            ...doc.data(),
          }));
          if (offer.counterOffers.length === 0) {
            console.warn(`No counter-offers found for offer ${offer.id}. Expected job_offer_id: ${offer.id}`);
          }
        }

        this.jobOffers = offers;

      } catch (error) {
        console.error('Error fetching job offers or counter-offers:', error);
        alert('Failed to load job offers or counter-offers');
      }
    },
    mapAccountType(accountType) {
      const types = {
        1: 'User',
        2: 'Employer',
      };
      return types[accountType] || 'Unknown';
    },
    displayStatus(status) {
      const statusSet = [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Rejected' },
      ];
      const index = statusSet.findIndex(item => item.value === status);
      return index !== -1 ? statusSet[index].message : 'Unknown';
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
      };
      return statuses[status] || 'Unknown';
    },
    mapLocationType(type) {
      const types = {
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
  },
  mounted() {
    this.fetchJob();
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

.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
  margin-left: 0.5rem;
}

.tab-content {
  padding: 1rem;
}

.nav-tabs .nav-link {
  color: #495057;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
}

.offer-section {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem;
}

.counter-offer-section {
  margin-left: 1.5rem;
  padding-left: 1rem;
  border-left: 2px solid #dee2e6;
}
</style>