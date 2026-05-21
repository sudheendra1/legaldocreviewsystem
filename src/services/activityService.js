import { db } from "../firebase/config"
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  limit,
} from "firebase/firestore"

const ACTIVITIES_COLLECTION = "activities"

/**
 * Log a new activity
 * @param {string} userId - ID of the user performing the action
 * @param {string} userName - Name of the user
 * @param {string} userRole - Role of the user (review, admin, user)
 * @param {string} activityType - Type of activity (document_upload, review_submitted, status_updated, etc.)
 * @param {string} description - Description of the activity
 * @param {string} relatedDocId - ID of related document (optional)
 * @param {string} status - Status of the activity (new, update, completed, urgent, pending)
 */
export const logActivity = async (
  userId,
  userName,
  userRole,
  activityType,
  description,
  relatedDocId = null,
  status = "update"
) => {
  try {
    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
      userId,
      userName,
      userRole,
      activityType,
      description,
      relatedDocId,
      status,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    })
    console.log("[v0] Activity logged with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("[v0] Error logging activity:", error)
    throw error
  }
}

/**
 * Get all activities for admin (all reviewer activities)
 * @param {number} limitCount - Number of activities to fetch
 */
export const getAllActivities = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where("userRole", "==", "review"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    const activities = []
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(doc.data().createdAt),
      })
    })
    return activities
  } catch (error) {
    console.error("[v0] Error fetching all activities:", error)
    return []
  }
}

/**
 * Get activities for a specific reviewer
 * @param {string} userId - ID of the reviewer
 * @param {number} limitCount - Number of activities to fetch
 */
export const getReviewerActivities = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where("userId", "==", userId),
      where("userRole", "==", "review"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    )
    const querySnapshot = await getDocs(q)
    const activities = []
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(doc.data().createdAt),
      })
    })
    return activities
  } catch (error) {
    console.error("[v0] Error fetching reviewer activities:", error)
    return []
  }
}

/**
 * Format timestamp to human-readable format
 */
export const formatActivityTime = (date) => {
  if (!date) return "Just now"

  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`

  return date.toLocaleDateString()
}

/**
 * Get activity icon based on activity type
 */
export const getActivityIcon = (activityType) => {
  const icons = {
    document_upload: "📄",
    review_submitted: "✓",
    status_updated: "⚡",
    document_approved: "✓",
    document_rejected: "✗",
    litigation_created: "⚖️",
    training_completed: "🎓",
    default: "📋",
  }
  return icons[activityType] || icons.default
}
