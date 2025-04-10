// "use client"

// import React, { createContext, useState, useEffect, useContext } from "react"
// import { auth } from "../firebase/config"

// import { onAuthStateChanged } from "firebase/auth"

// // Create the AuthContext with a default value
// const AuthContext = createContext({
//   currentUser: null,
//   loading: true,
// })
// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context}

// export function AuthProvider({ children }) {
  
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
// // Subscribe to auth state changes
// const unsubscribe = onAuthStateChanged(auth, (user) => {
//   console.log("onAuthStateChanged triggered. User:", currentUser)  
//         setCurrentUser(user)
//       setLoading(false)
//     })

//     return unsubscribe
//   }, [])

//  // Create the value object with memoization to prevent unnecessary re-renders
//  const value = React.useMemo(
//   () => ({
//         currentUser,
//     loading,
//   }),
//   [currentUser, loading],
// )

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
// }

"use client"

import React, { createContext, useState, useEffect, useContext } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext({
  currentUser: null,
  loading: true,
})

export function useAuth() {
  const context = useContext(AuthContext)
  console.log("🔍 useAuth() called, context:", context) 
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("✅ onAuthStateChanged fired. User:", user)
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = React.useMemo(
    () => ({
      currentUser,
      loading,
    }),
    [currentUser, loading]
  )

  console.log("📦 AuthProvider value:", value) 

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
