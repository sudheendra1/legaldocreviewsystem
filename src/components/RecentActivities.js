import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material"
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { getAllActivities, getReviewerActivities, formatActivityTime } from "../services/activityService"

const getActivityIcon = (activityType) => {
  switch (activityType) {
    case "document_upload":
      return <FileText size={24} color="#1976d2" />
    case "review_submitted":
      return <CheckCircle size={24} color="#4caf50" />
    case "status_updated":
      return <AlertCircle size={24} color="#ff9800" />
    case "document_approved":
      return <CheckCircle size={24} color="#4caf50" />
    case "document_rejected":
      return <AlertCircle size={24} color="#f44336" />
    default:
      return <FileText size={24} color="#1976d2" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "new":
      return "success"
    case "update":
      return "info"
    case "completed":
      return "success"
    case "urgent":
      return "error"
    case "pending":
      return "warning"
    default:
      return "default"
  }
}

const getStatusLabel = (status) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Update"
}

function RecentActivities({ userRole, userId }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        let data = []

        if (userRole === "admin") {
          // For admin, show all reviewer activities
          data = await getAllActivities(10)
        } else if (userRole === "review") {
          // For reviewer, show only their activities
          data = await getReviewerActivities(userId, 10)
        }

        setActivities(data)
      } catch (err) {
        console.error("[v0] Error fetching activities:", err)
        setError("Failed to load activities")
      } finally {
        setLoading(false)
      }
    }

    if (userRole && userId) {
      fetchActivities()
    }

    // Refresh activities every 30 seconds
    const interval = setInterval(fetchActivities, 30000)
    return () => clearInterval(interval)
  }, [userRole, userId])

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Recent Activities
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && activities.length === 0 && (
          <Alert severity="info">
            {userRole === "admin"
              ? "No reviewer activities yet"
              : "No activities to display"}
          </Alert>
        )}

        {!loading && activities.length > 0 && (
          <List>
            {activities.map((activity, index) => (
              <Box key={activity.id || index}>
                <ListItem
                  sx={{
                    py: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getActivityIcon(activity.activityType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" fontWeight="500">
                          {activity.description}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatActivityTime(activity.timestamp)}
                        </Typography>
                        {userRole === "admin" && activity.userName && (
                          <Typography variant="caption" color="text.secondary">
                            by {activity.userName}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <Chip
                    label={getStatusLabel(activity.status)}
                    color={getStatusColor(activity.status)}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 2 }}
                  />
                </ListItem>
                {index < activities.length - 1 && (
                  <Box
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  />
                )}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivities
