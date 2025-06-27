import { jwtDecode } from 'jwt-decode';
export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  window.location.reload();
}

export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      logout();
      return false;
    }
    return true;
  } catch {
    logout();
    return false;
  }
}

export function getUserRoles() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  
  // Decodificar token (puede ser con jwt-decode o método propio)
  const payload = JSON.parse(atob(token.split('.')[1]));

  // Limpiar espacios de roles
  return (payload.roles || []).map(r => r.trim());
}
