"use client"

import { useState, useEffect } from "react"
import { saveWillfulDefaulterData, saveWillfulDefaulterDraft } from "../../utils/willfulDefaulterService"
import { useAuth } from "../../contexts/AuthContext"
import { useHistory } from "react-router-dom"

const creditFacilities = ["Cash Credit", "Term Loan"]

const constitutionTypes = ["Individual", "Partnership firm", "LLP", "Trust", "HUF", "Society", "Company", "Other"]

const diversionOptions = ["utilisation of short-term working capital funds for long-term purposes not in conformity with the terms of sanction of credit facility",
   "deploying funds availed using credit facility for the creation of assets other than those for which the credit was sanctioned", 
   "transferring funds availed using credit facility to the subsidiaries/group companies or other entities, by whatever modality, without approval of the lender/  all the lenders in the consortium", 
   "routing of funds through any lender other than the lender or members of consortium without prior written permission of the lender or all the lenders of consortium", 
   "investing funds availed using credit facility in other companies/entities by way of acquiring equities/debt instruments without the approval of lender or all the lenders of consortium",
  "shortfall in the deployment of funds vis-à-vis the amounts disbursed/ drawn under the credit facility and the difference not being accounted for"]

export default function WillfulDefaulterForm({ userId = "default-user", bankId = "default-bank" }) {
  const [branchName, setBranchName] = useState("")
  const [branchId, setBranchId] = useState("")
  const [region, setRegion] = useState("")
  const [zone, setZone] = useState("")

  const [borrowers, setBorrowers] = useState([
    {
      id: "1",
      constitution: "",
      formData: {},
      documents: {},
    },
  ])

  const [facilities, setFacilities] = useState([{ id: "1", type: "", amount: "", documents: [] }])

  const [originalSanction, setOriginalSanction] = useState({ number: "", date: "" })
  const [lastRenewal, setLastRenewal] = useState({ number: "", date: "" })
  const [npaDate, setNpaDate] = useState("")
  const [outstanding, setOutstanding] = useState({ outstanding: "", amount: "", date: "" })

  const [guarantors, setGuarantors] = useState([
    {
      id: "1",
      constitution: "",
      formData: {},
      documents: {},
    },
  ])

  const [groundsForWillfulDefaulter, setGroundsForWillfulDefaulter] = useState({
    borrowerNetWorths: [],
    guarantorNetWorths: [],
  })

  
  const [diversionOfFunds, setDiversionOfFunds] = useState({ status: "", remarks: "", documents: [] })
  const [siphoning, setSiphoning] = useState({ remarks: "", documents: [] })
  const [disposalOfAssets, setDisposalOfAssets] = useState({ remarks: "", documents: [] })
  const [failureToInfuse, setFailureToInfuse] = useState({ remarks: "", documents: [] })

  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const { currentUser } = useAuth()
  const history = useHistory()

  
  const addBorrower = () => {
    const newBorrowerId = Date.now().toString()
    setBorrowers([
      ...borrowers,
      {
        id: newBorrowerId,
        constitution: "",
        formData: {},
        documents: {},
      },
    ])

    
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      borrowerNetWorths: [
        ...prev.borrowerNetWorths,
        {
          id: newBorrowerId,
          netWorthAmount: "",
          netWorthDate: "",
          documents: [],
        },
      ],
    }))
  }

  const removeBorrower = (id) => {
    setBorrowers(borrowers.filter((b) => b.id !== id))

    
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      borrowerNetWorths: prev.borrowerNetWorths.filter((item) => item.id !== id),
    }))
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
    const newGuarantorId = Date.now().toString()
    setGuarantors([
      ...guarantors,
      {
        id: newGuarantorId,
        constitution: "",
        formData: {},
        documents: {},
      },
    ])

    
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      guarantorNetWorths: [
        ...prev.guarantorNetWorths,
        {
          id: newGuarantorId,
          netWorthAmount: "",
          netWorthDate: "",
          documents: [],
        },
      ],
    }))
  }

  const removeGuarantor = (id) => {
    setGuarantors(guarantors.filter((g) => g.id !== id))

  
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      guarantorNetWorths: prev.guarantorNetWorths.filter((item) => item.id !== id),
    }))
  }

  const updateGuarantor = (id, field, value) => {
    setGuarantors(guarantors.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
  }

  const updateGuarantorFormData = (id, field, value) => {
    setGuarantors(guarantors.map((g) => (g.id === id ? { ...g, formData: { ...g.formData, [field]: value } } : g)))
  }

  const updateGuarantorDocument = (id, field, files) => {
    setGuarantors(
      guarantors.map((g) => (g.id === id ? { ...g, documents: { ...g.documents, [field]: Array.from(files) } } : g)),
    )
  }

  
  const updateBorrowerNetWorth = (borrowerId, field, value) => {
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      borrowerNetWorths: prev.borrowerNetWorths.map((item) =>
        item.id === borrowerId ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const updateGuarantorNetWorth = (guarantorId, field, value) => {
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      guarantorNetWorths: prev.guarantorNetWorths.map((item) =>
        item.id === guarantorId ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const updateBorrowerNetWorthDocuments = (borrowerId, files) => {
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      borrowerNetWorths: prev.borrowerNetWorths.map((item) =>
        item.id === borrowerId ? { ...item, documents: Array.from(files) } : item,
      ),
    }))
  }

  const updateGuarantorNetWorthDocuments = (guarantorId, files) => {
    setGroundsForWillfulDefaulter((prev) => ({
      ...prev,
      guarantorNetWorths: prev.guarantorNetWorths.map((item) =>
        item.id === guarantorId ? { ...item, documents: Array.from(files) } : item,
      ),
    }))
  }

  const getBorrowerName = (borrower) => {
    const { formData } = borrower
    return (
      formData?.fullName ||
      formData?.firmName ||
      formData?.companyName ||
      formData?.llpName ||
      formData?.societyName ||
      formData?.trustName ||
      formData?.hufName ||
      formData?.constitutionName ||
      `Borrower (${borrower.constitution || "No constitution selected"})`
    )
  }

  const getGuarantorName = (guarantor) => {
    const { formData } = guarantor
    return (
      formData?.fullName ||
      formData?.firmName ||
      formData?.companyName ||
      formData?.llpName ||
      formData?.societyName ||
      formData?.trustName ||
      formData?.hufName ||
      formData?.constitutionName ||
      `Guarantor (${guarantor.constitution || "No constitution selected"})`
    )
  }

  const renderGuarantorFields = (guarantor, guarantorIndex) => {
    switch (guarantor.constitution.toLowerCase()) {
      case "individual":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Full Name</label>
              <input
                type="text"
                value={guarantor.formData?.fullName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "fullName", e.target.value)}
                placeholder="Enter guarantor's full legal name"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Document of Identity
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "identityDocument", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload the official document of identity</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload the guarantee deed</small>
            </div>
          </div>
        )

      case "partnership":
      case "partnership firm":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Firm</label>
              <input
                type="text"
                value={guarantor.formData?.firmName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "firmName", e.target.value)}
                placeholder="Enter the legal name of the partnership firm"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Partnership Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "partnershipDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Partnership Deed (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Resolution of Partners
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolutionOfPartners", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution of all Partners (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
          </div>
        )

      case "llp":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of LLP</label>
              <input
                type="text"
                value={guarantor.formData?.llpName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "llpName", e.target.value)}
                placeholder="Enter the legal name of the Limited Liability Partnership"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Registration Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "registrationDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Registration Deed (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Resolution of Partners
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolutionOfPartners", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution of all Partners (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
          </div>
        )

      case "huf":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of HUF</label>
              <input
                type="text"
                value={guarantor.formData?.hufName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "hufName", e.target.value)}
                placeholder="Enter the name of the Hindu Undivided Family"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Declaration of Karta
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "declarationOfKarta", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Declaration of Karta in Notarized copy (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Resolution of Members
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolutionOfMembers", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution of Members (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
          </div>
        )

      case "society":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Society</label>
              <input
                type="text"
                value={guarantor.formData?.societyName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "societyName", e.target.value)}
                placeholder="Enter the legal name of the society"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Memorandum of Society
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "societyMemorandum", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Memorandum of Society (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Resolution of Society
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolutionOfSociety", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>ByLaws</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "byLaws", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload byLaws (PDF only)</small>
            </div>
          </div>
        )

      case "trust":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Trust</label>
              <input
                type="text"
                value={guarantor.formData?.trustName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "trustName", e.target.value)}
                placeholder="Enter the legal name of the trust"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Trust Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "trustDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Trust Deed (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Resolution</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolutionOfTrust", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Permission of Commissioner
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "permissionOfTrust", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Permission of Commissioner of Trust (PDF only)</small>
            </div>
          </div>
        )

      case "company":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Company</label>
              <input
                type="text"
                value={guarantor.formData?.companyName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "companyName", e.target.value)}
                placeholder="Enter the legal name of the company"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Memorandum of Association
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "associationMemorandum", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Memorandum of Association (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Article of Association
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "articleOfAssociation", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Article of Association (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Resolution</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolution", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
          </div>
        )

      case "other":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Name of Constitution
              </label>
              <input
                type="text"
                value={guarantor.formData?.constitutionName || ""}
                onChange={(e) => updateGuarantorFormData(guarantor.id, "constitutionName", e.target.value)}
                placeholder="Enter the name of the entity"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Document of Establishment
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "establishment", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Document of Establishment (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Resolution</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "resolution", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Resolution (PDF only)</small>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Guarantee Deed</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => updateGuarantorDocument(guarantor.id, "guaranteeDeed", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Guarantee Deed (PDF only)</small>
            </div>
          </div>
        )

      default:
        return (
          <div style={{ padding: "1rem", textAlign: "center", color: "#6b7280" }}>
            Please select a guarantor constitution to continue
          </div>
        )
    }
  }

  const renderBorrowerFields = (borrower, borrowerIndex) => {
    const updateBorrowerFormData = (field, value) => {
      updateBorrower(borrower.id, "formData", { ...borrower.formData, [field]: value })
    }

    const updateBorrowerDocument = (field, files) => {
      updateBorrower(borrower.id, "documents", { ...borrower.documents, [field]: Array.from(files) })
    }

    switch (borrower.constitution) {
      case "individual":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Full Name</label>
              <input
                type="text"
                value={borrower.formData?.fullName || ""}
                onChange={(e) => updateBorrowerFormData("fullName", e.target.value)}
                placeholder="Enter borrower's full legal name"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Identity Document</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("identityDocument", e.target.files)}
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
        )

      case "partnership":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Firm</label>
              <input
                type="text"
                value={borrower.formData?.firmName || ""}
                onChange={(e) => updateBorrowerFormData("firmName", e.target.value)}
                placeholder="Enter the legal name of the partnership firm"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Partnership Deed</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("partnershipDeed", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Letter of Partnership
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("letterOfPartnership", e.target.files)}
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
        )

      case "llp":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of LLP</label>
              <input
                type="text"
                value={borrower.formData?.llpName || ""}
                onChange={(e) => updateBorrowerFormData("llpName", e.target.value)}
                placeholder="Enter the legal name of the Limited Liability Partnership"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Registration Deed</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("registrationDeed", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Partnership Authority Letter
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("partnershipAuthority", e.target.files)}
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
        )

      case "company":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Company</label>
              <input
                type="text"
                value={borrower.formData?.companyName || ""}
                onChange={(e) => updateBorrowerFormData("companyName", e.target.value)}
                placeholder="Enter the legal name of the company"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Memorandum of Association
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("memorandumOfAssociation", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Articles of Association
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("articlesOfAssociation", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Board Resolution</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("boardResolution", e.target.files)}
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
        )

      case "society":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Society</label>
              <input
                type="text"
                value={borrower.formData?.societyName || ""}
                onChange={(e) => updateBorrowerFormData("societyName", e.target.value)}
                placeholder="Enter the legal name of the society"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Memorandum of Society
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("societyMemorandum", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>ByLaws</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("byLaws", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Resolution of Society
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("resolutionOfSociety", e.target.files)}
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
        )

      case "trust":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of Trust</label>
              <input
                type="text"
                value={borrower.formData?.trustName || ""}
                onChange={(e) => updateBorrowerFormData("trustName", e.target.value)}
                placeholder="Enter the legal name of the trust"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Trust Deed</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("trustDeed", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Resolution of Trust</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("resolutionOfTrust", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Permission of Commissioner of Trust
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("permissionOfTrust", e.target.files)}
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
        )

      case "huf":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name of HUF</label>
              <input
                type="text"
                value={borrower.formData?.hufName || ""}
                onChange={(e) => updateBorrowerFormData("hufName", e.target.value)}
                placeholder="Enter the name of the Hindu Undivided Family"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Declaration of Karta
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("declarationOfKarta", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Resolution of Members
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("resolutionOfMembers", e.target.files)}
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
        )

      case "other":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Name of Constitution
              </label>
              <input
                type="text"
                value={borrower.formData?.constitutionName || ""}
                onChange={(e) => updateBorrowerFormData("constitutionName", e.target.value)}
                placeholder="Enter the name of the entity"
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Document of Establishment
              </label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("establishment", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Resolution</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("resolution", e.target.files)}
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
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Other Documents</label>
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => updateBorrowerDocument("otherDocs", e.target.files)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
              <small style={{ color: "#6b7280" }}>Upload Other Documents (PDF only)</small>
            </div>
          </div>
        )

      default:
        return null
    }
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
        originalSanction,
        lastRenewal,
        npaDate,
        outstanding,
        guarantors, // Now includes enhanced guarantor data
        groundsForWillfulDefaulter, // Add this new field
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
        originalSanction,
        lastRenewal,
        npaDate,
        outstanding,
        guarantors,
        groundsForWillfulDefaulter, // Add this new field
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

  useEffect(() => {
    // Initialize borrower net worths
    const initialBorrowerNetWorths = borrowers.map((borrower) => ({
      id: borrower.id,
      netWorthAmount: "",
      netWorthDate: "",
      documents: [],
    }))

    // Initialize guarantor net worths
    const initialGuarantorNetWorths = guarantors.map((guarantor) => ({
      id: guarantor.id,
      netWorthAmount: "",
      netWorthDate: "",
      documents: [],
    }))

    setGroundsForWillfulDefaulter({
      borrowerNetWorths: initialBorrowerNetWorths,
      guarantorNetWorths: initialGuarantorNetWorths,
    })
  }, []) // Only run on mount

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "2rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e5e7eb" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "0 0 0.5rem 0" }}>Willful Defaulter Module</h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Complete the form below to process willful defaulter documentation with enhanced guarantor details
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

              {/* Enhanced Borrowers Section */}
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <h4 style={{ fontSize: "1rem", fontWeight: "500", margin: 0 }}>Borrower {index + 1}</h4>
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
                          ✕ Remove
                        </button>
                      )}
                    </div>

                    {/* Constitution Selection */}
                    <div style={{ marginBottom: "1rem" }}>
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
                        <option value="individual">Individual</option>
                        <option value="partnership">Partnership Firm</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="society">Society</option>
                        <option value="trust">Trust</option>
                        <option value="huf">Hindu Undivided Family (HUF)</option>
                        <option value="company">Company</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Constitution-specific fields */}
                    {borrower.constitution && renderBorrowerFields(borrower, index)}
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
                    Original Sanction Number
                  </label>
                  <input
                    type="text"
                    value={originalSanction.number}
                    onChange={(e) => setOriginalSanction({ ...originalSanction, number: e.target.value })}
                    placeholder="Enter sanction number"
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Original Sanction Date
                  </label>
                  <input
                    type="date"
                    value={originalSanction.date}
                    onChange={(e) => setOriginalSanction({ ...originalSanction, date: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Last Renewal Number
                  </label>
                  <input
                    type="text"
                    value={lastRenewal.number}
                    onChange={(e) => setLastRenewal({ ...lastRenewal, number: e.target.value })}
                    placeholder="Enter renewal number"
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Last Renewal Date
                  </label>
                  <input
                    type="date"
                    value={lastRenewal.date}
                    onChange={(e) => setLastRenewal({ ...lastRenewal, date: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Outstanding Type
                  </label>
                  <select
                    value={outstanding.outstanding}
                    onChange={(e) => setOutstanding({ ...outstanding, outstanding: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="">Select outstanding</option>
                    {creditFacilities.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Outstanding Amount
                  </label>
                  <input
                    type="text"
                    value={outstanding.amount}
                    onChange={(e) => setOutstanding({ ...outstanding, amount: e.target.value })}
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
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                    Outstanding Date
                  </label>
                  <input
                    type="date"
                    value={outstanding.date}
                    onChange={(e) => setOutstanding({ ...outstanding, date: e.target.value })}
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

              {/* Enhanced Guarantors Section */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", margin: 0 }}>
                    Guarantor(s) - Enhanced Details
                  </h3>
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
                {guarantors.map((guarantor, index) => (
                  <div
                    key={guarantor.id}
                    style={{
                      padding: "1.5rem",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      marginBottom: "1.5rem",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "600", margin: 0, color: "#374151" }}>
                        Guarantor {index + 1}
                      </h4>
                      {guarantors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeGuarantor(guarantor.id)}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                        >
                          ✕ Remove Guarantor
                        </button>
                      )}
                    </div>

                    {/* Constitution Selection */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", fontSize: "1rem" }}>
                        Guarantor Constitution Type
                      </label>
                      <select
                        value={guarantor.constitution}
                        onChange={(e) => updateGuarantor(guarantor.id, "constitution", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "2px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          backgroundColor: "white",
                        }}
                      >
                        <option value="">Select guarantor constitution type</option>
                        <option value="individual">Individual</option>
                        <option value="partnership">Partnership Firm</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="society">Society</option>
                        <option value="trust">Trust</option>
                        <option value="huf">Hindu Undivided Family (HUF)</option>
                        <option value="company">Company</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Constitution-specific fields */}
                    {guarantor.constitution && (
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: "1rem",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <h5 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "1rem", color: "#374151" }}>
                          {guarantor.constitution.charAt(0).toUpperCase() + guarantor.constitution.slice(1)} Details
                        </h5>
                        {renderGuarantorFields(guarantor, index)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Grounds for Willful Defaulter - Net Worth Section */}
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                  Grounds for Willful Defaulter - Net Worth Documentation
                </h3>
                <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
                  Provide net worth information and supporting documents for all borrowers and guarantors
                </p>

                {/* Borrowers Net Worth */}
                <div style={{ marginBottom: "2rem" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "1rem", color: "#4b5563" }}>
                    Borrowers Net Worth
                  </h4>
                  {borrowers.map((borrower, index) => {
                    const netWorthData = groundsForWillfulDefaulter.borrowerNetWorths.find(
                      (item) => item.id === borrower.id,
                    ) || { netWorthAmount: "", netWorthDate: "", documents: [] }

                    return (
                      <div
                        key={borrower.id}
                        style={{
                          padding: "1rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          marginBottom: "1rem",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <h5 style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "1rem", color: "#374151" }}>
                          Borrower {index + 1}: {getBorrowerName(borrower)}
                        </h5>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                              Net Worth Amount (₹)
                            </label>
                            <input
                              type="text"
                              value={netWorthData.netWorthAmount}
                              onChange={(e) => updateBorrowerNetWorth(borrower.id, "netWorthAmount", e.target.value)}
                              placeholder="Enter net worth amount"
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
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                              Net Worth Assessment Date
                            </label>
                            <input
                              type="date"
                              value={netWorthData.netWorthDate}
                              onChange={(e) => updateBorrowerNetWorth(borrower.id, "netWorthDate", e.target.value)}
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
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                              Net Worth Documents
                            </label>
                            <input
                              type="file"
                              multiple
                              accept=".pdf"
                              onChange={(e) => updateBorrowerNetWorthDocuments(borrower.id, e.target.files)}
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                fontSize: "0.875rem",
                              }}
                            />
                            <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                              Upload financial statements, balance sheets, or net worth certificates (PDF only)
                            </small>
                            {netWorthData.documents && netWorthData.documents.length > 0 && (
                              <div style={{ marginTop: "0.5rem" }}>
                                <small style={{ color: "#059669", fontSize: "0.75rem" }}>
                                  {netWorthData.documents.length} file(s) selected
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Guarantors Net Worth */}
                <div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "500", marginBottom: "1rem", color: "#4b5563" }}>
                    Guarantors Net Worth
                  </h4>
                  {guarantors.map((guarantor, index) => {
                    const netWorthData = groundsForWillfulDefaulter.guarantorNetWorths.find(
                      (item) => item.id === guarantor.id,
                    ) || { netWorthAmount: "", netWorthDate: "", documents: [] }

                    return (
                      <div
                        key={guarantor.id}
                        style={{
                          padding: "1rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          marginBottom: "1rem",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <h5 style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "1rem", color: "#374151" }}>
                          Guarantor {index + 1}: {getGuarantorName(guarantor)}
                        </h5>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "1rem",
                          }}
                        >
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                              Net Worth Amount (₹)
                            </label>
                            <input
                              type="text"
                              value={netWorthData.netWorthAmount}
                              onChange={(e) => updateGuarantorNetWorth(guarantor.id, "netWorthAmount", e.target.value)}
                              placeholder="Enter net worth amount"
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
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                              Net Worth Assessment Date
                            </label>
                            <input
                              type="date"
                              value={netWorthData.netWorthDate}
                              onChange={(e) => updateGuarantorNetWorth(guarantor.id, "netWorthDate", e.target.value)}
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
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                              Net Worth Documents
                            </label>
                            <input
                              type="file"
                              multiple
                              accept=".pdf"
                              onChange={(e) => updateGuarantorNetWorthDocuments(guarantor.id, e.target.files)}
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                fontSize: "0.875rem",
                              }}
                            />
                            <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                              Upload financial statements, balance sheets, or net worth certificates (PDF only)
                            </small>
                            {netWorthData.documents && netWorthData.documents.length > 0 && (
                              <div style={{ marginTop: "0.5rem" }}>
                                <small style={{ color: "#059669", fontSize: "0.75rem" }}>
                                  {netWorthData.documents.length} file(s) selected
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

              {/* Enhanced Diversion of Funds */}
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>Diversion of Funds</h3>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                      Diversion Status
                    </label>
                    <select
                      value={diversionOfFunds.status}
                      onChange={(e) => setDiversionOfFunds({ ...diversionOfFunds, status: e.target.value })}
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

                  {diversionOfFunds.status && (
                    <>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Remarks</label>
                        <textarea
                          value={diversionOfFunds.remarks}
                          onChange={(e) => setDiversionOfFunds({ ...diversionOfFunds, remarks: e.target.value })}
                          placeholder={`Enter remarks about diversion of funds - ${diversionOfFunds.status}`}
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
                        <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                          Provide detailed remarks for the selected diversion status
                        </small>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Supporting Documents
                        </label>
                        <input
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={(e) =>
                            setDiversionOfFunds({ ...diversionOfFunds, documents: Array.from(e.target.files || []) })
                          }
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                          }}
                        />
                        <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                          Upload supporting documents for diversion of funds (PDF only)
                        </small>
                        {diversionOfFunds.documents.length > 0 && (
                          <div style={{ marginTop: "0.5rem" }}>
                            <small style={{ color: "#059669", fontSize: "0.75rem" }}>
                              {diversionOfFunds.documents.length} file(s) selected
                            </small>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
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
