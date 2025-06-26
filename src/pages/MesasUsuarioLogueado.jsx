import React, { useState, useEffect } from 'react';
import api from '../api/api';

export default function MesasUsuarioLogueado() {
  const [mesasAsignadas, setMesasAsignadas] = useState([]);
  const [idUsuarioLogueado, setIdUsuarioLogueado] = useState(null);

  useEffect(() => {
    // Obtener el usuario logueado desde /auth/me
    api.get('/auth/me')
      .then(res => {
        const userId = res.data.id;
        setIdUsuarioLogueado(userId);

        // Luego cargar las mesas asignadas
        return api.get(`/asignacion-mesa/asignadas/usuario/${userId}`);
      })
      .then(res => {
        setMesasAsignadas(res.data);
      })
      .catch(err => {
        console.error("Error al cargar datos del usuario logueado", err);
      });
  }, []);

  return (
    <div>
      <h2>Mesas asignadas {idUsuarioLogueado ? `para el usuario ${idUsuarioLogueado}` : ''}</h2>

      {mesasAsignadas.length === 0 ? (
        <p>No hay mesas asignadas.</p>
      ) : (
        <ul>
          {mesasAsignadas.map(mesa => (
            <li key={mesa.id}>
              Recinto: {mesa.nombreRecinto}, Mesa: {mesa.numeroMesa}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
