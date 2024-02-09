/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

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
import Alert from "@mui/material/Alert";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const defaultTheme = createTheme();

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
	id: 'upload',
	name: 'upload',
});


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
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const [file, setFile] = useState();

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
				setMessage("Producto creado exitosamente");
				setSeverity("success");
				setIsSubmitting(true);

				setTimeout(() => {
					navigate('/management');
				}, 3000);

			} else if (response.status === 401) {
				const datos = await response.json();
				console.error('Error al intentar crear producto', datos);

			} else {
				console.log(response);
				setShowMessage(true);
				setMessage("Debe digitar todos los datos requeridos");
				setSeverity("error");
				setIsSubmitting(false);

				setTimeout(() => {
					setShowMessage(false);
				}, 3000);
			}

		} catch (error) {
			console.log('Error al crear producto', error);
		}

	}

	// const upload = () => {
		
	// }

	
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
						<Stack spacing={1} direction='row'>
							<TextField margin="normal" required fullWidth multiline rows={5} id="description" label="Description" name="description" autoComplete="description" style={{ margin: 10, width: 669 }} />
						</Stack>
						{/* <Stack spacing={1} direction='row'> */}
							{/* <Stack spacing={1} direction='col'> */}
								{/* <img src="https://www.example.com/images/dinosaur.jpg" width="280" height="130" /> */}
								{/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
								{/* <button type="button" onClick={upload}>Upload</button> */}
								{/* <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>Upload File<VisuallyHiddenInput type="file" /></Button> */}
							{/* </Stack> */}
						{/* </Stack> */}
						<Stack spacing={1} direction='row'>
							<TextField id="category" name="category" select label="Category" defaultValue="jewelery" helperText="Please select a category" style={{ margin: 10, width: 300 }} >
								{categories.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
							<TextField type="number" margin="normal" required fullWidth id="price" label="Price" name="price" autoComplete="price" style={{ margin: 10, width: 170 }} />
							<TextField type="number" margin="normal" required fullWidth id="stock" label="Stock" name="stock" autoComplete="stock" style={{ margin: 10, width: 160 }} />
						</Stack>
						<Stack spacing={1} direction='row'>
							<Button type="submit" variant="contained" startIcon={<SaveOutlinedIcon />} disabled={Boolean(isSubmitting)} sx={{ mt: 3, mb: 2, margin: 10 }}>Save</Button>
							{/* <Button component="label" name="photos" id="photos" variant="contained" color="secondary" onChange={(e) => setFile(e.target.files[0])} startIcon={<CloudUploadIcon />}>Select Image<VisuallyHiddenInput type="file" /></Button> */}
							<Button variant="contained" color="secondary" href="/management">Return to list</Button>
							{/* <input type="file" name="thumbnail" id="thumbnail" style={{height: 22}} onChange={(e) => setFile(e.target.files[0])} /> */}
						</Stack>
					</Box>
				</Box>
			</Container>
			<Stack sx={{ width: "100%" }} spacing={2}>
				{showMessage && <Alert severity={severity}>{message}</Alert>}
			</Stack>
		</ThemeProvider>
	)
}

export default NewProducts;
