"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import {
  getAllWillfulDefaulterSubmissions,
  getWillfulDefaulterSubmissionsByUser,
  getWillfulDefaulterSubmissionsByStatus,
  testFirebaseConnection, // Add this import
} from "../../utils/willfulDefaulterService"

export default function WillfulDefaulterDashboard() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, pending, approved, rejected
  const [viewMode, setViewMode] = useState("all") // all, mySubmissions
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { currentUser } = useAuth()
  const history = useHistory()

  useEffect(() => {
    fetchSubmissions()
  }, [filter, viewMode, currentUser,currentPage])

  const fetchSubmissions = async () => {
    setLoading(true)
    try {
      console.log("🔄 Dashboard: Starting to fetch submissions...")
      console.log("🔄 Current user:", currentUser?.uid)
      console.log("🔄 View mode:", viewMode)
      console.log("🔄 Filter:", filter)

      let data = []

      if (viewMode === "mySubmissions" && currentUser) {
        console.log("🔄 Fetching user submissions...")
        data = await getWillfulDefaulterSubmissionsByUser(currentUser.uid,currentPage, pageSize)
      } else if (filter === "all") {
        console.log("🔄 Fetching all submissions...")
        data = await getAllWillfulDefaulterSubmissions(currentPage, pageSize)
      } else {
        console.log("🔄 Fetching submissions by status...")
        data = await getWillfulDefaulterSubmissionsByStatus(filter)
      }

      console.log("✅ Dashboard: Fetched data:", data)
      setSubmissions(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error("❌ Dashboard: Error fetching submissions:", error)
      // Add error state to show user
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b"
      case "approved":
        return "#10b981"
      case "rejected":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    if (date.toDate) {
      return date.toDate().toLocaleDateString()
    }
    return new Date(date).toLocaleDateString()
  }

  const handleTestConnection = async () => {
    console.log("🧪 Testing Firebase connection from dashboard...")
    await testFirebaseConnection()
  }

  const handleViewDetails = (submissionId) => {
    history.push(`/willful-defaulter-details/${submissionId}`)
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
              Willful Defaulter Submissions Dashboard
            </h1>

            {/* Filters */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>View Mode</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="all">All Submissions</option>
                  <option value="mySubmissions">My Submissions</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Status Filter</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "end" }}>
                <button
                  onClick={fetchSubmissions}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Refresh
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "end" }}>
                <button
                  onClick={handleTestConnection}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    marginLeft: "0.5rem",
                  }}
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div
                  style={{
                    display: "inline-block",
                    width: "32px",
                    height: "32px",
                    border: "3px solid #f3f4f6",
                    borderTop: "3px solid #3b82f6",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>No willful defaulter submissions found.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Submission ID
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Branch
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Region
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Submitted By
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Date</th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Status
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "0.75rem" }}>
                          <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                            {submission.id.substring(0, 8)}...
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <div>
                            <div style={{ fontWeight: "500" }}>{submission.branchName}</div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>ID: {submission.branchId}</div>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <div>
                            <div>{submission.region}</div>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Zone: {submission.zone}</div>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem" }}>{submission.submittedBy}</td>
                        <td style={{ padding: "0.75rem" }}>{formatDate(submission.submittedAt)}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              backgroundColor: `${getStatusColor(submission.status)}20`,
                              color: getStatusColor(submission.status),
                            }}
                          >
                            {submission.status?.charAt(0).toUpperCase() + submission.status?.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: "0.75rem" }}>
                          <button
                            onClick={() => handleViewDetails(submission.id)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              backgroundColor: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
    <button 
        className="btn btn-secondary"
        disabled={currentPage === 0} 
        onClick={() => setCurrentPage(prev => prev - 1)}
    >
        Previous
    </button>

    <span>
        Page {currentPage + 1} of {totalPages === 0 ? 1 : totalPages}
    </span>

    <button 
        className="btn btn-secondary"
        disabled={currentPage >= totalPages - 1} 
        onClick={() => setCurrentPage(prev => prev + 1)}
    >
        Next
    </button>
</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
