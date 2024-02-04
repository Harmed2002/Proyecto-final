/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Card, CardContent, CardMedia, Typography, CardActionArea, CardActions, Button } from "@mui/material";
import ShoppingCartCheckoutOutlined from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';
import MessageSuccess from "../../components/MessageSuccess/MessageSuccess";
import PurchaseDetails from "../../components/PurchaseDetails/PurchaseDetails";
import { getCookiesByName } from '../../utils/formsUtils';
import Spinner from '../../components/Spinner/Spinner';
import "./ShopPage.css";

// Context
import { SalesContext } from "../../context/SalesContext";

const initialState = {
	first_name: "",
	last_name: "",
	email: "",
	rol: "",
	cart: ""
};

const ShopPage = () => {
    const navigate = useNavigate();
	// const outerTheme = useTheme();
	const [values, setValues] = useState(initialState); // Para setear los datos del form
	const [purchaseID, setPurchaseID] = useState(""); // Guarda el id de la compra
	const [items, qtyTotal, addItemToCart, clearCart] = useContext(SalesContext);
	const [email, setEmail] = useState("");
	const [visibleButtons, setVisibleButtons] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState({});
	const token = getCookiesByName('jwtCookie');

	useEffect(() => {
		setVisibleButtons(items.length == 0 ? false : true);
	}, [items]);

	// Obtengo los datos del usr logueado
	useEffect(() => {
		const getUserData = async () => {
			if (token) {
				setIsLoading(true);

				try {
					// Obtengo todos los datos del usuario
					const response = await fetch('http://localhost:4000/api/sessions/current', {
						method: 'GET',
						credentials: 'include',
						headers: {
							'Authorization': `${token}`,
							'Content-Type': 'application/json'
						},
					})

					if (response.status == 200) {
						const data = await response.json();
						setUserData(data.user);

					} else if (response.status === 401) {
						const datos = await response.json()
						console.error('Error al acceder a los datos del usuario actual', datos);
						navigate('/')

					} else {
						const data = await response.json();
						console.log("Error", data)
					}

				} catch (error) {
					console.log('Error al intentar acceder a esta url', error);
				}

				setIsLoading(false);
			}
		};

		getUserData();

	}, []);


	// Manejador de los campos del formulario
	const handleOnChange = (e) => {
		const { value, name } = e.target;
		setValues({ ...values, [name]: value });
	};

	// Envío de datos del formulario
	const savePurchase = async () => {
		// Convierto el array en un objeto
		const object = items.reduce((acc, item) => {
			acc[item.id] = item
			return acc
		}, {})

		// Obtengo la fecha actual
		const todayTime = new Date(Date.now());
		const today = todayTime.getFullYear().toString() + '-' + (todayTime.getMonth() + 1).toString().padStart(2, '0') + '-' + todayTime.getDate().toString();

		// Grabo los datos de la compra y obtengo el id generado de la misma
		try {
			const response = await fetch('http://localhost:4000/api/purchases', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`
				},
				body: JSON.stringify({
					...values,
					date: today,
					items: object
				})
			});
			if (response.status === 201) {
				const data = await response.json();
				setPurchaseID(data.purchaseID);
				setValues(initialState); // Se limpia el form
				clearCart(); // Se limpia el carrito
				setVisibleButtons(true);
			} else {
				console.log('Error al guardar la compra');
			}
		} catch (error) {
			console.log('Error al intentar acceder a esta url', error);
		}
		
		// Limpio los valores
		setValues(initialState); // Se limpia el form
		clearCart(); // Se limpia el carrito
		setVisibleButtons(true);
	};

	return (
		<>
			{/* {(items && items.length > 0) ?  */}
				{isLoading ? <Spinner/> : null}
				<div className='containerShop'>
					{
						visibleButtons ?
							<div className='detailsContainer'>
								<h2>Purchase Details</h2>
								<PurchaseDetails />
							</div>
						: <h2>No items in the shopping cart</h2>
					}

					<div className="FormContainer">
						{
							visibleButtons ?	
								<Card sx={{ width: 600, backgroundColor:'white' }}>
									<CardContent>
										<Typography variant="h5" color="black">Personal Information</Typography>
										<hr color="red"></hr>
										{ token ?
											<div>
												<Typography variant="h8" color="black">Name: {userData.first_name} {userData.last_name}</Typography><br></br>
												<Typography variant="h8" color="black">Email: {userData.email}</Typography>
											</div>
										:	
											<Typography variant="h8" color="black">There is no personal information. You must be logged in to complete the purchase</Typography>
										}
									</CardContent>
									<CardActionArea>
										<CardActions sx={{ backgroundColor:'white' }} >
											{ token ? null : <Button variant="contained" fullWidth onClick={ () => navigate('/login') } startIcon={<VpnKeyOutlined />}>Login</Button> }
											{ token ? <Button variant="contained" color="success" fullWidth onClick={ () => savePurchase() } startIcon={<ShoppingCartCheckoutOutlined />}>Finish purchase</Button> : null }
										</CardActions>
									</CardActionArea>
								</Card>
							: null
						}
						{purchaseID && <MessageSuccess purchaseID={purchaseID} />}
					</div>
				</div>
			{/*  <h3>El Carrito de compras está vacío</h3> } */}
		</>
	);
};

export default ShopPage;
