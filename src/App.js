
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { FormDataProvider as LitigationFormDataProvider } from "./utils/litigationFormManager";
import { FormDataProvider as LoanFormDataProvider } from "./components/Loan vetting/FormDataManager";
import { useAuth } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import UploadDocuments from "./components/Loan vetting/UploadDocuments"
import ReviewDocuments from "./components/Loan vetting/ReviewDocuments"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import MultiStepForm from "./components/MultiStepForm" 
import ReviewDocumentsList from "./components/Loan vetting/ReviewDocumentsList"
import ReviewDocumentDetails from "./components/Loan vetting/ReviewDocumentDetails"
import SeeUploads from "./components/Loan vetting/seeUploads"
import SeeUploadDetails from "./components/Loan vetting/seeUploadDetail"
import AdminDocumentsList from "./components/Loan vetting/adminList"
import ReviewersList from "./components/Loan vetting/reviewersList"
import AdminCreateUser from "./components/adminCreateUser"
import ForceResetPassword from "./components/ForceResetPassword"
import ReviewDocumentDetailsAdmin from "./components/Loan vetting/reviewDocumentDetailsAdmin"
import NotationPage from "./components/Notation/notaionMain"
import TrainingPage from "./components/Training/trainingMain"
import LitigationPage from "./components/Litigation/litigationMain"
import GuidancePage from "./components/Guidance/guidanceMain"
import HealthPage from "./components/Health concovation/healthMain"
import ResearchPage from "./components/Research/researchMain"
import WillfulDefaulterForm from "./components/Wilfull defaulter/wilfulDefaulterMain"
import WillfulDefaulterDashboard from "./components/Wilfull defaulter/willfulDefaulterDashboard"
import WillfulDefaulterDetails from "./components/Wilfull defaulter/willfullDefaulterDetails";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function App() {
  const { currentUser } = useAuth();
  return (
    <LoanFormDataProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
      <Router>
        <div className="app">
          <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={Dashboard} />
              <Route path="/upload" component={UploadDocuments} />
              {/* <Route path="/review" component={ReviewDocuments} /> */}
              <Route path="/form" component={MultiStepForm} />
              <Route path="/review" exact component={ReviewDocumentsList} />
              <Route path="/review/:id" component={ReviewDocumentDetails} />
              <Route path="/seeUploads" exact component={SeeUploads} />
              <Route path="/seeUploads/:id" exact component={SeeUploadDetails} />
              <Route path="/adminDocs" exact component={AdminDocumentsList} />
              <Route path="/reviewers" component={ReviewersList} />
              <Route path="/createUser" component={AdminCreateUser} />
              <Route path="/force-reset" component={ForceResetPassword} />
              <Route path="/adminDocs/:id" component={ReviewDocumentDetailsAdmin} />
              <Route path="/guidance" component={GuidancePage} />
              <Route path="/health" component={HealthPage} />
              <Route path="/notation" component={NotationPage} />
              <Route path="/research" component={ResearchPage} />
              <Route path="/training" component={TrainingPage} />
              <Route path="/willFullDefaulter" component={WillfulDefaulterForm} />
              <Route path="/willFullDefaulterDashboard" component={WillfulDefaulterDashboard} />
              <Route path="/willful-defaulter-details/:id" component={WillfulDefaulterDetails} />
               <Route path="/litigation">
                  <LitigationFormDataProvider>
                    <LitigationPage />
                  </LitigationFormDataProvider>
                </Route>
              
              <Route path="*">
                <Redirect to="/" />
            </Route>
            {/* <Route path="/upload">{user ? <UploadDocuments /> : <Redirect to="/login" />}</Route>
            <Route path="/review">{user ? <ReviewDocuments /> : <Redirect to="/login" />}</Route> */}
          </Switch>
        </div>
      </Router>
       </AuthProvider>
    </ThemeProvider>
    </LoanFormDataProvider>
  )
}

export default App

