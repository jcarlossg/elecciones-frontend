import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableBody, TableRow,
    TableCell, Paper, CircularProgress, Alert, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText
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

    useEffect(() => {
        cargarUsuarios();
        api.get('/admin/roles')
            .then(res => setRolesDisponibles(res.data))
            .catch(() => setRolesDisponibles(['ADMIN', 'USER'])); // fallback
    }, []);

    const cargarUsuarios = async () => {
        try {
            const { data } = await api.get('/api/admin/usuarios');
            console.log(data);
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
                await api.delete(`/api/admin/usuarios/${id}`);
                cargarUsuarios();
            } catch {
                alert('Error al eliminar usuario.');
            }
        }
    };
    const navigate = useNavigate();
    const abrirDialogEditar = (usuario) => {
        setUsuarioEditId(usuario.id);
        setRolesEdit(usuario.roles);
        setOpenDialog(true);
    };

    const guardarRoles = async () => {
        try {
            await api.put(`/api/admin/usuarios/${usuarioEditId}/roles`, rolesEdit);
            setOpenDialog(false);
            cargarUsuarios();
        } catch {
            alert('Error al guardar roles');
        }
    };

    const handleRegistroUsuarios = () => {
        navigate('/register');
    };

    return (


        <Container sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Lista de Usuarios Registrados
            </Typography>
            <Button variant="contained" color="primary" onClick={handleRegistroUsuarios}>
                Registrar Usuarios
            </Button>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (


                <Paper sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Usuario</TableCell>
                                <TableCell>ci</TableCell>
                                <TableCell>Celular</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios.map((u) => (
                                <TableRow key={u.id}>
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
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

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
                    <Button onClick={guardarRoles} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
