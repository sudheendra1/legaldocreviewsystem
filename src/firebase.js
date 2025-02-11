// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVpJ9kB0Np-eS-mKHQGQQZMi60gLdWRws",
  authDomain: "document-verification-43113.firebaseapp.com",
  projectId: "document-verification-43113",
  storageBucket: "document-verification-43113.firebasestorage.app",
  messagingSenderId: "794018218352",
  appId: "1:794018218352:web:b5735805cfa233ff050fb5",
  measurementId: "G-1VL8027VQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth,analytics };