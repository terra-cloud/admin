import { db } from '@/firebase';
import { collection, doc, onSnapshot, orderBy, query, getDoc, getDocs, where, Timestamp } from 'firebase/firestore';

const paymentsCollection = collection(db, 'workbits-payments');

class WorkbitsPaymentsDataService {
  getAll(callback, errorCallback) {
    const q = query(paymentsCollection, orderBy('createdAt', 'desc'));
    let fallback = false;
    return onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(payments);
    }, (error) => {
      if (!fallback && error.code === 'failed-precondition') {
        fallback = true;
        const fbq = query(paymentsCollection);
        return onSnapshot(fbq, (snapshot) => {
          const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(payments);
        }, (fbError) => {
          console.error('Error fetching payments (fallback):', fbError);
          if (errorCallback) errorCallback(fbError);
        });
      }
      console.error('Error fetching payments:', error);
      if (errorCallback) errorCallback(error);
    });
  }

  async getById(id) {
    try {
      const docRef = doc(db, 'workbits-payments', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting payment by ID:', error);
      return null;
    }
  }

  async getUserById(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getStats() {
    try {
      const snapshot = await getDocs(paymentsCollection);
      let total = 0, totalRevenue = 0;
      const statusCounts = { paid: 0, pending: 0, failed: 0, expired: 0 };
      snapshot.forEach(doc => {
        const data = doc.data();
        total++;
        const status = (data.paymentData?.status || '').toLowerCase();
        if (status in statusCounts) statusCounts[status]++;
        if (status === 'paid') {
          totalRevenue += Number(data.paymentData?.amount || 0);
        }
      });
      return { total, totalRevenue, ...statusCounts };
    } catch (error) {
      console.error('Error getting payment stats:', error);
      return { total: 0, totalRevenue: 0, paid: 0, pending: 0, failed: 0, expired: 0 };
    }
  }

  async getFilteredCount(filters = {}) {
    try {
      const constraints = [];
      if (filters.status) constraints.push(where('paymentData.status', '==', filters.status.toUpperCase()));
      if (constraints.length > 0) {
        const q = query(paymentsCollection, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.size;
      }
      const snapshot = await getDocs(paymentsCollection);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting filtered count:', error);
      return 0;
    }
  }
}

export default new WorkbitsPaymentsDataService();
