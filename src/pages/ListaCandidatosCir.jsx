import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableBody, TableRow,
  TableCell, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
export default function ListaCandidatosCir() {
  const [candidatos, setCandidatos] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const { data } = await api.get('/candidatos-cir');
    setCandidatos(data);
  };

  const eliminar = async (id) => {
    if (window.confirm('¿Eliminar este candidato?')) {
      await api.delete(`/candidatos-cir/${id}`);
      cargar();
    }
  };

  const abrirEditar = (candidato) => {
    setEditId(candidato.id);
    setForm(candidato);
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    await api.put(`/candidatos-cir/${editId}`, form);
    setOpen(false);
    cargar();
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Candidatos Circunscripción
      </Typography>

      <Button
  variant="contained"
  color="primary"
  sx={{ mt: 2 }}
  onClick={() => navigate('/candidatos/register_candidatos')}
>
  Registrar Candidato
</Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Departamento</TableCell>
              <TableCell>Circunscripción</TableCell>
              <TableCell>Nombre Candidato</TableCell>
              <TableCell>CI</TableCell>
              <TableCell>Coordinador</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidatos.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.departamento}</TableCell>
                <TableCell>{c.circunscripcion}</TableCell>
                <TableCell>{c.nombreCandidato}</TableCell>
                <TableCell>{c.ciCandidato}</TableCell>
                <TableCell>{c.nombreCoordinador}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => eliminar(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => abrirEditar(c)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal editar */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Editar Candidato</DialogTitle>
        <DialogContent>
          <TextField name="departamento" label="Departamento" fullWidth margin="dense" value={form.departamento || ''} onChange={handleChange} />
          <TextField name="circunscripcion" label="Circunscripción" fullWidth margin="dense" value={form.circunscripcion || ''} onChange={handleChange} />
          <TextField name="nombreCandidato" label="Nombre Candidato" fullWidth margin="dense" value={form.nombreCandidato || ''} onChange={handleChange} />
          <TextField name="ciCandidato" label="CI Candidato" fullWidth margin="dense" value={form.ciCandidato || ''} onChange={handleChange} />
          <TextField name="celularCandidato" label="Celular Candidato" fullWidth margin="dense" value={form.celularCandidato || ''} onChange={handleChange} />
          <TextField name="nombreCoordinador" label="Nombre Coordinador" fullWidth margin="dense" value={form.nombreCoordinador || ''} onChange={handleChange} />
          <TextField name="ciCoordinador" label="CI Coordinador" fullWidth margin="dense" value={form.ciCoordinador || ''} onChange={handleChange} />
          <TextField name="celularCoodinador" label="Celular Coordinador" fullWidth margin="dense" value={form.celularCoodinador || ''} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={guardarCambios} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
