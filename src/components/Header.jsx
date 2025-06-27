import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {
  const navigate = useNavigate();
  const roles = getUserRoles();

  const [anchorElRegistros, setAnchorElRegistros] = useState(null);
  const openRegistros = Boolean(anchorElRegistros);

  const handleOpenRegistros = (event) => {
    setAnchorElRegistros(event.currentTarget);
  };

  const handleCloseRegistros = () => {
    setAnchorElRegistros(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Función para navegar y cerrar el menú
  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseRegistros();
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #3f51b5 0%, #1a237e 100%)',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.6)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#e3f2fd',
            userSelect: 'none',
            minWidth: 160,
          }}
        >
          Elecciones 2025
        </Typography>

        {isLoggedIn() ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {roles.includes('ROLE_ADMIN') && (
              <>
                {/* Botón Registros con menú desplegable */}
                <Button
                  startIcon={<MenuIcon />}
                  variant="contained"
                  color="info"
                  onClick={handleOpenRegistros}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 3px 5px rgba(3, 169, 244, 0.4)',
                    textTransform: 'none',
                    fontWeight: '600',
                    '&:hover': {
                      backgroundColor: '#0288d1',
                      boxShadow: '0 5px 10px rgba(2, 136, 209, 0.6)',
                    },
                  }}
                >
                  Registros
                </Button>
                <Menu
                  anchorEl={anchorElRegistros}
                  open={openRegistros}
                  onClose={handleCloseRegistros}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem onClick={() => handleMenuClick('/candidatos')}>
                    Registro Candidatos
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/registro/jefes-distrito')}>
                    Registro Jefes de distrito
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/registro/delegados')}>
                    Registro de delegados
                  </MenuItem>
                </Menu>

                <Button
                  startIcon={<AdminPanelSettingsIcon />}
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/admin')}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 3px 5px rgba(156, 39, 176, 0.4)',
                    textTransform: 'none',
                    fontWeight: '600',
                    '&:hover': {
                      backgroundColor: '#7b1fa2',
                      boxShadow: '0 5px 10px rgba(123, 31, 162, 0.6)',
                    },
                  }}
                >
                  Panel Admin
                </Button>

                <Button
                  startIcon={<GroupIcon />}
                  variant="contained"
                  color="info"
                  onClick={() => navigate('/usuarios')}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 3px 5px rgba(3, 169, 244, 0.4)',
                    textTransform: 'none',
                    fontWeight: '600',
                    '&:hover': {
                      backgroundColor: '#0288d1',
                      boxShadow: '0 5px 10px rgba(2, 136, 209, 0.6)',
                    },
                  }}
                >
                  Delegados Mesa
                </Button>


                <Button
                  startIcon={<AssignmentIcon />}
                  variant="contained"
                  color="warning"
                  onClick={() => navigate('/asignacion')}
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 3px 5px rgba(255, 160, 0, 0.4)',
                    textTransform: 'none',
                    fontWeight: '600',
                    '&:hover': {
                      backgroundColor: '#ef6c00',
                      boxShadow: '0 5px 10px rgba(239, 108, 0, 0.6)',
                    },
                  }}
                >
                  Asignación de Mesas
                </Button>
              </>
            )}

            {roles.includes('ROLE_USER') && (
              <Button
                startIcon={<PersonIcon />}
                variant="contained"
                color="primary"
                onClick={() => navigate('/user')}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 3px 5px rgba(25, 118, 210, 0.4)',
                  textTransform: 'none',
                  fontWeight: '600',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 5px 10px rgba(21, 101, 192, 0.6)',
                  },
                }}
              >
                Panel Usuario
              </Button>
            )}

            <Button
              startIcon={<LogoutIcon />}
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                boxShadow: '0 3px 5px rgba(211, 47, 47, 0.4)',
                textTransform: 'none',
                fontWeight: '600',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                  boxShadow: '0 5px 10px rgba(183, 28, 28, 0.6)',
                },
              }}
            >
              Cerrar sesión
            </Button>
          </Stack>
        ) : null}
       
      </Toolbar>
    </AppBar>
  );
}
