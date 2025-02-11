import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  // Your Firebase configuration object goes here
  apiKey: "AIzaSyBVpJ9kB0Np-eS-mKHQGQQZMi60gLdWRws",
  authDomain: "document-verification-43113.firebaseapp.com",
  projectId: "document-verification-43113",
  storageBucket: "document-verification-43113.firebasestorage.app",
  messagingSenderId: "794018218352",
  appId: "1:794018218352:web:b5735805cfa233ff050fb5",
   measurementId: "G-1VL8027VQH"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

