import React, { useState, useEffect } from 'react';
import {
  Select, MenuItem, FormControl, InputLabel, Container,
  TextField, Typography, Button, Paper, Alert, Box
} from '@mui/material';
import api from '../api/api';

export default function RegistrarCandidatoCir() {
  const [form, setForm] = useState({
    departamento: '',
    circunscripcion: '',
    nombreCandidato: '',
    ciCandidato: '',
    celularCandidato: '',
    nombreCoordinador: '',
    ciCoordinador: '',
    celularCoodinador: ''
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [circunscripciones, setCircunscripciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "departamento") {
      const deptoId = parseInt(value);
      await cargarCircunscripciones(deptoId);
      setForm((prev) => ({ ...prev, departamento: deptoId, circunscripcion: '' }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      await api.post('/candidatos-cir', form);
      setMensaje('Registro exitoso');
      setForm({
        departamento: '',
        circunscripcion: '',
        nombreCandidato: '',
        ciCandidato: '',
        celularCandidato: '',
        nombreCoordinador: '',
        ciCoordinador: '',
        celularCoodinador: ''
      });
    } catch {
      setError(true);
      setMensaje('Error al registrar');
    }
  };

  const cargarDepartamentos = async () => {
    const { data } = await api.get('/mesas/departamentos');
    setDepartamentos(data);
  };

  const cargarCircunscripciones = async (idDepartamento) => {
    const { data } = await api.get(`/mesas/circunscripciones/${idDepartamento}`);
    setCircunscripciones(data);
  };
  useEffect(() => {
    cargarDepartamentos();
  }, []);
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Registrar Candidato Circunscripción
        </Typography>

        {mensaje && <Alert severity={error ? 'error' : 'success'}>{mensaje}</Alert>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Departamento</InputLabel>
            <Select
              name="departamento"
              value={form.departamento}
              label="Departamento"
              onChange={handleChange}
              required
            >
              {departamentos.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Circunscripción</InputLabel>
            <Select
              name="circunscripcion"
              value={form.circunscripcion}
              label="Circunscripción"
              onChange={handleChange}
              required
            >
              {circunscripciones.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField name="nombreCandidato" label="Nombre Candidato" fullWidth margin="normal" value={form.nombreCandidato} onChange={handleChange} required />
          <TextField name="ciCandidato" label="CI Candidato" fullWidth margin="normal" value={form.ciCandidato} onChange={handleChange} required />
          <TextField name="celularCandidato" label="Celular Candidato" fullWidth margin="normal" value={form.celularCandidato} onChange={handleChange} required />
          <TextField name="nombreCoordinador" label="Nombre Coordinador" fullWidth margin="normal" value={form.nombreCoordinador} onChange={handleChange} required />
          <TextField name="ciCoordinador" label="CI Coordinador" fullWidth margin="normal" value={form.ciCoordinador} onChange={handleChange} required />
          <TextField name="celularCoodinador" label="Celular Coordinador" fullWidth margin="normal" value={form.celularCoodinador} onChange={handleChange} required />

          <Box mt={2}>
            <Button type="submit" fullWidth variant="contained">Registrar</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
