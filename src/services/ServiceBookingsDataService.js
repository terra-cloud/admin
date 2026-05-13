import { db } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, orderBy, query, getDoc, getDocs, where, Timestamp } from 'firebase/firestore';

const bookingsCollection = collection(db, 'service-bookings');
const listingsCollection = collection(db, 'service-listings');

class ServiceBookingsDataService {
  getAll(callback, errorCallback) {
    const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    let fallback = false;
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      callback(bookings);
    }, (error) => {
      if (!fallback && error.code === 'failed-precondition') {
        fallback = true;
        const fbq = query(bookingsCollection);
        return onSnapshot(fbq, (snapshot) => {
          const bookings = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          callback(bookings);
        }, (fbError) => {
          console.error('Error fetching bookings (fallback):', fbError);
          if (errorCallback) errorCallback(fbError);
        });
      }
      console.error('Error fetching bookings:', error);
      if (errorCallback) errorCallback(error);
    });
  }

  async getById(id) {
    try {
      const docRef = doc(db, 'service-bookings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting booking by ID:', error);
      return null;
    }
  }

  async getServiceListing(jobId) {
    try {
      const docRef = doc(db, 'service-listings', jobId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting service listing:', error);
      return null;
    }
  }

  async updateStatus(id, data) {
    try {
      const docRef = doc(db, 'service-bookings', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, 'service-bookings', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const snapshot = await getDocs(bookingsCollection);
      let total = 0;
      const statusCounts = { pendingAcceptance: 0, accepted: 0, onGoing: 0, delivered: 0, completed: 0, cancelled: 0 };
      snapshot.forEach(doc => {
        const data = doc.data();
        total++;
        const status = (data.status || '').toLowerCase();
        if (status in statusCounts) statusCounts[status]++;
      });
      return { total, ...statusCounts };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return { total: 0, pendingAcceptance: 0, accepted: 0, onGoing: 0, delivered: 0, completed: 0, cancelled: 0 };
    }
  }

  async getFilteredCount(filters = {}) {
    try {
      let constraints = [];
      if (filters.status) constraints.push(where('status', '==', filters.status));
      if (constraints.length > 0) {
        const q = query(bookingsCollection, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.size;
      }
      const snapshot = await getDocs(bookingsCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting filtered count:', error);
      return 0;
    }
  }
}

export default new ServiceBookingsDataService();
