import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Copy these directly from your Firebase screen:
const firebaseConfig = {
  apiKey: "AIzaSyD36R2s_1IQEMLURdLVq10qWqRMHbac-X0",
  authDomain: "test2-823e8.firebaseapp.com",
  projectId: "test2-823e8",
  storageBucket: "test2-823e8.appspot.com",
  messagingSenderId: "1031102024128",
  appId: "1:1031102024128:web:d7c22f915c72a36c6f6025"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database so your other files can use it
export const db = getFirestore(app);