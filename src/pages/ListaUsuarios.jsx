import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  TablePagination,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [rolesEdit, setRolesEdit] = useState([]);
  const [usuarioEditId, setUsuarioEditId] = useState(null);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
    api.get('/admin/roles')
      .then(res => setRolesDisponibles(res.data))
      .catch(() => setRolesDisponibles(['ADMIN', 'USER'])); // fallback
  }, []);

  const cargarUsuarios = async () => {
    try {
      const { data } = await api.get('/admin/usuarios');
      setUsuarios(data);
      setError('');
    } catch {
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await api.delete(`/admin/usuarios/${id}`);
        cargarUsuarios();
      } catch {
        alert('Error al eliminar usuario.');
      }
    }
  };

  const abrirDialogEditar = (usuario) => {
    setUsuarioEditId(usuario.id);
    setRolesEdit(usuario.roles);
    setOpenDialog(true);
  };

  const guardarRoles = async () => {
    try {
      await api.put(`/admin/usuarios/${usuarioEditId}/roles`, rolesEdit);
      setOpenDialog(false);
      cargarUsuarios();
    } catch {
      alert('Error al guardar roles');
    }
  };

  const handleRegistroUsuarios = () => {
    navigate('/register');
  };

  // Filtrado por búsqueda
  const filteredUsuarios = usuarios.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term) ||
      u.ci?.toString().includes(term) ||
      u.celular?.toString().includes(term) ||
      u.roles.some(r => r.toLowerCase().includes(term))
    );
  });

  // Paginación frontend
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const usuariosPaginados = filteredUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Usuarios Registrados
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleRegistroUsuarios}>
          Registrar Usuarios
        </Button>

        <TextField
          label="Buscar usuarios"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper sx={{ mt: 2 }}>
          <Table stickyHeader aria-label="lista usuarios">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a237e' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Usuario</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>CI</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Celular</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Roles</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosPaginados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                usuariosPaginados.map((u) => (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f3e5f5' } }}
                  >
                    <TableCell>{u.nombre}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.ci}</TableCell>
                    <TableCell>{u.celular}</TableCell>
                    <TableCell>{u.roles.join(', ')}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => eliminarUsuario(u.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={() => abrirDialogEditar(u)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredUsuarios.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontWeight: '600',
                color: '#1a237e',
              },
            }}
          />
        </Paper>
      )}

      {/* Dialogo para editar roles */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Roles</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={rolesEdit}
              onChange={(e) => setRolesEdit(e.target.value)}
              input={<OutlinedInput label="Roles" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {rolesDisponibles.map((rol) => (
                <MenuItem key={rol} value={rol}>
                  <Checkbox checked={rolesEdit.indexOf(rol) > -1} />
                  <ListItemText primary={rol} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={guardarRoles} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
