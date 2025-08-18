import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: (t) => t.palette.background.paper,
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "saturate(180%) blur(8px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: 0, minHeight: 64, gap: 2 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              mr: "auto",
            }}
          >
            <Box
              component="img"
              src="/ROMO.png"
              alt="ROMI"
              sx={{ height: 50, display: "block" }}
            />
          </Box>

          {user ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip
                label={user.role}
                size="small"
                color={user.role === "admin" ? "primary" : "default"}
                sx={{ textTransform: "capitalize" }}
              />
              <Typography
                fontStyle={{ color: "black" }}
                variant="body2"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {user.email}
              </Typography>
              <Button variant="contained" color="primary" onClick={logout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button component={RouterLink} to="/login" variant="text">
                Login
              </Button>
              <Button component={RouterLink} to="/register" variant="contained">
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
