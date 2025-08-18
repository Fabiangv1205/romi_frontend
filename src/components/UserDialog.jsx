import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Stack, Button
} from "@mui/material";

export default function UserDialog({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  useEffect(() => {
    setForm({
      name: initial?.name || "",
      email: initial?.email || "",
      password: "",
      role: initial?.role || "user"
    });
  }, [initial]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const body = { name: form.name, email: form.email, role: form.role };
    if (!initial) body.password = form.password || "";
    if (initial && form.password) body.password = form.password;
    onSubmit(body);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{initial ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
          <TextField
            label={initial ? "Nuevo password (opcional)" : "Password"}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
          />
          <TextField select label="Rol" name="role" value={form.role} onChange={handleChange} fullWidth>
            <MenuItem value="user">user</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>{initial ? "Guardar" : "Crear"}</Button>
      </DialogActions>
    </Dialog>
  );
}
