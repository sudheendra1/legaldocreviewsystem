"use client"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { CircularProgress, Box, Container } from "@mui/material"

function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser, loading } = useAuth()
  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <Container component="main" maxWidth="md">
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
              </Box>
            </Container>
          )
        }
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    />
  )
}

export default PrivateRoute

