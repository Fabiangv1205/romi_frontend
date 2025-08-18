import React, { useState, useEffect } from "react";
import {
  Box, Paper, Tabs, Tab, TextField, Button, Stack, Typography
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import PasswordField from "../components/PasswordField"

export default function LoginRegister() {
  const [tab, setTab] = useState(0);
  const { login, register, isAuth, isAdmin } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = async () => {
    try {
      const me = await login(loginForm.email, loginForm.password);
      enqueueSnackbar("Bienvenido", { variant: "success" });
      navigate(me.role === "admin" ? "/admin" : "/user");
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Error al iniciar sesión", { variant: "error" });
    }
  };

  const handleRegister = async () => {
    try {
      const me = await register(regForm.name, regForm.email, regForm.password);
      enqueueSnackbar("Registro exitoso", { variant: "success" });
      navigate(me.role === "admin" ? "/admin" : "/user");
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Error al registrar", { variant: "error" });
    }
  };
  useEffect(() => {
    if (isAuth) {
      navigate(isAdmin ? "/admin" : "/user", { replace: true });
    }
  }, [isAuth, isAdmin, navigate]);
  
  return (
    <Box sx={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      background: "linear-gradient(135deg, #ffc0c0 0%, #f7f9fb 60%)"
    }}>
      <Paper elevation={2} sx={{ p: 3, width: "100%", maxWidth: 420 }}>
        <Box
          component="img"
          src="/ROMO.png"
          alt="ROMI"
          sx={{ height: 70, display: "block", mx: "auto", mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
          Inicia sesión o crea tu cuenta
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {tab === 0 ? (
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />

            <PasswordField
              label="Contraseña"
              value={loginForm.password}
              onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
            />

            <Button variant="contained" onClick={handleLogin}>Entrar</Button>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              value={regForm.name}
              onChange={(e) => setRegForm(f => ({ ...f, name: e.target.value }))}
              autoComplete="name"
            />
            <TextField
              label="Email"
              type="email"
              value={regForm.email}
              onChange={(e) => setRegForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />

            <PasswordField
              label="Contraseña"
              value={regForm.password}
              onChange={(e) => setRegForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="new-password"
            />

            <Button variant="contained" onClick={handleRegister}>Crear cuenta</Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
