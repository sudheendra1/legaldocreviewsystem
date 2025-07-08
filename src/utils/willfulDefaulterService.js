// import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore"
// import { db } from "../firebase/config"
// import { uploadToS3 } from "./s3Upload"

// export const uploadDocumentsToS3 = async (files, onProgress) => {
//   if (!files || files.length === 0) return []

//   const uploadPromises = files.map(async (file, index) => {
//     try {
//       const url = await uploadToS3(file, (progress) => {
//         if (onProgress) {
//           onProgress(index, progress)
//         }
//       })
//       return {
//         name: file.name,
//         url: url,
//         size: file.size,
//         type: file.type,
//         uploadedAt: new Date().toISOString(),
//       }
//     } catch (error) {
//       console.error(`Failed to upload ${file.name}:`, error)
//       throw error
//     }
//   })

//   return Promise.all(uploadPromises)
// }

// export const saveWillfulDefaulterData = async (formData) => {
//   try {
//     console.log("Starting document uploads...")

//     // Upload all documents first
//     const uploadedData = { ...formData }

//     // Upload borrower documents
//     if (formData.borrowers) {
//       console.log("Uploading borrower documents...")
//       uploadedData.borrowers = await Promise.all(
//         formData.borrowers.map(async (borrower) => {
//           if (borrower.documents && borrower.documents.length > 0) {
//             const uploadedDocs = await uploadDocumentsToS3(borrower.documents)
//             return { ...borrower, documents: uploadedDocs }
//           }
//           return borrower
//         }),
//       )
//     }

//     // Upload facility documents
//     if (formData.facilities) {
//       console.log("Uploading facility documents...")
//       uploadedData.facilities = await Promise.all(
//         formData.facilities.map(async (facility) => {
//           if (facility.documents && facility.documents.length > 0) {
//             const uploadedDocs = await uploadDocumentsToS3(facility.documents)
//             return { ...facility, documents: uploadedDocs }
//           }
//           return facility
//         }),
//       )
//     }

//     // Upload guarantor documents
//     if (formData.guarantors) {
//       console.log("Uploading guarantor documents...")
//       uploadedData.guarantors = await Promise.all(
//         formData.guarantors.map(async (guarantor) => {
//           if (guarantor.documents && guarantor.documents.length > 0) {
//             const uploadedDocs = await uploadDocumentsToS3(guarantor.documents)
//             return { ...guarantor, documents: uploadedDocs }
//           }
//           return guarantor
//         }),
//       )
//     }

//     // Upload original sanction letter
//     if (formData.originalSanctionLetter) {
//       console.log("Uploading original sanction letter...")
//       const uploadedDoc = await uploadDocumentsToS3([formData.originalSanctionLetter])
//       uploadedData.originalSanctionLetter = uploadedDoc[0]
//     }

//     // Upload siphoning documents
//     if (formData.siphoning?.documents && formData.siphoning.documents.length > 0) {
//       console.log("Uploading siphoning documents...")
//       const uploadedDocs = await uploadDocumentsToS3(formData.siphoning.documents)
//       uploadedData.siphoning = { ...formData.siphoning, documents: uploadedDocs }
//     }

//     // Upload disposal of assets documents
//     if (formData.disposalOfAssets?.documents && formData.disposalOfAssets.documents.length > 0) {
//       console.log("Uploading disposal of assets documents...")
//       const uploadedDocs = await uploadDocumentsToS3(formData.disposalOfAssets.documents)
//       uploadedData.disposalOfAssets = { ...formData.disposalOfAssets, documents: uploadedDocs }
//     }

//     // Upload failure to infuse documents
//     if (formData.failureToInfuse?.documents && formData.failureToInfuse.documents.length > 0) {
//       console.log("Uploading failure to infuse documents...")
//       const uploadedDocs = await uploadDocumentsToS3(formData.failureToInfuse.documents)
//       uploadedData.failureToInfuse = { ...formData.failureToInfuse, documents: uploadedDocs }
//     }

//     // Add metadata using the same pattern as your loan documents module
//     uploadedData.submittedAt = new Date() // Use regular Date instead of serverTimestamp for consistency
//     uploadedData.status = "pending" // Using your existing status convention
//     uploadedData.module = "willful-defaulter"

//     console.log("All documents uploaded successfully. Saving to Firestore...")

//     // Save to Firebase Firestore using the same "submissions" collection as your loan documents
//     // but with module identifier to distinguish willful defaulter submissions
//     const docRef = await addDoc(collection(db, "willfulDefaulterSubmissions"), uploadedData)

//     console.log("Data saved to Firestore with ID:", docRef.id)

//     return {
//       success: true,
//       id: docRef.id,
//       message: "Willful defaulter data saved successfully",
//     }
//   } catch (error) {
//     console.error("Error saving willful defaulter data:", error)
//     throw error
//   }
// }

// export const getWillfulDefaulterData = async (filters = {}) => {
//   try {
//     // Query the same "submissions" collection but filter by module
//     let q = collection(db, "willfulDefaulterSubmissions")

//     if (filters.branchId) {
//       q = query(q, where("branchId", "==", filters.branchId), where("module", "==", "willful-defaulter"))
//     }

//     if (filters.region) {
//       q = query(q, where("region", "==", filters.region), where("module", "==", "willful-defaulter"))
//     }

//     if (filters.status) {
//       q = query(q, where("status", "==", filters.status), where("module", "==", "willful-defaulter"))
//     }

//     if (filters.submittedByUid) {
//       q = query(q, where("submittedByUid", "==", filters.submittedByUid), where("module", "==", "willful-defaulter"))
//     }

//     q = query(q, orderBy("submittedAt", "desc"))

//     const querySnapshot = await getDocs(q)
//     const data = []

//     querySnapshot.forEach((doc) => {
//       data.push({
//         id: doc.id,
//         ...doc.data(),
//       })
//     })

//     return data
//   } catch (error) {
//     console.error("Error fetching willful defaulter data:", error)
//     throw error
//   }
// }

// // Function to save draft data (no S3 uploads) - separate collection for drafts
// export const saveWillfulDefaulterDraft = async (formData) => {
//   try {
//     const draftData = {
//       ...formData,
//       status: "draft",
//       submittedAt: new Date(),
//       updatedAt: new Date(),
//       module: "willful-defaulter",
//     }

//     const docRef = await addDoc(collection(db, "willfulDefaulterDrafts"), draftData)

//     return {
//       success: true,
//       id: docRef.id,
//       message: "Draft saved successfully",
//     }
//   } catch (error) {
//     console.error("Error saving draft:", error)
//     throw error
//   }
// }

// // Function to get all willful defaulter submissions for admin/dashboard view
// export const getAllWillfulDefaulterSubmissions = async () => {
//   try {
//     console.log("🔍 Fetching all willful defaulter submissions...")
//     const q = query(collection(db, "willfulDefaulterSubmissions"), orderBy("submittedAt", "desc"))
//     const querySnapshot = await getDocs(q)
//     const data = []

//     console.log("📊 Query snapshot size:", querySnapshot.size)

//     querySnapshot.forEach((doc) => {
//       console.log("📄 Document found:", doc.id, doc.data())
//       data.push({
//         id: doc.id,
//         ...doc.data(),
//       })
//     })

//     console.log("✅ Total submissions found:", data.length)
//     return data
//   } catch (error) {
//     console.error("❌ Error fetching all willful defaulter submissions:", error)
//     throw error
//   }
// }

// // Function to get willful defaulter submissions by user
// export const getWillfulDefaulterSubmissionsByUser = async (userId) => {
//   try {
//     console.log("🔍 Fetching submissions for user:", userId)
//     const q = query(
//       collection(db, "willfulDefaulterSubmissions"),
//       where("submittedByUid", "==", userId),
//       orderBy("submittedAt", "desc"),
//     )
//     const querySnapshot = await getDocs(q)
//     const data = []

//     console.log("📊 User query snapshot size:", querySnapshot.size)

//     querySnapshot.forEach((doc) => {
//       console.log("📄 User document found:", doc.id, doc.data())
//       data.push({
//         id: doc.id,
//         ...doc.data(),
//       })
//     })

//     console.log("✅ User submissions found:", data.length)
//     return data
//   } catch (error) {
//     console.error("❌ Error fetching user willful defaulter submissions:", error)
//     throw error
//   }
// }

// // Function to get willful defaulter submissions by status
// export const getWillfulDefaulterSubmissionsByStatus = async (status) => {
//   try {
//     console.log("🔍 Fetching submissions with status:", status)
//     const q = query(
//       collection(db, "willfulDefaulterSubmissions"),
//       where("status", "==", status),
//       orderBy("submittedAt", "desc"),
//     )
//     const querySnapshot = await getDocs(q)
//     const data = []

//     console.log("📊 Status query snapshot size:", querySnapshot.size)

//     querySnapshot.forEach((doc) => {
//       console.log("📄 Status document found:", doc.id, doc.data())
//       data.push({
//         id: doc.id,
//         ...doc.data(),
//       })
//     })

//     console.log("✅ Status submissions found:", data.length)
//     return data
//   } catch (error) {
//     console.error("❌ Error fetching willful defaulter submissions by status:", error)
//     throw error
//   }
// }

// // NEW: Function to get a single willful defaulter submission by ID
// export const getWillfulDefaulterSubmissionById = async (submissionId) => {
//   try {
//     console.log("🔍 Fetching submission by ID:", submissionId)
//     const docRef = doc(db, "willfulDefaulterSubmissions", submissionId)
//     const docSnap = await getDoc(docRef)

//     if (docSnap.exists()) {
//       console.log("✅ Submission found:", docSnap.data())
//       return {
//         id: docSnap.id,
//         ...docSnap.data(),
//       }
//     } else {
//       console.log("❌ No submission found with ID:", submissionId)
//       return null
//     }
//   } catch (error) {
//     console.error("❌ Error fetching submission by ID:", error)
//     throw error
//   }
// }

// // Test function to check Firebase connection
// export const testFirebaseConnection = async () => {
//   try {
//     console.log("🧪 Testing Firebase connection...")
//     const testQuery = query(collection(db, "willfulDefaulterSubmissions"))
//     const snapshot = await getDocs(testQuery)
//     console.log("✅ Firebase connection successful. Documents found:", snapshot.size)

//     // Log all document IDs
//     snapshot.forEach((doc) => {
//       console.log("📄 Document ID:", doc.id)
//     })

//     return true
//   } catch (error) {
//     console.error("❌ Firebase connection failed:", error)
//     return false
//   }
// }


import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { uploadToS3 } from "./s3Upload"

export const uploadDocumentsToS3 = async (files, onProgress) => {
  if (!files || files.length === 0) return []

  const uploadPromises = files.map(async (file, index) => {
    try {
      const url = await uploadToS3(file, (progress) => {
        if (onProgress) {
          onProgress(index, progress)
        }
      })
      return {
        name: file.name,
        url: url,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error)
      throw error
    }
  })

  return Promise.all(uploadPromises)
}

export const saveWillfulDefaulterData = async (formData) => {
  try {
    console.log("Starting document uploads...")

    // Upload all documents first
    const uploadedData = { ...formData }

    // Upload borrower documents
    if (formData.borrowers) {
      console.log("Uploading borrower documents...")
      uploadedData.borrowers = await Promise.all(
        formData.borrowers.map(async (borrower) => {
          const updatedBorrower = { ...borrower }

          // Handle existing borrower documents
          if (borrower.documents && Object.keys(borrower.documents).length > 0) {
            const uploadedDocs = {}
            for (const [key, files] of Object.entries(borrower.documents)) {
              if (files && files.length > 0) {
                uploadedDocs[key] = await uploadDocumentsToS3(files)
              }
            }
            updatedBorrower.documents = uploadedDocs
          }

          return updatedBorrower
        }),
      )
    }

    // Upload facility documents
    if (formData.facilities) {
      console.log("Uploading facility documents...")
      uploadedData.facilities = await Promise.all(
        formData.facilities.map(async (facility) => {
          if (facility.documents && facility.documents.length > 0) {
            const uploadedDocs = await uploadDocumentsToS3(facility.documents)
            return { ...facility, documents: uploadedDocs }
          }
          return facility
        }),
      )
    }

    // Upload guarantor documents
    if (formData.guarantors) {
      console.log("Uploading guarantor documents...")
      uploadedData.guarantors = await Promise.all(
        formData.guarantors.map(async (guarantor) => {
          const updatedGuarantor = { ...guarantor }

          // Handle existing guarantor documents
          if (guarantor.documents && Object.keys(guarantor.documents).length > 0) {
            const uploadedDocs = {}
            for (const [key, files] of Object.entries(guarantor.documents)) {
              if (files && files.length > 0) {
                uploadedDocs[key] = await uploadDocumentsToS3(files)
              }
            }
            updatedGuarantor.documents = uploadedDocs
          }

          return updatedGuarantor
        }),
      )
    }

    // NEW: Upload Grounds for Willful Defaulter - Net Worth Documents
    if (formData.groundsForWillfulDefaulter) {
      console.log("Uploading net worth documents...")
      const updatedGrounds = { ...formData.groundsForWillfulDefaulter }

      // Upload borrower net worth documents
      if (updatedGrounds.borrowerNetWorths) {
        updatedGrounds.borrowerNetWorths = await Promise.all(
          updatedGrounds.borrowerNetWorths.map(async (netWorth) => {
            if (netWorth.documents && netWorth.documents.length > 0) {
              const uploadedDocs = await uploadDocumentsToS3(netWorth.documents)
              return { ...netWorth, documents: uploadedDocs }
            }
            return netWorth
          }),
        )
      }

      // Upload guarantor net worth documents
      if (updatedGrounds.guarantorNetWorths) {
        updatedGrounds.guarantorNetWorths = await Promise.all(
          updatedGrounds.guarantorNetWorths.map(async (netWorth) => {
            if (netWorth.documents && netWorth.documents.length > 0) {
              const uploadedDocs = await uploadDocumentsToS3(netWorth.documents)
              return { ...netWorth, documents: uploadedDocs }
            }
            return netWorth
          }),
        )
      }

      uploadedData.groundsForWillfulDefaulter = updatedGrounds
    }

    // Upload diversion of funds documents
    if (formData.diversionOfFunds?.documents && formData.diversionOfFunds.documents.length > 0) {
      console.log("Uploading diversion of funds documents...")
      const uploadedDocs = await uploadDocumentsToS3(formData.diversionOfFunds.documents)
      uploadedData.diversionOfFunds = { ...formData.diversionOfFunds, documents: uploadedDocs }
    }

    // Upload original sanction letter
    if (formData.originalSanctionLetter) {
      console.log("Uploading original sanction letter...")
      const uploadedDoc = await uploadDocumentsToS3([formData.originalSanctionLetter])
      uploadedData.originalSanctionLetter = uploadedDoc[0]
    }

    // Upload siphoning documents
    if (formData.siphoning?.documents && formData.siphoning.documents.length > 0) {
      console.log("Uploading siphoning documents...")
      const uploadedDocs = await uploadDocumentsToS3(formData.siphoning.documents)
      uploadedData.siphoning = { ...formData.siphoning, documents: uploadedDocs }
    }

    // Upload disposal of assets documents
    if (formData.disposalOfAssets?.documents && formData.disposalOfAssets.documents.length > 0) {
      console.log("Uploading disposal of assets documents...")
      const uploadedDocs = await uploadDocumentsToS3(formData.disposalOfAssets.documents)
      uploadedData.disposalOfAssets = { ...formData.disposalOfAssets, documents: uploadedDocs }
    }

    // Upload failure to infuse documents
    if (formData.failureToInfuse?.documents && formData.failureToInfuse.documents.length > 0) {
      console.log("Uploading failure to infuse documents...")
      const uploadedDocs = await uploadDocumentsToS3(formData.failureToInfuse.documents)
      uploadedData.failureToInfuse = { ...formData.failureToInfuse, documents: uploadedDocs }
    }

    // Add metadata using the same pattern as your loan documents module
    uploadedData.submittedAt = new Date() // Use regular Date instead of serverTimestamp for consistency
    uploadedData.status = "pending" // Using your existing status convention
    uploadedData.module = "willful-defaulter"

    console.log("All documents uploaded successfully. Saving to Firestore...")

    // Save to Firebase Firestore using the same "submissions" collection as your loan documents
    // but with module identifier to distinguish willful defaulter submissions
    const docRef = await addDoc(collection(db, "willfulDefaulterSubmissions"), uploadedData)

    console.log("Data saved to Firestore with ID:", docRef.id)

    return {
      success: true,
      id: docRef.id,
      message: "Willful defaulter data saved successfully",
    }
  } catch (error) {
    console.error("Error saving willful defaulter data:", error)
    throw error
  }
}

export const getWillfulDefaulterData = async (filters = {}) => {
  try {
    // Query the same "submissions" collection but filter by module
    let q = collection(db, "willfulDefaulterSubmissions")

    if (filters.branchId) {
      q = query(q, where("branchId", "==", filters.branchId), where("module", "==", "willful-defaulter"))
    }

    if (filters.region) {
      q = query(q, where("region", "==", filters.region), where("module", "==", "willful-defaulter"))
    }

    if (filters.status) {
      q = query(q, where("status", "==", filters.status), where("module", "==", "willful-defaulter"))
    }

    if (filters.submittedByUid) {
      q = query(q, where("submittedByUid", "==", filters.submittedByUid), where("module", "==", "willful-defaulter"))
    }

    q = query(q, orderBy("submittedAt", "desc"))

    const querySnapshot = await getDocs(q)
    const data = []

    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return data
  } catch (error) {
    console.error("Error fetching willful defaulter data:", error)
    throw error
  }
}

// Function to save draft data (no S3 uploads) - separate collection for drafts
export const saveWillfulDefaulterDraft = async (formData) => {
  try {
    const draftData = {
      ...formData,
      status: "draft",
      submittedAt: new Date(),
      updatedAt: new Date(),
      module: "willful-defaulter",
    }

    const docRef = await addDoc(collection(db, "willfulDefaulterDrafts"), draftData)

    return {
      success: true,
      id: docRef.id,
      message: "Draft saved successfully",
    }
  } catch (error) {
    console.error("Error saving draft:", error)
    throw error
  }
}

// Function to get all willful defaulter submissions for admin/dashboard view
export const getAllWillfulDefaulterSubmissions = async () => {
  try {
    console.log("🔍 Fetching all willful defaulter submissions...")
    const q = query(collection(db, "willfulDefaulterSubmissions"), orderBy("submittedAt", "desc"))
    const querySnapshot = await getDocs(q)
    const data = []

    console.log("📊 Query snapshot size:", querySnapshot.size)

    querySnapshot.forEach((doc) => {
      console.log("📄 Document found:", doc.id, doc.data())
      data.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    console.log("✅ Total submissions found:", data.length)
    return data
  } catch (error) {
    console.error("❌ Error fetching all willful defaulter submissions:", error)
    throw error
  }
}

// Function to get willful defaulter submissions by user
export const getWillfulDefaulterSubmissionsByUser = async (userId) => {
  try {
    console.log("🔍 Fetching submissions for user:", userId)
    const q = query(
      collection(db, "willfulDefaulterSubmissions"),
      where("submittedByUid", "==", userId),
      orderBy("submittedAt", "desc"),
    )
    const querySnapshot = await getDocs(q)
    const data = []

    console.log("📊 User query snapshot size:", querySnapshot.size)

    querySnapshot.forEach((doc) => {
      console.log("📄 User document found:", doc.id, doc.data())
      data.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    console.log("✅ User submissions found:", data.length)
    return data
  } catch (error) {
    console.error("❌ Error fetching user willful defaulter submissions:", error)
    throw error
  }
}

// Function to get willful defaulter submissions by status
export const getWillfulDefaulterSubmissionsByStatus = async (status) => {
  try {
    console.log("🔍 Fetching submissions with status:", status)
    const q = query(
      collection(db, "willfulDefaulterSubmissions"),
      where("status", "==", status),
      orderBy("submittedAt", "desc"),
    )
    const querySnapshot = await getDocs(q)
    const data = []

    console.log("📊 Status query snapshot size:", querySnapshot.size)

    querySnapshot.forEach((doc) => {
      console.log("📄 Status document found:", doc.id, doc.data())
      data.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    console.log("✅ Status submissions found:", data.length)
    return data
  } catch (error) {
    console.error("❌ Error fetching willful defaulter submissions by status:", error)
    throw error
  }
}

// NEW: Function to get a single willful defaulter submission by ID
export const getWillfulDefaulterSubmissionById = async (submissionId) => {
  try {
    console.log("🔍 Fetching submission by ID:", submissionId)
    const docRef = doc(db, "willfulDefaulterSubmissions", submissionId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("✅ Submission found:", docSnap.data())
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    } else {
      console.log("❌ No submission found with ID:", submissionId)
      return null
    }
  } catch (error) {
    console.error("❌ Error fetching submission by ID:", error)
    throw error
  }
}

// Test function to check Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log("🧪 Testing Firebase connection...")
    const testQuery = query(collection(db, "willfulDefaulterSubmissions"))
    const snapshot = await getDocs(testQuery)
    console.log("✅ Firebase connection successful. Documents found:", snapshot.size)

    // Log all document IDs
    snapshot.forEach((doc) => {
      console.log("📄 Document ID:", doc.id)
    })

    return true
  } catch (error) {
    console.error("❌ Firebase connection failed:", error)
    return false
  }
}
