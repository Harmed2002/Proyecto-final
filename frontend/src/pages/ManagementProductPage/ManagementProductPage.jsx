/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from 'react';
import Spinner from '../../components/Spinner/Spinner.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { getCookiesByName } from "../../utils/formsUtils.js";
// import image from '../../assets/images/fake-img.png';
// MUI
import { createTheme, ThemeProvider, styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { Typography, Button } from '@mui/material';
// import TableActionsComponent from '../../components/tableActions/TableActionsComponent';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from "@mui/material/Alert";
import Tooltip from '@mui/material/Tooltip';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import Image from '@mui/icons-material/Image.js'


const defaultTheme = createTheme();


const styles = {
	containerTitle: {
		textAlign: "center",
		paddingTop: 20,
	},
};

// Estilo para el modal edit
const styleEdit = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 800,
	height: 500,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

// Estilo para el modal delete
const styleDelete = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	height: 300,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const stylePhoto = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	height: 250,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
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


const ManagementProductPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [products, setProducts] = useState([]);
	// const [prod, setProd] = useState([]);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openChangePhoto, setOpenChangePhoto] = useState(false);
	const formRef = useRef(null);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("");
	const [editedProd, setEditedProd] = useState({_id: '', code: '', title: '', description: '', price: 0, stock: 0, category: '', status: true, thumbnail: ''});
	const [deletedProd, setDeletedProd] = useState({_id: '', code: '', title: '', description: '', price: 0, stock: 0, category: '', status: true, thumbnail: ''});
	const [selectedFile, setSelectedFile] = useState();

	// Paginación
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const token = getCookiesByName('jwtCookie');

	const handleEdit = (prod) => {
		setEditedProd(prod);
		setOpenEdit(true);
	};

	const handleDelete = (prod) => {
		setDeletedProd(prod);
		setOpenDelete(true);
	};

	const handleUploadPhoto = (prod) => {
		setEditedProd(prod);
		setOpenChangePhoto(true);
	};

	const handleClose = () => {
		setEditedProd({_id: '', code: '', title: '', description: '', price: 0, stock: 0, category: '', status: true, thumbnail: ''});
		setOpenEdit(false);
		setOpenDelete(false);
		setOpenChangePhoto(false);
	};

	const handleInputChange = (e) => {
		// Actualiza el cursor local con los cambios
		const { name, value } = e.target;
		// Crear un nuevo objeto con los cambios, sin actualizar directamente el estado
		const updatedRecord = { ...editedProd, [name]: value };
		setEditedProd(updatedRecord);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Obtengo el listado de productos
	useEffect(() => {
		const getProducts = async () => {
			setIsLoading(true);

			try {
				// Obtengo todos los productos
				const response = await fetch('http://localhost:4000/api/products/products-management', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Authorization': `${token}`,
						'Content-Type': 'application/json'
					},
				})

				if (response.status == 200) {
					const data = await response.json();
					setProducts(data.docs);

				} else if (response.status === 401) {
					const datos = await response.json()
					console.error('Error al acceder a productos, debes iniciar sessión', datos);
					navigate('/login')

				} else {
					const data = await response.json();
					console.log("Error", data)
				}

			} catch (error) {
				console.log('Error al intentar acceder a esta url', error);
			}

			setIsLoading(false);
		};

		getProducts();

	}, []);

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14,
		},
	}));

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0,
		},
	}));

	function TablePaginationActions(props) {
		const theme = useTheme();
		const { count, page, rowsPerPage, onPageChange } = props;

		const handleFirstPageButtonClick = (event) => {
			onPageChange(event, 0);
		};

		const handleBackButtonClick = (event) => {
			onPageChange(event, page - 1);
		};

		const handleNextButtonClick = (event) => {
			onPageChange(event, page + 1);
		};

		const handleLastPageButtonClick = (event) => {
			onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
		};

		return (
			<Box sx={{ flexShrink: 0, ml: 2.5 }}>
				<IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
					{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
				</IconButton>
				<IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
					{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
				</IconButton>
				<IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
					{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
				</IconButton>
				<IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
					{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
				</IconButton>
			</Box>
		);
	}

	TablePaginationActions.propTypes = {
		count: PropTypes.number.isRequired,
		onPageChange: PropTypes.func.isRequired,
		page: PropTypes.number.isRequired,
		rowsPerPage: PropTypes.number.isRequired,
	};

	const saveDelete = async () => {
		try {
			// console.log(products);
			const idToDelete = deletedProd._id;

			const response = await fetch(`http://localhost:4000/api/products/${idToDelete}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Authorization': `${token}`,
					'Content-Type': 'application/json'
				},
				// body: JSON.stringify(deletedProd)
			});

			if (response.status == 201) {
				console.log("Producto eliminado con éxito");
				setShowMessage(true);
				setMessage("Producto eliminado exitosamente");
				setSeverity("success");

				// Borro el registro del array de productos
				const newArrayData = products.filter(item => item._id !== idToDelete);
				setProducts(newArrayData);

				setTimeout(() => {
					handleClose();
				}, 3000);
			}

		} catch (error) {
			console.log('Error al eliminar producto', error);
		}
	}

	const uploadPhoto = async () => {
		try {
			const idProd = editedProd._id;
			const formData = new FormData();
			formData.append('idProd', idProd); // Adiciono el id de producto
			formData.append('thumbnail', selectedFile); // Adiciono la imagen

			const response = await fetch(`http://localhost:4000/api/products/upload`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			if (response.status == 200) {
				// Obtengo el nombre modificado por Multer de la foto cargada
				const data = await response.json();
				const { namePhoto } = data;
				editedProd.thumbnail = namePhoto; // Actualizo la imagen en el listado
				
				console.log("Imagen de producto cargada con éxito");
				setShowMessage(true);
				setMessage("Imagen de producto cargada exitosamente");
				setSeverity("success");
				
				setTimeout(() => {
					setShowMessage(false);
					handleClose();
				}, 3000);

			} else if (response.status === 401) {
				const datos = await response.json();
				console.error('Error al intentar cargar imagen', datos);
				setShowMessage(true);
				setMessage("Acceso no autorizado");
				setSeverity("error");

				setTimeout(() => {
					setShowMessage(false);
				}, 3000);

			} else {
				console.log(response);
				setShowMessage(true);
				setMessage("Debe seleccionar la imagen");
				setSeverity("error");

				setTimeout(() => {
					setShowMessage(false);
				}, 3000);
			}


		} catch (error) {
			console.log('Error al cargar imagen', error);
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData(formRef.current);
			const data = Object.fromEntries(formData);
			const id = editedProd._id;

			const response = await fetch(`http://localhost:4000/api/products/${id}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Authorization': `${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editedProd)
			});

			if (response.status == 201) {
				console.log("Producto actualizado con éxito");
				setShowMessage(true);
				setMessage("Producto actualizado exitosamente");
				setSeverity("success");

				// Se actualizan los cambios en el listado
				const updatedData = products.map((record) =>
					record._id === editedProd._id ? editedProd : record
				);
				setProducts(updatedData);

				setTimeout(() => {
					handleClose();
				}, 3000);

			} else if (response.status === 401) {
				const datos = await response.json();
				console.error('Error al intentar actualizar producto', datos);

			} else {
				console.log(response);
				setShowMessage(true);
				setMessage("Debe digitar todos los datos requeridos");
				setSeverity("error");

				setTimeout(() => {
					setShowMessage(false);
				}, 3000);
			}

		} catch (error) {
			console.log('Error al actualizar producto', error);
		}

	}


	return (
		<ThemeProvider theme={defaultTheme}>
			<div style={styles.containerTitle}>
				<h2>Product List</h2>
			</div>
			<Container component="main">
				<CssBaseline />
				{isLoading ? <Spinner /> : null}

				<Box sx={{ marginBottom: '10px' }}>
					<Link to="/new-product">
						<Button variant="contained" startIcon={<PlaylistAddOutlinedIcon />}>New Product</Button>
					</Link>
				</Box>

				<div>
					{/* Modal de edición */}
					<Modal open={openEdit} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
						<Box sx={styleEdit}>							
							<Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
								<Typography component="h1" variant="h5">Edit Product</Typography>

								<Box component="form" onSubmit={handleSubmit} noValidate sx={{ margin: 2, bgcolor: '#f8edeb', mt: 1 }} ref={formRef} >
									<Stack spacing={1} direction='row'>
										<TextField margin="normal" required fullWidth id="code" name="code" label="Code" autoComplete="code" 
											autoFocus style={{ margin: 10, width: 150 }} value={editedProd.code || ''} onChange={ handleInputChange } />
										
										<TextField margin="normal" required fullWidth id="title" name="title" label="Title" autoComplete="title" 
											style={{ margin: 10, width: 500 }} value={editedProd.title || ''} onChange={ handleInputChange } />
									</Stack>
									<TextField margin="normal" required fullWidth multiline rows={5} id="description" name="description" label="Description" 
										autoComplete="description" style={{ margin: 10, width: 670 }} value={editedProd.description || ''} onChange={ handleInputChange } />
									<Stack spacing={1} direction='row'>
										<TextField id="category" name="category" select label="Category" defaultValue="jewelery" helperText="Please select a category" style={{ margin: 10, width: 300 }} >
											{categories.map((option) => (
												<MenuItem key={option.value} value={option.value || editedProd.category}>
													{option.label}
												</MenuItem>
											))}
										</TextField>
										<TextField type="number" margin="normal" required fullWidth id="price" name="price" label="Price" autoComplete="price" 
											style={{ margin: 10, width: 170 }} value={editedProd.price || 0} onChange={ handleInputChange } />
										<TextField type="number" margin="normal" required fullWidth id="stock" name="stock" label="Stock" autoComplete="stock" 
											style={{ margin: 10, width: 160 }} value={editedProd.stock || 0} onChange={ handleInputChange } />
									</Stack>
									<Stack spacing={2} direction='row'>
										<Button type="submit" variant="contained" startIcon={<ChangeCircleOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }}>Update</Button>
										<Button variant="contained" startIcon={<CancelOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }} color="secondary" onClick={handleClose}>Cancel</Button>
									</Stack>
								</Box>
							</Box>
							<Stack sx={{ width: "100%" }} spacing={2}>
								{showMessage && <Alert severity={severity}>{message}</Alert>}
							</Stack>
						</Box>
					</Modal>

					{/* Modal de eliminación */}
					<Modal open={openDelete} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
						<Box sx={styleDelete}>							
							<Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
								<Typography component="h1" variant="h5">Delete Product</Typography>

								<Box sx={{ margin: 2, bgcolor: '#f8edeb', mt: 1 }} >
									<Typography component="h6" variant="h6">Product code {deletedProd.code}: {deletedProd.title}</Typography><br></br>
									<Typography component="h6" variant="h6">Do you really want to delete this record?</Typography>
									<Stack spacing={2} direction='row'>
										<Button variant="contained" startIcon={<DeleteOutlineOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }} onClick={saveDelete}>Delete</Button>
										<Button variant="contained" startIcon={<CancelOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }} color="secondary" onClick={handleClose}>Cancel</Button>
									</Stack>
								</Box>
							</Box>
							<Stack sx={{ width: "100%" }} spacing={2}>
								{showMessage && <Alert severity={severity}>{message}</Alert>}
							</Stack>
						</Box>
					</Modal>

					{/* Modal upload foto */}
					<Modal open={openChangePhoto} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
						<Box sx={stylePhoto}>							
							<Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
								<Typography component="h1" variant="h5">Upload Photo</Typography>

								<Box sx={{ margin: 2, bgcolor: '#f8edeb', mt: 1 }} >
									<Typography component="h6" variant="h6">Product code {editedProd.code}: {editedProd.title}</Typography><br></br>
									<input type="file" name="thumbnail" id="thumbnail" accept="image/*" style={{height: 35}} onChange={(e) => setSelectedFile(e.target.files[0])} />
									
									<Stack spacing={2} direction='row'>
										<Button variant="contained" startIcon={<CloudUploadOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }} onClick={uploadPhoto}>Upload</Button>
										<Button variant="contained" startIcon={<CancelOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }} color="secondary" onClick={handleClose}>Cancel</Button>
									</Stack>
								</Box>
							</Box>
							<Stack sx={{ width: "100%" }} spacing={2}>
								{showMessage && <Alert severity={severity}>{message}</Alert>}
							</Stack>
						</Box>
					</Modal>
				</div>

				<TableContainer component={Paper}>
					<Box>
						{
							products.length > 0 ?
								<Table sx={{ width: '100%', height: '30%' }} aria-label="customized table" stickyHeader>
									<TableHead>
										<TableRow>
											<StyledTableCell>Code</StyledTableCell>
											<StyledTableCell>Description</StyledTableCell>
											<StyledTableCell>Category</StyledTableCell>
											<StyledTableCell>image</StyledTableCell>
											<StyledTableCell align="right">Stock</StyledTableCell>
											<StyledTableCell align="right">Price</StyledTableCell>
											<StyledTableCell align="right">Status</StyledTableCell>
											<StyledTableCell>Actions</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{products.map((prod) => (
											<StyledTableRow key={prod._id}>
												<StyledTableCell width="5%">{prod.code}</StyledTableCell>
												<StyledTableCell width="40%">{prod.title}</StyledTableCell>
												<StyledTableCell width="15%">{prod.category}</StyledTableCell>
												{/* <StyledTableCell width="10%">{prod.thumbnail}</StyledTableCell> */}
												<StyledTableCell width="10%">
													{prod.thumbnail && (
														<img src={`http://localhost:4000/static/${prod.thumbnail}`} width="30" height="30"/>
													)}
												</StyledTableCell>
												<StyledTableCell width="5%" align="right">{prod.stock}</StyledTableCell>
												<StyledTableCell width="5%" align="right">{prod.price.toFixed(2)}</StyledTableCell>
												<StyledTableCell width="5%" align="right">{prod.status}</StyledTableCell>
												{/* <TableActionsComponent code = { prod.code } handleOpen = { handleOpen } handleClose = { handleClose }/> */}
												<StyledTableCell width="10%" align="right">
													<Stack spacing={1} direction='row'>
														<Tooltip title='Upload Photo' placement='left'>
															<IconButton size='small' onClick={ () => handleUploadPhoto(prod) }><AddAPhotoOutlinedIcon /></IconButton>
														</Tooltip>
														
														<Tooltip title='Edit' placement='bottom-end'>
															<IconButton size='small' onClick={ () => handleEdit(prod) }><EditOutlinedIcon /></IconButton>
														</Tooltip>

														<Tooltip title='Delete' placement='right'>
															<IconButton size='small' onClick={ () => handleDelete(prod) }><DeleteOutlineOutlinedIcon /></IconButton>
														</Tooltip>
													</Stack>
												</StyledTableCell>
											</StyledTableRow>
										))}
										{/* {emptyRows > 0 && (
											<TableRow style={{ height: 53 * emptyRows }}>
												<TableCell colSpan={6} />
											</TableRow>
										)} */}
									</TableBody>
									<TableFooter>
										<TableRow>
											<TablePagination
												rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
												colSpan={3}
												count={products.length}
												rowsPerPage={rowsPerPage}
												page={page}
												SelectProps={{ inputProps: {'aria-label': 'rows per page', }, native: true, }}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
												ActionsComponent={TablePaginationActions}
											/>
										</TableRow>
									</TableFooter>
								</Table>
							: <Typography>There are no products</Typography>
						}
					</Box>
				</TableContainer>
			</Container>
		</ThemeProvider>
	);
};

export default ManagementProductPage;
