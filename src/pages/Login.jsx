import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { saveToken, isLoggedIn } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(false);
  setMensaje('');
  try {
    const { data } = await api.post('/auth/login', { username, password });
    saveToken(data.token);
    setMensaje('¡Login exitoso!');
    navigate('/');
  } catch (error) {
    setError(true);
    if (error.response) {
      // Error con respuesta del servidor
      setMensaje(`Error ${error.response.status}: ${error.response.data}`);
    } else if (error.request) {
      // No hubo respuesta del servidor
      setMensaje('No se recibió respuesta del servidor.');
    } else {
      // Otro error
      setMensaje('Error en la solicitud: ' + error.message);
    }
  }
};

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        {mensaje && (
          <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
            {mensaje}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box mt={3}>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Ingresar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
