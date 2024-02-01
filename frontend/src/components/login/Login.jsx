import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Spinner from '../Spinner/Spinner';


const defaultTheme = createTheme();

const Login = () => {
	const formRef = useRef(null);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		
		try {
			const datForm = new FormData(formRef.current); // Tranformo un HTML en un objet iterator
			const data = Object.fromEntries(datForm);
			
			const response = await fetch('http://localhost:4000/api/sessions/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
	
			if (response.status == 200) {
				const datos = await response.json();
				// Creo el token
				// document.cookie = `jwtCookie=${datos.token}; SameSite=None; Secure; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}; path=/;`;
				document.cookie = `jwtCookie=${datos.token}; SameSite=None; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()}; path=/;`;
				// console.log("COOK", datos.token);
				navigate('/products');
			
			} else if (response.status === 401) {
				const datos = await response.json();
				console.log(datos);
				console.error('Credenciales incorrectas. Por favor, verifica tus datos de entrada.', response);
			
			} else {
				const datos = await response.json();
				console.log("RESPONSE", datos)
			}
			setIsLoading(false);

		} catch (error) {
			console.log('error al loguearse', error);
		}

	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
					{isLoading ? <Spinner/> : null}
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
					<Typography component="h1" variant="h5">Sign In</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} ref={formRef} >
						<TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
						<TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
						<FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">Forgot password?</Link>
							</Grid>
							<Grid item>
								<Link href="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);

}

export default Login