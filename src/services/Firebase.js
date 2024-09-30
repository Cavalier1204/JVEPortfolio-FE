import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  deleteObject as storageDeleteObject,
  uploadBytes as storageUploadBytes,
  getBytes as storageGetBytes,
} from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_API_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
export const imageUploader = getStorage(app);

// Exporting functions and storage reference
export const ref = storageRef;
export const deleteObject = storageDeleteObject;
export const uploadBytes = storageUploadBytes;
export const getBytes = storageGetBytes;
