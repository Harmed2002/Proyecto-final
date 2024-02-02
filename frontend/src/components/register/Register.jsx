import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Spinner from '../Spinner/Spinner';

//import './Register.css';

// import FormControl from '@mui/material/FormControl';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputAdornment from '@mui/material/InputAdornment';
// import IconButton from '@mui/material/IconButton';
// import InputLabel from '@mui/material/InputLabel';
// import FormControlLabel from '@mui/material/FormControlLabel';

const defaultTheme = createTheme();

const Register = () => {
	const formRef = useRef(null);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	// const [showPassword, setShowPassword] = useState(false);
	
	// const handleClickShowPassword = () => {
	// 	setShowPassword((show) => !show);
	// };

	// const handleMouseDownPassword = (event) => {
	// 	event.preventDefault();
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			setIsLoading(true);
			const formData = new FormData(formRef.current); // Tranformo un HTML en un objet iterator
			const data = Object.fromEntries(formData)
			console.log(data);

			const response = await fetch('http://localhost:4000/api/sessions/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			setIsLoading(false);

			if (response.status == 200) {
				console.log("Usuario registrado exitosamente");
				navigate('/login');

			} else if (response.status === 401) {
				console.error('Error al intentar registrar usuario', response);

			} else {
				console.log(response)
			}

		} catch (error) {
			console.log('error al intentar registrarse', error);
		}
	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
					{isLoading ? <Spinner/> : null}
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><Person2OutlinedIcon /></Avatar>
					<Typography component="h1" variant="h5">Sign Up</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} ref={formRef} >
						<TextField margin="normal" required fullWidth id="first_name" label="First Name" name="first_name" autoComplete="first_name" autoFocus />
						<TextField margin="normal" required fullWidth id="last_name" label="Last Name" name="last_name" autoComplete="last_name" />
						<TextField type="number" margin="normal" fullWidth id="age" label="Age" name="age" autoComplete="age" />
						<TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" />
						<TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" />

						{/* <FormControl sx={{ marginTop: 2, width: '45ch' }} variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
							<OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'} 
								endAdornment={
									<InputAdornment position="end">
										<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Password" required
						/>
						</FormControl> */}
						<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Register</Button>
						<Grid container>
							<Grid item>
								<Link href="/login" variant="body2">{"Already have an account? Sign In"}</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	)
}


export default Register


