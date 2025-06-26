import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'; import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import ListaCandidatosCir from './pages/ListaCandidatosCir';
import ListaUsuarios from './pages/ListaUsuarios';
import RegistrarCandidatoCir from './pages/RegistrarCandidatoCir';

import { isLoggedIn } from './utils/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRoles } from './utils/auth';
import RegistrarAsignacionMesa from './pages/RegistrarAsignacionMesa';
import DetalleMesa from './pages/DetalleMesa';



function RequireAuth({ children, roles }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }
  if (roles && roles.length > 0) {
    const userRoles = getUserRoles();
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return <p>No tienes permiso para ver esta página.</p>;
    }
  }
  return children;
}

function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const roles = getUserRoles().map(r => r.trim().replace(/^ROLE_/, '')); // limpia los roles
    console.log('RootRedirect roles:', roles);

    if (roles.includes('ADMIN')) {
      navigate('/admin', { replace: true });
    } else if (roles.includes('USER')) {
      navigate('/user', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return null;
}

export default function App() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register'];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidatos" element={<ListaCandidatosCir />} />
        <Route path="/candidatos/register_candidatos" element={<RegistrarCandidatoCir />} />
        <Route path="/usuarios" element={<ListaUsuarios />} />
        <Route path="/asignacion" element={<RegistrarAsignacionMesa />} />
        <Route path="/detalle-mesa/:id" element={<DetalleMesa />} />

        <Route
          path="/user"
          element={
            <RequireAuth roles={['ROLE_USER', 'ROLE_ADMIN']}>
              <UserPage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth roles={['ROLE_ADMIN']}>
              <AdminPage />
            </RequireAuth>
          }
        />

        <Route
          path="/candidatos"
          element={
            <RequireAuth roles={['ROLE_USER', 'ROLE_ADMIN']}>
              <ListaCandidatosCir />
            </RequireAuth>
          }
        />

        <Route path="*" element={<p>404 Página no encontrada</p>} />
      </Routes>
    </>
  );
}
