import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRoles } from '../utils/auth';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const roles = getUserRoles();

    if (roles.includes('ADMIN')) {
      navigate('/admin');
    } else if (roles.includes('USER')) {
      navigate('/user');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
}
