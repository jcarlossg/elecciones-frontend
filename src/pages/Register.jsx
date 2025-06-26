import React, { useState, useEffect } from 'react';  // <-- agregamos useEffect
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [nombre, setNombre] = useState('');
  const [ci, setCi] = useState('');
  const [celular, setCelular] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);  // Array, no string
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/admin/roles')
      .then(res => setRolesDisponibles(res.data))
      .catch(err => {
        console.error('Error al cargar roles:', err);
        // Puedes mostrar mensaje o fallback aquí
      });
  }, []);

  const handleRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setMensaje('');
    try {
      await api.post('/auth/register', { nombre,ci,celular, username, password, roles });
      setMensaje('Usuario registrado correctamente.');
      setNombre('');
      setCi('');
      setCelular('');
      setUsername('');
      setPassword('');
      setRoles([]);
    } catch {
      setError(true);
      setMensaje('Error al registrar usuario.');
    }
  };

  const handleCancelar = () => {
    navigate('/usuarios'); // o la ruta que prefieras
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Registrar Usuario
        </Typography>

        {mensaje && (
          <Alert severity={error ? 'error' : 'success'} sx={{ mb: 2 }}>
            {mensaje}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre completo"
            variant="outlined"
            margin="normal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Ci"
            variant="outlined"
            margin="normal"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Celular"
            variant="outlined"
            margin="normal"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            required
          />
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

          <FormControl fullWidth margin="normal">
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              multiple
              value={roles}
              onChange={handleRolesChange}
              input={<OutlinedInput label="Roles" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {rolesDisponibles.map((rol) => (
                <MenuItem key={rol} value={rol}>
                  <Checkbox checked={roles.indexOf(rol) > -1} />
                  <ListItemText primary={rol} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={3}>
            <Stack direction="row" spacing={2}>
              <Button fullWidth type="submit" variant="contained" color="primary">
                Registrar
              </Button>
              <Button fullWidth variant="outlined" color="secondary" onClick={handleCancelar}>
                Cancelar y Volver
              </Button>
            </Stack>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
