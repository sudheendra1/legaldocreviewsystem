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
