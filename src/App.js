import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import ErrorBoundary from "./components/ErrorBoundary"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import UploadDocuments from "./components/UploadDocuments"
import ReviewDocuments from "./components/ReviewDocuments"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="app">
              <Switch>
                <Route exact path="/login" component={Login} />
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute path="/upload" component={UploadDocuments} />
                <PrivateRoute path="/review" component={ReviewDocuments} />
              </Switch>
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App

