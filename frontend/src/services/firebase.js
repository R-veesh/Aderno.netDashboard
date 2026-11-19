// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration loaded from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD537FGr-0lGzgKXV5JZ7ifdlVsSitt3FY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aderno-ff9b0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aderno-ff9b0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aderno-ff9b0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "682349668937",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:682349668937:web:b95565b23f9ac1569ded98",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YJG1B4CY55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally (only supported in browser environments)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { 
  app, 
  auth, 
  analytics, 
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};
