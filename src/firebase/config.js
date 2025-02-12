import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc, serverTimestamp,collection,addDoc } from "firebase/firestore"
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


// Function to create or update user information
export const updateUserInfo = async (userId, userInfo) => {
  const userRef = doc(db, "users", userId)
  await setDoc(
    userRef,
    {
      ...userInfo,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

// Function to create a new submission
export const createSubmission = async (userId, bankId, documents) => {
  const submissionRef = collection(db, "submissions")
  await addDoc(submissionRef, {
    userId,
    bankId,
    status: "pending",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    documents,
  })
}
// Function to get user information
export const getUserInfo = async (userId) => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    return userSnap.data()
  }
  return null
}

// Create predefined users
const createOrUpdatePredefinedUsers = async () => {
  const users = [
    { email: "user1@example.com", password: "password1", name: "User One", bankName: "Bank A", bankId: "BANKA001" },
    { email: "user2@example.com", password: "password2", name: "User Two", bankName: "Bank B", bankId: "BANKB002" },
  ]

  for (const user of users) {
    try {
      // Try to sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password)
      console.log(`User signed in: ${user.email}`)

      // Update user info in Firestore
      await updateUserInfo(userCredential.user.uid, {
        name: user.name,
        bankName: user.bankName,
        bankId: user.bankId,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // If user doesn't exist, create a new one
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
          console.log(`User created: ${user.email}`)

          // Add user info to Firestore
          await updateUserInfo(userCredential.user.uid, {
            name: user.name,
            bankName: user.bankName,
            bankId: user.bankId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        } catch (createError) {
          console.error(`Error creating user ${user.email}:`, createError)
        }
      } else {
        console.error(`Error signing in user ${user.email}:`, error)
      }
    }
  }
}

createOrUpdatePredefinedUsers()

