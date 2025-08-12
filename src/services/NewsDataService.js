import { db } from '@/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Helper function to format date as YYYY-MM-DDThh:mm:ss.ssssss
function formatDateToMicroseconds(date) {
  const pad = (num, size) => String(num).padStart(size, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getSeconds(), 2);
  const milliseconds = pad(date.getMilliseconds(), 3);
  const microseconds = pad(Math.floor(Math.random() * 1000), 3); // Simulate microseconds
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
}

const storage = getStorage();
const newsCollection = collection(db, 'news-data');

class NewsDataService {
  // Get all news items with real-time updates
  getAll(callback) {
    const q = query(newsCollection, orderBy('created_at', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(news);
    }, (error) => {
      console.error('Error fetching news:', error);
      throw error;
    });
  }

  // Create a new news item
  async create(news, imageFile) {
    let image_url = '';
    if (imageFile) {
      const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      image_url = await getDownloadURL(storageRef);
    }
    const newsData = {
      ...news,
      image_url,
      created_at: formatDateToMicroseconds(new Date())
    };
    return await addDoc(newsCollection, newsData);
  }

  // Update a news item
  async update(id, news, imageFile) {
    const newsRef = doc(db, 'news-data', id);
    let image_url = news.image_url;
    if (imageFile) {
      const storageRef = ref(storage, `news/${id}_${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      image_url = await getDownloadURL(storageRef);
      // Delete old image if exists
      if (news.image_url) {
        try {
          const oldImageRef = ref(storage, news.image_url);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('Could not delete old image:', error);
        }
      }
    }
    const newsData = {
      ...news,
      image_url,
      updated_at: formatDateToMicroseconds(new Date())
    };
    return await updateDoc(newsRef, newsData);
  }

  // Delete a news item
  async delete(id, image_url) {
    const newsRef = doc(db, 'news-data', id);
    if (image_url) {
      try {
        const imageRef = ref(storage, image_url);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Could not delete image:', error);
      }
    }
    return await deleteDoc(newsRef);
  }
}

export default new NewsDataService();