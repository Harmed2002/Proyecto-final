import { useRef } from "react";
import { useNavigate } from "react-router-dom";
// import './Login.css';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import NavBar from '../NavBar/NavBar';

const defaultTheme = createTheme();

const Logout = () => {
	const navigate = useNavigate();

    const exit = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/sessions/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.status === 200) {
                const data = await response.json();
                // console.log("datos", data);
                
                // Limpia el token del almacenamiento local
                localStorage.removeItem('jwtCookie');
                navigate('/login');

            } else {
                console.error(`Error al desloguearse ${await response.text()}`);
            }

        } catch (error) {
            console.error(`Error al desloguearse ${error}`);
        }
    }

	return (
		<ThemeProvider theme={defaultTheme}>
            <NavBar />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
					<Typography component="h1" variant="h5">Logout</Typography>
					<Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color="error" onClick={exit}>Confirm!</Button>
				</Box>
			</Container>
		</ThemeProvider>
	);

}

export default Logout





/* document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');

    logoutButton.addEventListener('click', async () => {
        console.log('Botón de cerrar sesión clickeado'); 
        try {
            const response = await fetch('/api/sessions/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                window.location.href = '/static/login';
            } else {
                // Manejar otros códigos de estado si es necesario
                console.log('Error en la respuesta del servidor:', response.status);
            }
        } catch (error) {
            console.error('Error durante la solicitud:', error);
        }
    });
});
*/