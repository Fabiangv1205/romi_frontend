import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Typography, Stack, TextField, InputAdornment, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, TablePagination,
  Button, Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { api } from "../api/client";
import UserDialog from "../components/UserDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { useSnackbar } from "notistack";

export default function AdminUsers() {
  const { enqueueSnackbar } = useSnackbar();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const params = useMemo(() => ({
    page: page + 1, limit, q: q.trim()
  }), [page, limit, q]);

  const fetchUsers = async () => {
    const { data } = await api.get("/users", { params });
    setData(data.data);
    setTotal(data.pagination.total);
  };

  useEffect(() => { fetchUsers().catch(() => {}); }, [params]); // eslint-disable-line

  const handleCreate = async (body) => {
    try {
      await api.post("/users", body);
      enqueueSnackbar("Usuario creado", { variant: "success" });
      setOpenDialog(false);
      fetchUsers();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Error al crear", { variant: "error" });
    }
  };

  const handleUpdate = async (body) => {
    try {
      await api.patch(`/users/${editing.id}`, body);
      enqueueSnackbar("Usuario actualizado", { variant: "success" });
      setEditing(null);
      setOpenDialog(false);
      fetchUsers();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Error al actualizar", { variant: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${toDelete.id}`);
      enqueueSnackbar("Usuario eliminado", { variant: "success" });
      setToDelete(null);
      setOpenConfirm(false);
      fetchUsers();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.error || "Error al eliminar", { variant: "error" });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography variant="h5" fontWeight={800}>Usuarios</Typography>
          <Stack direction="row" gap={1}>
            <TextField
              size="small" placeholder="Buscar por nombre o email"
              value={q} onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            <Tooltip title="Recargar">
              <IconButton onClick={() => fetchUsers()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpenDialog(true); }}>
              Nuevo
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => { setEditing(u); setOpenDialog(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => { setToDelete(u); setOpenConfirm(true); }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => { setLimit(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <UserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={editing ? handleUpdate : handleCreate}
        initial={editing}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        content={toDelete ? `¿Eliminar a ${toDelete.email}?` : ""}
      />
    </Box>
  );
}
