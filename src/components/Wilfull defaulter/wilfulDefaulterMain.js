"use client"

import { useState } from "react"
import { saveWillfulDefaulterData, saveWillfulDefaulterDraft } from "../..//utils/willfulDefaulterService"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"

// Credit facilities list (same as loan documents module)
const creditFacilities = [
  "Cash Credit",
  "Overdraft",
  "Term Loan",
  "Working Capital Term Loan",
  "Equipment Finance",
  "Vehicle Loan",
  "Home Loan",
  "Personal Loan",
  "Education Loan",
  "Gold Loan",
  "Loan Against Property",
  "Trade Finance",
  "Letter of Credit",
  "Secured Packing Credits",
  "Export Credit",
  "Import Finance",
  "Bill Discounting",
  "Factoring",
  "Supply Chain Finance",
  "MSME Loans",
]

const constitutionTypes = ["Individual", "Partnership firm", "LLP", "Trust", "HUF", "Society", "Company", "Other"]

const diversionOptions = ["Yes - Confirmed", "No - Not Found", "Under Investigation", "Suspected", "Partial Diversion"]

export default function WillfulDefaulterForm({ userId = "default-user", bankId = "default-bank" }) {
  // Basic form fields
  const [branchName, setBranchName] = useState("")
  const [branchId, setBranchId] = useState("")
  const [region, setRegion] = useState("")
  const [zone, setZone] = useState("")

  // Borrowers
  const [borrowers, setBorrowers] = useState([{ id: "1", constitution: "", name: "", documents: [] }])

  // Facilities
  const [facilities, setFacilities] = useState([{ id: "1", type: "", amount: "", documents: [] }])

  // Documents and dates
  const [originalSanctionLetter, setOriginalSanctionLetter] = useState(null)
  const [lastRenewalDate, setLastRenewalDate] = useState("")
  const [npaDate, setNpaDate] = useState("")
  const [outstanding, setOutstanding] = useState("")

  // Guarantors
  const [guarantors, setGuarantors] = useState([{ id: "1", constitution: "", name: "", documents: [] }])

  // Diversion and other sections
  const [diversionOfFunds, setDiversionOfFunds] = useState("")
  const [siphoning, setSiphoning] = useState({ remarks: "", documents: [] })
  const [disposalOfAssets, setDisposalOfAssets] = useState({ remarks: "", documents: [] })
  const [failureToInfuse, setFailureToInfuse] = useState({ remarks: "", documents: [] })

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const { currentUser } = useAuth()
  const history = useHistory()

  // Helper functions
  const addBorrower = () => {
    setBorrowers([...borrowers, { id: Date.now().toString(), constitution: "", name: "", documents: [] }])
  }

  const removeBorrower = (id) => {
    setBorrowers(borrowers.filter((b) => b.id !== id))
  }

  const updateBorrower = (id, field, value) => {
    setBorrowers(borrowers.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const addFacility = () => {
    setFacilities([...facilities, { id: Date.now().toString(), type: "", amount: "", documents: [] }])
  }

  const removeFacility = (id) => {
    setFacilities(facilities.filter((f) => f.id !== id))
  }

  const updateFacility = (id, field, value) => {
    setFacilities(facilities.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

  const addGuarantor = () => {
    setGuarantors([...guarantors, { id: Date.now().toString(), constitution: "", name: "", documents: [] }])
  }

  const removeGuarantor = (id) => {
    setGuarantors(guarantors.filter((g) => g.id !== id))
  }

  const updateGuarantor = (id, field, value) => {
    setGuarantors(guarantors.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      setSubmitStatus({
        type: "error",
        message: "You must be logged in to submit documents.",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const willfulDefaulterData = {
        branchName,
        branchId,
        region,
        zone,
        borrowers,
        facilities,
        originalSanctionLetter,
        lastRenewalDate,
        npaDate,
        outstanding,
        guarantors,
        diversionOfFunds,
        siphoning,
        disposalOfAssets,
        failureToInfuse,
        // Add user authentication data like in your loan documents module
        submittedBy: currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Unknown User"),
        submittedByUid: currentUser.uid,
        userId: currentUser.uid,
      }

      console.log("Submitting willful defaulter data...")

      // Save to Firebase with S3 uploads
      const result = await saveWillfulDefaulterData(willfulDefaulterData)

      setSubmitStatus({
        type: "success",
        message: `Willful defaulter data submitted successfully! Reference ID: ${result.id}`,
      })

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        history.push("/dashboard") // Redirect to your existing dashboard
      }, 2000) // 2 second delay to show success message

      // Reset form after successful submission
      // setTimeout(() => {
      //   window.location.reload()
      // }, 3000)
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus({
        type: "error",
        message: `Failed to submit data: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      const draftData = {
        branchName,
        branchId,
        region,
        zone,
        borrowers,
        facilities,
        originalSanctionLetter,
        lastRenewalDate,
        npaDate,
        outstanding,
        guarantors,
        diversionOfFunds,
        siphoning,
        disposalOfAssets,
        failureToInfuse,
      }

      const result = await saveWillfulDefaulterDraft(draftData)

      setSubmitStatus({
        type: "success",
        message: `Draft saved successfully! Draft ID: ${result.id}`,
      })

      setTimeout(() => setSubmitStatus(null), 3000)
    } catch (error) {
      console.error("Draft save error:", error)
      setSubmitStatus({
        type: "error",
        message: "Failed to save draft",
      })
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>Willful Defaulter Module</h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Complete the form below to process willful defaulter documentation
            </p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {submitStatus && (
              <div
                style={{
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  borderRadius: "6px",
                  border: `1px solid ${submitStatus.type === "success" ? "#10b981" : "#ef4444"}`,
                  backgroundColor: submitStatus.type === "success" ? "#ecfdf5" : "#fef2f2",
                  color: submitStatus.type === "success" ? "#065f46" : "#991b1b",
                }}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Top Row - Branch Details */}
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Branch Name</label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Enter branch name"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Branch ID</label>
                  <input
                    type="text"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    placeholder="Enter branch ID"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Region</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="Enter region"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Zone</label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Enter zone"
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Borrowers Section */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", margin: 0 }}>Borrower(s)</h3>
                  <button
                    type="button"
                    onClick={addBorrower}
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
                    + Add Borrower
                  </button>
                </div>
                {borrowers.map((borrower, index) => (
                  <div
                    key={borrower.id}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Constitution
                        </label>
                        <select
                          value={borrower.constitution}
                          onChange={(e) => updateBorrower(borrower.id, "constitution", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        >
                          <option value="">Select constitution</option>
                          {constitutionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name</label>
                        <input
                          type="text"
                          value={borrower.name}
                          onChange={(e) => updateBorrower(borrower.id, "name", e.target.value)}
                          placeholder="Enter borrower name"
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Documents</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={(e) => updateBorrower(borrower.id, "documents", Array.from(e.target.files || []))}
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "0.875rem",
                            }}
                          />
                          {borrowers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBorrower(borrower.id)}
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Facilities Section */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", margin: 0 }}>Facilities</h3>
                  <button
                    type="button"
                    onClick={addFacility}
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
                    + Add Facility
                  </button>
                </div>
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Facility Type
                        </label>
                        <select
                          value={facility.type}
                          onChange={(e) => updateFacility(facility.id, "type", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        >
                          <option value="">Select facility type</option>
                          {creditFacilities.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Amount</label>
                        <input
                          type="text"
                          value={facility.amount}
                          onChange={(e) => updateFacility(facility.id, "amount", e.target.value)}
                          placeholder="Enter amount"
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Documents</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={(e) => updateFacility(facility.id, "documents", Array.from(e.target.files || []))}
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "0.875rem",
                            }}
                          />
                          {facilities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFacility(facility.id)}
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Document and Date Fields */}
              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}
              >
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Original Sanction Letter
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setOriginalSanctionLetter(e.target.files?.[0] || null)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Outstanding</label>
                  <select
                    value={outstanding}
                    onChange={(e) => setOutstanding(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="">Select outstanding type</option>
                    {creditFacilities.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Last Renewal Date
                  </label>
                  <input
                    type="date"
                    value={lastRenewalDate}
                    onChange={(e) => setLastRenewalDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>NPA Date</label>
                  <input
                    type="date"
                    value={npaDate}
                    onChange={(e) => setNpaDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Guarantors Section */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", margin: 0 }}>Guarantor(s)</h3>
                  <button
                    type="button"
                    onClick={addGuarantor}
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
                    + Add Guarantor
                  </button>
                </div>
                {guarantors.map((guarantor) => (
                  <div
                    key={guarantor.id}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Constitution
                        </label>
                        <select
                          value={guarantor.constitution}
                          onChange={(e) => updateGuarantor(guarantor.id, "constitution", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        >
                          <option value="">Select constitution</option>
                          {constitutionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name</label>
                        <input
                          type="text"
                          value={guarantor.name}
                          onChange={(e) => updateGuarantor(guarantor.id, "name", e.target.value)}
                          placeholder="Enter guarantor name"
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Documents</label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={(e) =>
                              updateGuarantor(guarantor.id, "documents", Array.from(e.target.files || []))
                            }
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              fontSize: "0.875rem",
                            }}
                          />
                          {guarantors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeGuarantor(guarantor.id)}
                              style={{
                                padding: "0.5rem",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Diversion of Funds */}
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                  Diversion of Funds
                </label>
                <select
                  value={diversionOfFunds}
                  onChange={(e) => setDiversionOfFunds(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="">Select diversion status</option>
                  {diversionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Siphoning of Funds */}
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Siphoning of Funds</h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Remarks</label>
                    <textarea
                      value={siphoning.remarks}
                      onChange={(e) => setSiphoning({ ...siphoning, remarks: e.target.value })}
                      placeholder="Enter remarks about siphoning of funds"
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => setSiphoning({ ...siphoning, documents: Array.from(e.target.files || []) })}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Disposal of Assets */}
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Disposal of Assets</h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Remarks</label>
                    <textarea
                      value={disposalOfAssets.remarks}
                      onChange={(e) => setDisposalOfAssets({ ...disposalOfAssets, remarks: e.target.value })}
                      placeholder="Enter remarks about disposal of assets"
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) =>
                        setDisposalOfAssets({ ...disposalOfAssets, documents: Array.from(e.target.files || []) })
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Failure to Infuse Capital */}
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
                  Failure to Infuse Capital
                </h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Remarks</label>
                    <textarea
                      value={failureToInfuse.remarks}
                      onChange={(e) => setFailureToInfuse({ ...failureToInfuse, remarks: e.target.value })}
                      placeholder="Enter remarks about failure to infuse capital"
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) =>
                        setFailureToInfuse({ ...failureToInfuse, documents: Array.from(e.target.files || []) })
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "white",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: isSubmitting ? "#9ca3af" : "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
