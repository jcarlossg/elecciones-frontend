import React, { useEffect, useState } from 'react';
import api from '../api/api'; // tu instancia con interceptor JWT

export default function VerFotos() {
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    api.get('/registro-foto/todas')
      .then(res => setFotos(res.data))
      .catch(err => {
        console.error('Error al cargar fotos:', err);
        alert('Error al cargar las fotos');
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📸 Fotos Registradas</h2>
      {fotos.length === 0 ? (
        <p>No hay fotos registradas.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {fotos.map(foto => (
            <div key={foto.id} style={{ border: '1px solid #ccc', padding: 10, borderRadius: 10 }}>
              <p><strong>Mesa:</strong> {foto.idMesa}</p>
              <p><strong>Fecha:</strong> {new Date(foto.fechaRegistro).toLocaleString()}</p>
              <img
                src={foto.imagenBase64}
                alt={`Mesa ${foto.idMesa}`}
                style={{ width: 200, borderRadius: 8 }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
