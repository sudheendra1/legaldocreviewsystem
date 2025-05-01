import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
// import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
// import { getStorage } from "firebase/storage"
import { getFirestore, doc, getDoc, collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore"

const firebaseConfig = {
  // Your Firebase configuration object goes here
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
// export const storage = getStorage(app)



// Function to get user information
export const getUserInfo = async (userId) => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    return userSnap.data()
  }
  return null
}

// Function to create a new submission
// export const createSubmission = async (userId, bankId, documents) => {
  export const createSubmission = async (userId, bankId, documents, mongoDBFiles) => {
  const submissionRef = collection(db, "submissions")
  const newSubmission = await addDoc(submissionRef, {
    userId,
    bankId,
    status: "pending",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    documents,
    mongoDBFiles,
  })
  return newSubmission.id
}

// Function to update a submission with MongoDB file references
export const updateSubmission = async (submissionId, mongoDBFile) => {
  const submissionRef = doc(db, "submissions", submissionId)
  await updateDoc(submissionRef, {
    mongoDBFiles: mongoDBFile,
    updatedAt: serverTimestamp(),
  })
}

// Function to store a MongoDB file reference
export const storeMongoDBFileReference = async (userId, fileData) => {
  const fileRefsCollection = collection(db, "users", userId, "fileReferences")
  const newFileRef = await addDoc(fileRefsCollection, {
    ...fileData,
    createdAt: serverTimestamp(),
  })
  return newFileRef.id
}

