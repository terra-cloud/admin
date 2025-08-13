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
          docRef: doc.ref,
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
    console.log('Creating news with data:', newsData, 'Image file:', imageFile);
    const docRef = await addDoc(newsCollection, newsData);
    if (imageFile) {
      try {
        const storageRef = ref(storage, `news/${docRef.id}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        image_url = await getDownloadURL(storageRef);
        console.log('Image uploaded, URL:', image_url);
        await updateDoc(docRef, { image_url });
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
    }
    await updateDoc(docRef, { id: docRef.id });
    return docRef;
  }

  // Update a news item
  async update(id, news, imageFile) {
    if (!id) {
      console.error('Update failed: Invalid document ID:', id);
      throw new Error('Invalid news document ID');
    }
    const newsRef = doc(db, 'news-data', id);
    let image_url = news.image_url && !news.image_url.startsWith('data:') ? news.image_url : '';
    if (imageFile) {
      try {
        const storageRef = ref(storage, `news/${id}_${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        image_url = await getDownloadURL(storageRef);
        console.log('Image uploaded, URL:', image_url);
        // Delete old image if exists and is not a data URL
        if (news.image_url && !news.image_url.startsWith('data:')) {
          try {
            const oldImageRef = ref(storage, news.image_url);
            await deleteObject(oldImageRef);
            console.log('Old image deleted:', news.image_url);
          } catch (error) {
            console.warn('Could not delete old image:', error);
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }
    }
    const newsData = {
      ...news,
      image_url,
      updated_at: formatDateToMicroseconds(new Date())
    };
    console.log('Updating news with data:', newsData, 'Image file:', imageFile);
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
    if (image_url && !image_url.startsWith('data:')) {
      try {
        const imageRef = ref(storage, image_url);
        await deleteObject(imageRef);
        console.log('Image deleted:', image_url);
      } catch (error) {
        console.warn('Could not delete image:', error);
      }
    } else if (image_url) {
      console.warn('Skipping image deletion: Invalid image_url (data URL):', image_url);
    }
    await deleteDoc(newsRef);
    return newsRef;
  }
}

export default new NewsDataService();