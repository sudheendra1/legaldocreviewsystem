# Activity Logging System Documentation

## Overview

The activity logging system tracks all reviewer activities and displays them in the dashboard with role-based filtering:
- **Admin**: Sees all reviewer activities across the system
- **Reviewer**: Sees only their own activities
- **User**: No access to the activities section

## Components

### 1. Activity Service (`activityService.js`)
Core service for managing activities in Firestore.

#### Functions:

**logActivity(userId, userName, userRole, activityType, description, relatedDocId, status)**
- Logs a new activity to the database
- Parameters:
  - `userId`: Firebase UID
  - `userName`: Display name of the user
  - `userRole`: User role (review, admin, user)
  - `activityType`: Type of activity (document_upload, review_submitted, status_updated, etc.)
  - `description`: Human-readable description
  - `relatedDocId`: Optional document ID related to the activity
  - `status`: Activity status (new, update, completed, urgent, pending)

**getAllActivities(limitCount)**
- Retrieves all reviewer activities for admin users
- Parameters:
  - `limitCount`: Number of activities to fetch (default: 10)
- Returns: Array of activity objects

**getReviewerActivities(userId, limitCount)**
- Retrieves activities for a specific reviewer
- Parameters:
  - `userId`: Firebase UID of the reviewer
  - `limitCount`: Number of activities to fetch (default: 10)
- Returns: Array of activity objects

**formatActivityTime(date)**
- Converts timestamp to human-readable format
- Returns: String like "5 minutes ago", "2 hours ago", etc.

**getActivityIcon(activityType)**
- Returns appropriate emoji icon for activity type
- Useful for UI display

### 2. Recent Activities Component (`RecentActivities.js`)
React component that displays activities with auto-refresh every 30 seconds.

#### Props:
- `userRole`: User's role (admin, review, user)
- `userId`: User's Firebase UID

#### Features:
- Auto-fetches activities based on user role
- Shows loading state with spinner
- Shows error messages if fetch fails
- Displays activity timestamp, description, and status
- For admin: Shows reviewer name for each activity
- Auto-refreshes every 30 seconds

### 3. Activity Logging Hook (`useActivityLog.js`)
Custom React hook for easy activity logging throughout the app.

#### Usage:
```javascript
import { useActivityLog } from '../hooks/useActivityLog'

function MyComponent() {
  const logActivity = useActivityLog()

  const handleDocumentUpload = async () => {
    // ... upload logic ...
    logActivity(
      'document_upload',
      'Document uploaded for review',
      documentId,
      'new'
    )
  }

  return <button onClick={handleDocumentUpload}>Upload</button>
}
```

## Firestore Schema

### Activities Collection
```
{
  userId: string,          // Firebase UID of the user
  userName: string,        // Display name of the user
  userRole: string,        // "review", "admin", "user"
  activityType: string,    // Type of activity
  description: string,     // Human-readable description
  relatedDocId: string,    // Optional document ID
  status: string,          // "new", "update", "completed", "urgent", "pending"
  timestamp: Timestamp,    // Firestore server timestamp
  createdAt: string        // ISO string backup timestamp
}
```

## Activity Types

Common activity types to use:
- `document_upload`: Document uploaded for review
- `review_submitted`: Review submitted
- `status_updated`: Document status changed
- `document_approved`: Document approved
- `document_rejected`: Document rejected
- `litigation_created`: Litigation case created
- `training_completed`: Training module completed

## Status Types

- `new`: New activity/document
- `update`: General update
- `completed`: Task completed
- `urgent`: Urgent/alert activity
- `pending`: Pending status

## Integration Examples

### In ReviewDocumentsList Component
```javascript
import { useActivityLog } from '../hooks/useActivityLog'

function ReviewDocumentsList() {
  const logActivity = useActivityLog()

  const handleDocumentApproved = async (docId) => {
    // ... approval logic ...
    logActivity('document_approved', `Document ${docId} approved`, docId, 'completed')
  }
}
```

### In Document Upload Component
```javascript
const handleUpload = async (file) => {
  // ... upload logic ...
  logActivity('document_upload', `New document uploaded: ${file.name}`, null, 'new')
}
```

### In Litigation Component
```javascript
const createLitigationCase = async (caseData) => {
  // ... create case logic ...
  logActivity('litigation_created', `New litigation case created: ${caseData.caseNumber}`, null, 'update')
}
```

## Dashboard Integration

The Recent Activities section is automatically displayed in the Dashboard for:
- **Admin users**: Shows all reviewer activities
- **Reviewer users**: Shows only their activities

The component is conditionally rendered only for these roles:
```javascript
{(role === "admin" || role === "review") && (
  <RecentActivities userRole={role} userId={currentUser?.uid} />
)}
```

## Notes

- Activities are automatically timestamp-ordered from newest to oldest
- The component auto-refreshes every 30 seconds to show latest activities
- Activities are persisted in Firestore for permanent record-keeping
- Admin can see who performed what action through the userName field
- All timestamps are converted to relative time format (e.g., "2 hours ago")
