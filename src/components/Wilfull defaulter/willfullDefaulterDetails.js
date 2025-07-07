"use client"

import { useState, useEffect } from "react"
import { useParams, useHistory, Link } from "react-router-dom"
import { getWillfulDefaulterSubmissionById } from "../../utils/willfulDefaulterService"

export default function WillfulDefaulterDetails() {
  const { id } = useParams()
  const history = useHistory()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubmissionDetails()
  }, [id])

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true)
      const data = await getWillfulDefaulterSubmissionById(id)
      if (data) {
        setSubmission(data)
      } else {
        setError("Submission not found")
      }
    } catch (err) {
      console.error("Error fetching submission details:", err)
      setError("Failed to load submission details")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    if (date.toDate) {
      return date.toDate().toLocaleDateString()
    }
    return new Date(date).toLocaleDateString()
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

  const DocumentList = ({ documents, title }) => {
    if (!documents || documents.length === 0) {
      return (
        <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
          <p style={{ color: "#6b7280", margin: 0 }}>No {title.toLowerCase()} uploaded</p>
        </div>
      )
    }

    return (
      <div style={{ padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
        <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: "600" }}>{title}</h4>
        {documents.map((doc, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3b82f6",
                textDecoration: "none",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📄 {doc.name}
              <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>({(doc.size / 1024 / 1024).toFixed(2)} MB)</span>
            </a>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "2rem", textAlign: "center" }}>
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
              <p style={{ marginTop: "1rem", color: "#6b7280" }}>Loading submission details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "#ef4444", fontSize: "1.125rem", marginBottom: "1rem" }}>{error}</p>
              <button
                onClick={() => history.goBack()}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {/* Header */}
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}
            >
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                Willful Defaulter Submission Details
              </h1>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => history.goBack()}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#6b7280",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  ← Back
                </button>
                <Link
                  to="/willFullDefaulterDashboard"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  Dashboard
                </Link>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Submission ID</p>
                <p style={{ margin: 0, fontFamily: "monospace", fontSize: "0.875rem" }}>{submission.id}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Status</p>
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
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Submitted Date</p>
                <p style={{ margin: 0, fontSize: "0.875rem" }}>{formatDate(submission.submittedAt)}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Submitted By</p>
                <p style={{ margin: 0, fontSize: "0.875rem" }}>{submission.submittedBy}</p>
              </div>
            </div>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {/* Branch Information */}
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                Branch Information
              </h2>
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Branch Name</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "500" }}>{submission.branchName}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Branch ID</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "500" }}>{submission.branchId}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Region</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "500" }}>{submission.region}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Zone</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "500" }}>{submission.zone}</p>
                </div>
              </div>
            </section>

            {/* Borrowers */}
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                Borrower(s)
              </h2>
              {submission.borrowers?.map((borrower, index) => (
                <div
                  key={borrower.id}
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Borrower {index + 1}</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Constitution</p>
                      <p style={{ margin: 0, fontSize: "0.875rem" }}>{borrower.constitution}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Name</p>
                      <p style={{ margin: 0, fontSize: "0.875rem" }}>{borrower.name}</p>
                    </div>
                  </div>
                  <DocumentList documents={borrower.documents} title="Borrower Documents" />
                </div>
              ))}
            </section>

            {/* Facilities */}
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                Facilities
              </h2>
              {submission.facilities?.map((facility, index) => (
                <div
                  key={facility.id}
                  style={{
                    padding: "1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Facility {index + 1}</h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Type</p>
                      <p style={{ margin: 0, fontSize: "0.875rem" }}>{facility.type}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Amount</p>
                      <p style={{ margin: 0, fontSize: "0.875rem" }}>{facility.amount}</p>
                    </div>
                  </div>
                  <DocumentList documents={facility.documents} title="Facility Documents" />
                </div>
              ))}
            </section>

            {/* Loan Details */}
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                Loan Details
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Outstanding</p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{submission.outstanding || "N/A"}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Last Renewal Date</p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{submission.lastRenewalDate || "N/A"}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>VPA Date</p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{submission.vpaDate || "N/A"}</p>
                </div>
              </div>
              {submission.originalSanctionLetter && (
                <DocumentList documents={[submission.originalSanctionLetter]} title="Original Sanction Letter" />
              )}
            </section>

            {/* Guarantors */}
            {submission.guarantors && submission.guarantors.length > 0 && (
              <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                  Guarantor(s)
                </h2>
                {submission.guarantors.map((guarantor, index) => (
                  <div
                    key={guarantor.id}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                      Guarantor {index + 1}
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Constitution</p>
                        <p style={{ margin: 0, fontSize: "0.875rem" }}>{guarantor.constitution}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Name</p>
                        <p style={{ margin: 0, fontSize: "0.875rem" }}>{guarantor.name}</p>
                      </div>
                    </div>
                    <DocumentList documents={guarantor.documents} title="Guarantor Documents" />
                  </div>
                ))}
              </section>
            )}

            {/* Diversion Analysis */}
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                Diversion Analysis
              </h2>
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Diversion of Funds</p>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: "500" }}>
                  {submission.diversionOfFunds || "Not specified"}
                </p>
              </div>

              {/* Siphoning of Funds */}
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Siphoning of Funds</h3>
                <div style={{ marginBottom: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Remarks</p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>
                    {submission.siphoning?.remarks || "No remarks provided"}
                  </p>
                </div>
                <DocumentList documents={submission.siphoning?.documents} title="Siphoning Documents" />
              </div>

              {/* Disposal of Assets */}
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>Disposal of Assets</h3>
                <div style={{ marginBottom: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Remarks</p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>
                    {submission.disposalOfAssets?.remarks || "No remarks provided"}
                  </p>
                </div>
                <DocumentList documents={submission.disposalOfAssets?.documents} title="Disposal Documents" />
              </div>

              {/* Failure to Infuse Capital */}
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                  Failure to Infuse Capital
                </h3>
                <div style={{ marginBottom: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Remarks</p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>
                    {submission.failureToInfuse?.remarks || "No remarks provided"}
                  </p>
                </div>
                <DocumentList documents={submission.failureToInfuse?.documents} title="Capital Infusion Documents" />
              </div>
            </section>
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
