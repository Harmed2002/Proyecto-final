import { useState, useEffect, useRef } from 'react';
import Spinner from '../../components/Spinner/Spinner';
import { useNavigate, Link } from 'react-router-dom';
import { getCookiesByName } from "../../utils/formsUtils.js";
import image from '../../assets/images/fake-img.png';
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
import TableActionsComponent from '../../components/tableActions/TableActionsComponent';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import Container from '@mui/material/Container';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from "@mui/material/Alert";


const defaultTheme = createTheme();


const styles = {
	containerTitle: {
		textAlign: "center",
		paddingTop: 20,
	},
};

// Estilo para el modal
const style = {
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
	const [open, setOpen] = useState(false);
	const formRef = useRef(null);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("");

	// Paginación
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

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
				const response = await fetch('http://localhost:4000/api/products', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				})

				if (response.status == 200) {
					const data = await response.json();
					setProducts(data.docs);

				} else if (response.status === 401) {
					const datos = await response.json()
					console.error('Error al acceder a productos, debes iniciar sessión', datos);
					navigate('/')

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

	function ccyFormat(num) {
		return `${num.toFixed(2)}`;
	}

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

				setTimeout(() => {
					setShowMessage(false);
				}, 3000);
			}

		} catch (error) {
			console.log('Error al crear producto', error);
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
					<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
						<Box sx={style}>							
							<Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
								<Typography component="h1" variant="h5">Edit Product</Typography>

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
										<TextField type="number" margin="normal" required fullWidth id="price" label="Price" name="price" autoComplete="price" style={{ margin: 10, width: 170 }} />
										<TextField type="number" margin="normal" required fullWidth id="stock" label="Stock" name="stock" autoComplete="stock" style={{ margin: 10, width: 160 }} />
									</Stack>
								</Box>
								<Stack spacing={50} direction='row'>
									<Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, margin: 10 }}>Create</Button>
								</Stack>
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
												<StyledTableCell width="10%">{prod.category}</StyledTableCell>
												<StyledTableCell width="10%">{prod.thumbnail}</StyledTableCell>
												<StyledTableCell width="5%" align="right">{prod.stock}</StyledTableCell>
												<StyledTableCell width="5%" align="right">{ccyFormat(prod.price)}</StyledTableCell>
												<StyledTableCell width="5%" align="right">{prod.status}</StyledTableCell>
												<TableActionsComponent product = { prod } handleOpen = { handleOpen } handleClose = { handleClose }/>
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
