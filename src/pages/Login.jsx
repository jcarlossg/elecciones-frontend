import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
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
        setMensaje(`Error ${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        setMensaje('No se recibió respuesta del servidor.');
      } else {
        setMensaje('Error en la solicitud: ' + error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow:
              '0 8px 20px rgba(102, 126, 234, 0.4), 0 6px 6px rgba(118, 75, 162, 0.3)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#4b0082', mb: 4 }}
          >
            Iniciar Sesión
          </Typography>

          {mensaje && (
            <Alert severity={error ? 'error' : 'success'} sx={{ mb: 3 }}>
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
              autoComplete="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s ease',
                  '&.Mui-focused fieldset': {
                    borderColor: '#764ba2',
                    boxShadow: '0 0 8px #764ba2',
                  },
                },
              }}
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
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s ease',
                  '&.Mui-focused fieldset': {
                    borderColor: '#764ba2',
                    boxShadow: '0 0 8px #764ba2',
                  },
                },
              }}
            />
            <Box mt={4}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  background:
                    'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                  boxShadow: '0 3px 5px 2px rgba(118, 75, 162, .3)',
                  transition: 'background 0.3s ease',
                  '&:hover': {
                    background:
                      'linear-gradient(45deg, #5a3683 30%, #5864c3 90%)',
                  },
                }}
              >
                Ingresar
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
