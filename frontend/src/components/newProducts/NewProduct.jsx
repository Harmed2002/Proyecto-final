import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCookiesByName } from "../../utils/formsUtils.js";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from "@mui/material/Alert";


const defaultTheme = createTheme();

const styles = {
	containerTitle: {
		textAlign: "center",
		paddingTop: 20,
	},
};

const categories = [
	{
		value: "men's clothing",
		label: "men's clothing",
	},
	{
		value: "jewelery",
		label: "jewelery",
	},
	{
		value: "electronics",
		label: "electronics",
	},
	{
		value: "women's clothing",
		label: "women's clothing",
	},
];


export const NewProducts = () => {
	const formRef = useRef(null);
	const navigate = useNavigate();
	const [showMessage, setShowMessage] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData(formRef.current);
			const data = Object.fromEntries(formData);
			const token = getCookiesByName('jwtCookie');

			const response = await fetch('http://localhost:4000/api/products', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Authorization': `${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (response.status == 201) {
				console.log("Producto creado con éxito");
				
				setShowMessage(true);

				setTimeout(() => {
					navigate('/management');
				}, 3000);

			} else if (response.status === 401) {
				const datos = await response.json()
				console.error('Error al intentar crear producto', datos);

			} else {
				console.log(response);
			}

		} catch (error) {
			console.log('Error al crear producto', error);
		}

	}


	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={{ marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
					<Typography component="h1" variant="h5">New Product</Typography>

					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ margin: 2, bgcolor: '#f8edeb', mt: 1 }} ref={formRef} >
						<Stack spacing={1} direction='row'>
							<TextField margin="normal" required fullWidth id="code" label="Code" name="code" autoComplete="code" autoFocus style={{ margin: 10, width: 150 }} />
							<TextField margin="normal" required fullWidth id="title" label="Title" name="title" autoComplete="title" style={{ margin: 10, width: 500 }} />
						</Stack>
						<TextField margin="normal" required fullWidth multiline rows={5} id="description" label="Description" name="description" autoComplete="description" style={{ margin: 10, width: 670 }} />
						<Stack spacing={1} direction='row'>
							<TextField id="category" name="category" select label="Category" defaultValue="jewelery" helperText="Please select a category" style={{ margin: 10, width: 300 }} >
								{categories.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
							<TextField type="number" margin="normal" fullWidth id="price" label="Price" name="price" autoComplete="price" style={{ margin: 10, width: 170 }} />
							<TextField type="number" margin="normal" fullWidth id="stock" label="Stock" name="stock" autoComplete="stock" style={{ margin: 10, width: 160 }} />
						</Stack>
						<Stack spacing={50} direction='row'>
							<Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, margin: 10 }}>Create</Button>
							<Link href="/management">{"Return to list product"}</Link>
						</Stack>
					</Box>
				</Box>
			</Container>
			<Stack sx={{ width: "100%" }} spacing={2}>
				{showMessage && <Alert severity="success">Producto creado exitosamente</Alert>}
			</Stack>
		</ThemeProvider>
	)
}

export default NewProducts;
