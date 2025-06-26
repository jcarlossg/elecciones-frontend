import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import api from '../api/api';

export default function UserPage() {
  const [mensaje, setMensaje] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [mesasAsignadas, setMesasAsignadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        setUsuario(res.data);
        return api.get(`/asignacion-mesa/asignadas/usuario/${res.data.id}`);
      })
      .then(res => {
        setMesasAsignadas(res.data);
      })
      .catch(() => {
        setMensaje('Acceso denegado o error');
      })
      .finally(() => setLoading(false));
  }, []);

  const irADetalleMesa = (mesa) => {
    navigate(`/detalle-mesa/${mesa.id}`, { state: mesa });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Área de Usuario</Typography>

      {usuario && (
        <Typography variant="h6">
          Bienvenido, {usuario.nombre} (usuario: {usuario.username})
        </Typography>
      )}

      {mensaje && (
        <Typography color="error">{mensaje}</Typography>
      )}

      {loading ? (
        <CircularProgress />
      ) : mesasAsignadas.length > 0 ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Mesas asignadas:</Typography>
          <Grid container spacing={2}>
            {mesasAsignadas.map(mesa => (
              <Grid item xs={12} md={6} lg={4} key={mesa.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1">
                      Recinto: {mesa.nombreRecinto}
                    </Typography>
                    <Typography variant="body2">
                      Mesa N°: {mesa.numeroMesa}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => irADetalleMesa(mesa)}
                      sx={{ mt: 2 }}
                    >
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography mt={4}>No tienes mesas asignadas.</Typography>
      )}
    </Box>
  );
}
