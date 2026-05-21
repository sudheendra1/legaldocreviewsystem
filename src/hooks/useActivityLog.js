import { useCallback } from "react"
import { logActivity } from "../services/activityService"
import { useAuth } from "../contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"

/**
 * Hook to log activities for the current user
 * Usage: const logUserActivity = useActivityLog()
 *        logUserActivity("document_upload", "Document uploaded for review", docId, "new")
 */
export const useActivityLog = () => {
  const { currentUser } = useAuth()

  const logUserActivity = useCallback(
    async (activityType, description, relatedDocId = null, status = "update") => {
      if (!currentUser) {
        console.warn("[v0] No current user for activity logging")
        return
      }

      try {
        // Get user role
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        const userData = userDoc.data()
        const userRole = userData?.role || "user"
        const userName = userData?.displayName || currentUser.email?.split("@")[0] || "Unknown"

        // Log the activity
        await logActivity(
          currentUser.uid,
          userName,
          userRole,
          activityType,
          description,
          relatedDocId,
          status
        )
      } catch (error) {
        console.error("[v0] Error logging activity:", error)
      }
    },
    [currentUser]
  )

  return logUserActivity
}

export default useActivityLog
