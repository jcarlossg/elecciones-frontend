import React, { useState } from 'react';
import {
  Container, TextField, Typography, Button, Paper, Alert, Box
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

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Registrar Candidato Circunscripción
        </Typography>

        {mensaje && <Alert severity={error ? 'error' : 'success'}>{mensaje}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField name="departamento" label="Departamento" fullWidth margin="normal" value={form.departamento} onChange={handleChange} required />
          <TextField name="circunscripcion" label="Circunscripción" fullWidth margin="normal" value={form.circunscripcion} onChange={handleChange} required />
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
