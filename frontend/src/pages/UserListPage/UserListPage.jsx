/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from 'react';
import Spinner from '../../components/Spinner/Spinner.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { getCookiesByName } from "../../utils/formsUtils.js";
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


const UserListPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [openDelete, setOpenDelete] = useState(false);
	const formRef = useRef(null);
	const [showMessage, setShowMessage] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState("");
	const [selectedUser, setSelectedUser] = useState({ _id: '', code: '', title: '', description: '', price: 0, stock: 0, category: '', status: true, thumbnail: '' });

	// Paginación
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const token = getCookiesByName('jwtCookie');

	const handleDelete = (usr) => {
		setSelectedUser(usr);
		setOpenDelete(true);
	};

	const handleClose = () => {
		setOpenDelete(false);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Obtengo el listado de usuarios
	useEffect(() => {
		const getUsers = async () => {
			setIsLoading(true);

			try {
				// Obtengo todos los usuarios
				const response = await fetch('http://localhost:4000/api/users', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Authorization': `${token}`,
						'Content-Type': 'application/json'
					},
				})

				if (response.status == 200) {
					const data = await response.json();
					setUsers(data);

				} else if (response.status === 404) {
					const datos = await response.json()
					console.error('No existen usuarios en la BD', datos);
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

		getUsers();

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

	const deleteUser = async () => {
		try {
			const idToDelete = selectedUser._id;
			// console.log("idToDelete", idToDelete);

			const response = await fetch(`http://localhost:4000/api/users/${idToDelete}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Authorization': `${token}`,
					'Content-Type': 'application/json'
				},
			});

			if (response.status == 200) {
				console.log("Usuario eliminado con éxito");
				setShowMessage(true);
				setMessage("Usuario eliminado exitosamente");
				setSeverity("success");

				// Borro el registro del array de usuarios
				const newArrayData = users.filter(item => item._id !== idToDelete);
				setUsers(newArrayData);

				setTimeout(() => {
					handleClose();
				}, 3000);
			}

		} catch (error) {
			console.log('Error al eliminar usuario', error);
		}
	}

	// En formato AAAA-MM-DDTHH:MM:SS
	const MinutesBetweenDates = (initialDate, finalDate) => {
		return (new Date(finalDate).getTime() - new Date(initialDate).getTime()) / 60000;
	}


	return (
		<ThemeProvider theme={defaultTheme}>
			<div style={styles.containerTitle}>
				<h2>User List</h2>
			</div>
			<Container component="main">
				<CssBaseline />
				{isLoading ? <Spinner /> : null}

				<div>
					{/* Modal de eliminación */}
					<Modal open={openDelete} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
						<Box sx={styleDelete}>
							<Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
								<Typography component="h1" variant="h5">Delete User</Typography>

								<Box sx={{ margin: 2, bgcolor: '#f8edeb', mt: 1 }} >
									<Typography component="h6" variant="h6">User email: {selectedUser.email}</Typography>
									<Typography component="h6" variant="h6">This user is more than 30 minutes old since last login</Typography><br></br>
									<Typography component="h6" variant="h6">Do you really want to delete this user?</Typography>
									<Stack spacing={2} direction='row'>
										<Button variant="contained" startIcon={<DeleteOutlineOutlinedIcon />} sx={{ mt: 3, mb: 2, margin: 10 }} onClick={deleteUser}>Delete</Button>
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
							users.length > 0 ?
								<Table sx={{ width: '100%', height: '30%' }} aria-label="customized table" stickyHeader>
									<TableHead>
										<TableRow>
											<StyledTableCell>Nombre</StyledTableCell>
											<StyledTableCell>Age</StyledTableCell>
											<StyledTableCell>Email</StyledTableCell>
											<StyledTableCell>Role</StyledTableCell>
											<StyledTableCell>Last Connection</StyledTableCell>
											<StyledTableCell>Actions</StyledTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{users.map((usr) => (
											<StyledTableRow key={usr._id}>
												<StyledTableCell width="30%">{usr.last_name} {usr.first_name}</StyledTableCell>
												<StyledTableCell width="5%">{usr.age}</StyledTableCell>
												<StyledTableCell width="20%">{usr.email}</StyledTableCell>
												<StyledTableCell width="10%">{usr.rol}</StyledTableCell>
												<StyledTableCell width="25%">{usr.last_connection}</StyledTableCell>
												{/* <StyledTableCell width="25%">{ new Date(usr.last_connection).toISOString().split('T')[0] }</StyledTableCell> */}
												<StyledTableCell width="10%" align="right">
													{MinutesBetweenDates(usr.last_connection, Date.now()) > 30 && (
														<Stack spacing={1} direction='row'>
															<Tooltip title='Delete User' placement='right'>
																<IconButton size='small' onClick={() => handleDelete(usr)}><DeleteOutlineOutlinedIcon /></IconButton>
															</Tooltip>
														</Stack>)
													}
												</StyledTableCell>
											</StyledTableRow>
										))}
										{/* {emptyRows > 0 && (
											<TableRow style={{ height: 53 * emptyRows }}>
												<TableCell colSpan={6} />
											</TableRow>
										)} */}
									</TableBody>
									{/* <TableFooter>
										<TableRow>
											<TablePagination
												rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
												colSpan={3}
												count={users.length}
												rowsPerPage={rowsPerPage}
												page={page}
												SelectProps={{ inputProps: {'aria-label': 'rows per page', }, native: true, }}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
												ActionsComponent={TablePaginationActions}
											/>
										</TableRow>
									</TableFooter> */}
								</Table>
								: <Typography>There are no products</Typography>
						}
					</Box>
				</TableContainer>
			</Container>
		</ThemeProvider>
	);
};

export default UserListPage;
