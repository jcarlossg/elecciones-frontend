import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logout, getUserRoles } from '../utils/auth';
import Box from '@mui/material/Box';

export default function Header() {
    const navigate = useNavigate();
    const roles = getUserRoles();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Elecciones - Frontend
                </Typography>

                {isLoggedIn() ? (
                    <Box>
                        {roles.includes('ROLE_ADMIN') && (
                            <>
                                <Button color="inherit" onClick={() => navigate('/admin')}>
                                    Panel Admin
                                </Button>

                                <Button color="inherit" onClick={() => navigate('/usuarios')}>
                                    Usuarios
                                </Button>

                                 <Button color="inherit" onClick={() => navigate('/candidatos')}>
                                    Candidatos
                                </Button>

                                 <Button color="inherit" onClick={() => navigate('/asignacion')}>
                                    Asignacion de Mesas
                                </Button>
                            </>
                        )}
                        {roles.includes('ROLE_USER') && (

                            <>
                                <Button color="inherit" onClick={() => navigate('/user')}>
                                    Panel Usuario
                                </Button>
                            </>

                        )}
                        <Button color="inherit" onClick={handleLogout}>
                            Cerrar sesión
                        </Button>
                    </Box>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
