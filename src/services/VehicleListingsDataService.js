import { db } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc, onSnapshot, orderBy, query, limit, startAfter, getDoc, getDocs, where, Timestamp } from 'firebase/firestore';

const listingsCollection = collection(db, 'vehicle-listings');
const detailsCollection = collection(db, 'vehicle-listing-details');

class VehicleListingsDataService {
  getAll(callback, errorCallback) {
    const q = query(listingsCollection, orderBy('createdAt', 'desc'));
    let fallback = false;
    return onSnapshot(q, (snapshot) => {
      const listings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(listings);
    }, (error) => {
      if (!fallback && error.code === 'failed-precondition') {
        fallback = true;
        const fbq = query(listingsCollection);
        return onSnapshot(fbq, (snapshot) => {
          const listings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(listings);
        }, (fbError) => {
          console.error('Error fetching vehicle listings (fallback):', fbError);
          if (errorCallback) errorCallback(fbError);
        });
      }
      console.error('Error fetching vehicle listings:', error);
      if (errorCallback) errorCallback(error);
    });
  }

  getPaginated(itemsPerPage, lastDoc, sortField = 'createdAt', sortDir = 'desc') {
    let q;
    const orderDir = sortDir === 'asc' ? 'asc' : 'desc';
    if (lastDoc) {
      q = query(
        listingsCollection,
        orderBy(sortField, orderDir),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );
    } else {
      q = query(
        listingsCollection,
        orderBy(sortField, orderDir),
        limit(itemsPerPage)
      );
    }
    return { query: q, ref: listingsCollection };
  }

  getRealtime(q, callback, errorCallback) {
    return onSnapshot(q, (snapshot) => {
      const listings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(listings, snapshot.docs[snapshot.docs.length - 1]);
    }, (error) => {
      console.error('Error in realtime listener:', error);
      if (errorCallback) errorCallback(error);
    });
  }

  async getTotalCount() {
    try {
      const snapshot = await getDocs(listingsCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  }

  async getById(id) {
    try {
      const docRef = doc(db, 'vehicle-listings', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting listing by ID:', error);
      return null;
    }
  }

  async getDetails(id) {
    try {
      const docRef = doc(db, 'vehicle-listing-details', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting listing details:', error);
      return null;
    }
  }

  async updateStatus(id, data) {
    try {
      const docRef = doc(db, 'vehicle-listings', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Error updating listing status:', error);
      throw error;
    }
  }

  async bulkUpdateStatus(ids, data) {
    try {
      const promises = ids.map(id => {
        const docRef = doc(db, 'vehicle-listings', id);
        return updateDoc(docRef, {
          ...data,
          updatedAt: Timestamp.now()
        });
      });
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, 'vehicle-listings', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      const promises = ids.map(id => deleteDoc(doc(db, 'vehicle-listings', id)));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error in bulk delete:', error);
      throw error;
    }
  }

  async getFilteredCount(filters = {}) {
    try {
      let constraints = [];
      if (filters.status) constraints.push(where('status', '==', filters.status));
      if (filters.category) constraints.push(where('category', '==', filters.category));

      if (constraints.length > 0) {
        const q = query(listingsCollection, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.size;
      }
      const snapshot = await getDocs(listingsCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting filtered count:', error);
      return 0;
    }
  }

  async getStats() {
    try {
      const snapshot = await getDocs(listingsCollection);
      let total = 0, active = 0, pending = 0, suspended = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        total++;
        const status = (data.status || '').toLowerCase();
        if (status === 'active' || data.isAvailable === true) active++;
        if (status === 'pending') pending++;
        if (data.is_suspended === true || status === 'suspended') suspended++;
      });
      return { total, active, pending, suspended };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { total: 0, active: 0, pending: 0, suspended: 0 };
    }
  }
}

export default new VehicleListingsDataService();
