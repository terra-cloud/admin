import { db } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, orderBy, query, limit, startAfter, getDoc, getDocs, where, Timestamp } from 'firebase/firestore';

const bookingsCollection = collection(db, 'vehicle-bookings');
const listingsCollection = collection(db, 'vehicle-listings');

class VehicleBookingsDataService {
  getAll(callback, errorCallback) {
    const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    let fallback = false;
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(bookings);
    }, (error) => {
      if (!fallback && error.code === 'failed-precondition') {
        fallback = true;
        const fbq = query(bookingsCollection);
        return onSnapshot(fbq, (snapshot) => {
          const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  getPaginated(itemsPerPage, lastDoc, sortField = 'createdAt', sortDir = 'desc') {
    const orderDirection = sortDir === 'asc' ? 'asc' : 'desc';
    let q;
    if (lastDoc) {
      q = query(bookingsCollection, orderBy(sortField, orderDirection), startAfter(lastDoc), limit(itemsPerPage));
    } else {
      q = query(bookingsCollection, orderBy(sortField, orderDirection), limit(itemsPerPage));
    }
    return { query: q, ref: bookingsCollection };
  }

  getRealtime(q, callback, errorCallback) {
    return onSnapshot(q, (snapshot) => {
      const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(bookings, snapshot.docs[snapshot.docs.length - 1]);
    }, (error) => {
      console.error('Error in realtime listener:', error);
      if (errorCallback) errorCallback(error);
    });
  }

  async getById(id) {
    try {
      const docRef = doc(db, 'vehicle-bookings', id);
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

  async getVehicleListing(rentalId) {
    try {
      const docRef = doc(db, 'vehicle-listings', rentalId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting vehicle listing:', error);
      return null;
    }
  }

  async updateStatus(id, data) {
    try {
      const docRef = doc(db, 'vehicle-bookings', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async approveBooking(id) {
    return this.updateStatus(id, { status: 'active' });
  }

  async cancelBooking(id) {
    return this.updateStatus(id, { status: 'cancelled' });
  }

  async completeBooking(id) {
    return this.updateStatus(id, { status: 'completed' });
  }

  async delete(id) {
    try {
      const docRef = doc(db, 'vehicle-bookings', id);
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
      const statusCounts = { active: 0, pending: 0, completed: 0, cancelled: 0 };
      snapshot.forEach(doc => {
        const data = doc.data();
        total++;
        const status = (data.status || '').toLowerCase();
        if (status in statusCounts) statusCounts[status]++;
      });
      return { total, ...statusCounts };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { total: 0, active: 0, pending: 0, completed: 0, cancelled: 0 };
    }
  }

  async getFilteredCount(filters = {}) {
    try {
      const constraints = [];
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

export default new VehicleBookingsDataService();
