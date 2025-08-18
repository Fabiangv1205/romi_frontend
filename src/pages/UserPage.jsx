import React from "react";
import { Box, Paper, Typography, Stack, Divider} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function UserHome() {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography variant="h5" fontWeight={800}>
            Bienvenido{user?.name ? `, ${user.name}` : ""} 
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Bienvenido a ROMI, tu asistente virtual.
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>Tu Perfil</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1}>
          <Typography><b>Nombre:</b> {user?.name || "—"}</Typography>
          <Typography><b>Email:</b> {user?.email || "—"}</Typography>
          <Typography><b>Rol:</b> {user?.role || "—"}</Typography>
          <Typography><b>Creado:</b> {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}</Typography>
          <Typography><b>Actualizado:</b> {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "—"}</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
