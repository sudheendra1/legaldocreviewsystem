"use client"

import React, { createContext, useState, useEffect, useContext } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  role: null,
  login: () => {},
  logout: () => {}
})

// export function useAuth() {
//   const context = useContext(AuthContext)
//   console.log("🔍 useAuth() called, context:", context) 
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       console.log("✅ onAuthStateChanged fired. User:", user)
//       setCurrentUser(user)
//       setLoading(false)
//     })

//     return unsubscribe
//   }, [])

//   const value = React.useMemo(
//     () => ({
//       currentUser,
//       loading,
//     }),
//     [currentUser, loading]
//   )

//   console.log("📦 AuthProvider value:", value) 

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   )
// }

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on page reload
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    const storedUid = localStorage.getItem("userUid");

    if (token && storedEmail) {
      setCurrentUser({ email: storedEmail, name: storedName,uid: storedUid }); // You can expand this object as needed
      setRole(storedRole);
    }
    setLoading(false);
  }, [])

  // Provide a global login function
  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userUid", userData.uid);

    setCurrentUser({ email: userData.email,name: userData.name,uid: userData.uid });
    setRole(userData.role);
  }

  // Provide a global logout function
  const logout = () => {
    localStorage.clear(); // Wipes the token
    setCurrentUser(null);
    setRole(null);
  }

  const value = { currentUser, role, loading, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}