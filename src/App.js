
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { FormDataProvider } from "./components/FormDataManager";
import { useAuth } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import UploadDocuments from "./components/UploadDocuments"
import ReviewDocuments from "./components/ReviewDocuments"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import MultiStepForm from "./components/MultiStepForm" 
import ReviewDocumentsList from "./components/ReviewDocumentsList"
import ReviewDocumentDetails from "./components/ReviewDocumentDetails"
import SeeUploads from "./components/seeUploads"
import SeeUploadDetails from "./components/seeUploadDetail"
import AdminDocumentsList from "./components/adminList"
import ReviewersList from "./components/reviewersList"
import AdminCreateUser from "./components/adminCreateUser"

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
    <FormDataProvider>
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
    </FormDataProvider>
  )
}

export default App

