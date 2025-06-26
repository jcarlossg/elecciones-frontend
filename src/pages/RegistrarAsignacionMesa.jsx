import React, { useState, useEffect } from 'react';
import {
    Container, TextField, Button, Typography, MenuItem, Select,
    FormControl, InputLabel, Box, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import api from '../api/api';

export default function RegistrarAsignacionMesa() {
    const [form, setForm] = useState({
        idUsuario: '',
        idDepartamento: '',
        idCircunscripcion: '',
        nombreRecinto: '',
        mesasSeleccionadas: []
    });

    const [usuarios, setUsuarios] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [circunscripciones, setCircunscripciones] = useState([]);
    const [recintos, setRecintos] = useState([]);
    const [mesasDisponibles, setMesasDisponibles] = useState([]);
    const [mesasAsignadas, setMesasAsignadas] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        api.get('/admin/usuarios').then(res => setUsuarios(res.data));
        api.get('/mesas/departamentos').then(res => setDepartamentos(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Cargar circunscripciones
    useEffect(() => {
        if (form.idDepartamento) {
            api.get(`/mesas/circunscripciones/${form.idDepartamento}`)
                .then(res => setCircunscripciones(res.data));

            setForm(prev => ({ ...prev, idCircunscripcion: '', nombreRecinto: '', mesasSeleccionadas: [] }));
            setRecintos([]);
            setMesasDisponibles([]);
        }
    }, [form.idDepartamento]);

    // Cargar recintos
    useEffect(() => {
        if (form.idCircunscripcion) {
            api.get(`/mesas/recintos/${form.idCircunscripcion}`)
                .then(res => setRecintos(res.data));

            setForm(prev => ({ ...prev, nombreRecinto: '', mesasSeleccionadas: [] }));
            setMesasDisponibles([]);
        }
    }, [form.idCircunscripcion]);

    // Cargar mesas por recinto
    useEffect(() => {
        if (form.nombreRecinto) {
            api.get(`/mesas/por-recinto?nombreRecinto=${form.nombreRecinto}`)
                .then(res => setMesasDisponibles(res.data));

            setForm(prev => ({ ...prev, mesasSeleccionadas: [] }));
        }
    }, [form.nombreRecinto]);

    // Cargar mesas ya asignadas al usuario
    useEffect(() => {
        if (form.idUsuario) {
            api.get(`/asignacion-mesa/asignadas/usuario/${form.idUsuario}`)
                .then(res => setMesasAsignadas(res.data));
        } else {
            setMesasAsignadas([]);
        }
    }, [form.idUsuario]);

    // Desasignar mesa
    const desasignarMesa = async (idMesa) => {
        if (window.confirm("¿Deseas desasignar esta mesa?")) {
            try {
                await api.delete(`/asignacion-mesa/desasignar/${idMesa}`);
                setMensaje('Mesa desasignada correctamente');

                // Volver a cargar mesas asignadas
                const res = await api.get(`/asignacion-mesa/asignadas/usuario/${form.idUsuario}`);
                setMesasAsignadas(res.data);
            } catch {
                setMensaje('Error al desasignar la mesa');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/asignacion-mesa', {
                idUsuario: form.idUsuario,
                idDepartamento: form.idDepartamento,
                idCircunscripcion: form.idCircunscripcion,
                nombreRecinto: form.nombreRecinto,
                idMesas: form.mesasSeleccionadas
            });
            setMensaje('Asignación creada correctamente');
            setForm({
                idUsuario: '',
                idDepartamento: '',
                idCircunscripcion: '',
                nombreRecinto: '',
                mesasSeleccionadas: []
            });
            setMesasAsignadas([]);
        } catch {
            setMensaje('Error al crear asignación');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Registrar Asignación de Mesa</Typography>
            {mensaje && (
                <Typography color={mensaje.includes('Error') ? 'error' : 'primary'}>{mensaje}</Typography>
            )}

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Usuario</InputLabel>
                    <Select name="idUsuario" value={form.idUsuario} onChange={handleChange} required>
                        {usuarios.map(u => <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Departamento</InputLabel>
                    <Select
                        name="idDepartamento"
                        value={form.idDepartamento || ''}
                        onChange={handleChange}
                        required
                    >
                        {departamentos.map(d => (
                            <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!form.idDepartamento}>
                    <InputLabel>Circunscripción</InputLabel>
                    <Select name="idCircunscripcion" value={form.idCircunscripcion} onChange={handleChange} required>
                        {circunscripciones.map(c => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!form.idCircunscripcion}>
                    <InputLabel>Recinto</InputLabel>
                    <Select name="nombreRecinto" value={form.nombreRecinto} onChange={handleChange} required>
                        {recintos.map(r => (
                            <MenuItem key={r} value={r}>{r}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!form.nombreRecinto}>
                    <InputLabel>Mesas</InputLabel>
                    <Select
                        multiple
                        name="mesasSeleccionadas"
                        value={form.mesasSeleccionadas}
                        onChange={(e) => setForm({ ...form, mesasSeleccionadas: e.target.value })}
                        input={<OutlinedInput label="Mesas" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {mesasDisponibles.map(([id, numeroMesa, codigoMesaDos]) => (
                            <MenuItem key={id} value={id}>
                                <Checkbox checked={form.mesasSeleccionadas.includes(id)} />
                                <ListItemText primary={`Mesa ${numeroMesa} (${codigoMesaDos})`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Guardar Asignación
                </Button>
            </form>

            {mesasAsignadas.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6">Mesas actualmente asignadas:</Typography>
                    {mesasAsignadas.map(m => (
                        <Box key={m.id} display="flex" justifyContent="space-between" alignItems="center" mt={1} sx={{ p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                            <Typography>{`Mesa ${m.numeroMesa} (${m.codigoMesaDos}) - Recinto: ${m.nombreRecinto}`}</Typography>
                            <Button variant="outlined" color="error" onClick={() => desasignarMesa(m.id)}>
                                Desasignar
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
}
