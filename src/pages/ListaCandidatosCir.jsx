import React, { useEffect, useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem,
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
  const [departamentos, setDepartamentos] = useState([]);
  const [circunscripciones, setCircunscripciones] = useState([]);
  const navigate = useNavigate();

  const cargarDepartamentos = async () => {
    const { data } = await api.get('/mesas/departamentos');
    setDepartamentos(data);
  };

  const cargarCircunscripciones = async (idDepartamento) => {
    const { data } = await api.get(`/mesas/circunscripciones/${idDepartamento}`);
    setCircunscripciones(data);
  };

  useEffect(() => {
    cargar();
    cargarDepartamentos();
  }, []);

  useEffect(() => {
    if (form.departamento) {
      cargarCircunscripciones(form.departamento);
    }
  }, [form.departamento]);

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

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "departamento") {
      const deptoId = parseInt(value);
      await cargarCircunscripciones(deptoId);
      setForm((prev) => ({
        ...prev,
        departamento: deptoId,
        circunscripcion: '' // limpiar
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Departamento</InputLabel>
            <Select
              name="departamento"
              value={form.departamento || ''}
              label="Departamento"
              onChange={handleChange}
              required
            >
              {departamentos.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Circunscripción</InputLabel>
            <Select
              name="circunscripcion"
              value={form.circunscripcion || ''}
              label="Circunscripción"
              onChange={handleChange}
              required
            >
              {circunscripciones.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
