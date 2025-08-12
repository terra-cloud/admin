import { db } from '@/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
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
      const news = snapshot.docs.map(doc => {
        const data = {
          id: doc.id,
          docRef: doc.ref, // Include docRef for potential future use
          ...doc.data()
        };
        if (!doc.id) {
          console.error('Firestore document missing ID:', doc.data());
        }
        return data;
      });
      callback(news);
    }, (error) => {
      console.error('Error fetching news:', error);
      throw error;
    });
  }

  // Create a new news item with random Firestore ID
  async create(news, imageFile) {
    let image_url = '';
    const newsData = {
      ...news,
      image_url,
      created_at: formatDateToMicroseconds(new Date())
    };
    const docRef = await addDoc(newsCollection, newsData);
    if (imageFile) {
      const storageRef = ref(storage, `news/${docRef.id}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      image_url = await getDownloadURL(storageRef);
      // Update the document with the image URL
      await updateDoc(docRef, { image_url });
    }
    await updateDoc(docRef, { id: docRef.id });
    return docRef; // Return document reference
  }

  // Update a news item
  async update(id, news, imageFile) {
    if (!id) {
      console.error('Update failed: Invalid document ID:', id);
      throw new Error('Invalid news document ID');
    }
    const newsRef = doc(db, 'news-data', id);
    let image_url = news.image_url || '';
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
    await updateDoc(newsRef, newsData);
    return newsRef;
  }

  // Delete a news item
  async delete(id, image_url) {
    if (!id) {
      console.error('Delete failed: Invalid document ID:', id);
      throw new Error('Invalid news document ID');
    }
    const newsRef = doc(db, 'news-data', id);
    if (image_url) {
      try {
        const imageRef = ref(storage, image_url);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Could not delete image:', error);
      }
    }
    await deleteDoc(newsRef);
    return newsRef;
  }
}

export default new NewsDataService();