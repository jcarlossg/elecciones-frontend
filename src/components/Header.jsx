import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logout, getUserRoles } from '../utils/auth';

import { Stack } from '@mui/material';

// Íconos
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

export default function Header() {
  const navigate = useNavigate();
  const roles = getUserRoles();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Elecciones 2025
        </Typography>

        {isLoggedIn() ? (
          <Stack direction="row" spacing={1}>
            {roles.includes('ROLE_ADMIN') && (
              <>
                <Button
                  startIcon={<AdminPanelSettingsIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/admin')}
                >
                  Panel Admin
                </Button>

                <Button
                  startIcon={<GroupIcon />}
                  variant="contained"
                  color="info"
                  onClick={() => navigate('/usuarios')}
                >
                  Usuarios
                </Button>

                <Button
                  startIcon={<HowToVoteIcon />}
                  variant="contained"
                  color="success"
                  onClick={() => navigate('/candidatos')}
                >
                  Candidatos
                </Button>

                <Button
                  startIcon={<AssignmentIcon />}
                  variant="contained"
                  color="warning"
                  onClick={() => navigate('/asignacion')}
                >
                  Asignación
                </Button>
              </>
            )}

            {roles.includes('ROLE_USER') && (
              <Button
                startIcon={<PersonIcon />}
                variant="contained"
                color="primary"
                onClick={() => navigate('/user')}
              >
                Panel Usuario
              </Button>
            )}

            <Button
              startIcon={<LogoutIcon />}
              variant="contained"
              color="error"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </Stack>
        ) : (
          <Button
            startIcon={<LoginIcon />}
            variant="contained"
            color="success"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
