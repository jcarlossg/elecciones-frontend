import React, { useEffect, useState } from 'react';
import api from './api'; // importa tu instancia axios

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setError('No se pudo obtener el usuario'));
  }, []);

  if (error) return <div>{error}</div>;

  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Bienvenido, {user.nombre}</h2>
      <p>Usuario: {user.username}</p>
      <p>Roles: {user.roles.join(', ')}</p>
    </div>
  );
}
