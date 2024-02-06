/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
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


const ShopPage = () => {
    // const navigate = useNavigate();
	const [items, qtyTotal, addItemToCart, clearCart] = useContext(SalesContext);
	const [visibleButtons, setVisibleButtons] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState({});
	const token = getCookiesByName('jwtCookie');
	const [purchaseCode, setPurchaseCode] = useState(""); // Guarda el code de la compra


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


	// Envío de datos de compras
	const savePurchase = async () => {
		const cartId = userData.cart;

		// Grabo la compra
		try {
            const response = await fetch(`http://localhost:4000/api/checkout/${cartId}`, {
                method: 'POST',
				credentials: 'include',
				headers: {
					// 'Authorization': `${token}`,
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("compra realizada")
				setPurchaseCode(data.ticket.code);

            } else if (response.status === 404) {
                console.error('Error 404', response);

            } else {
                console.log("error 500", response)
            }

        } catch (error) {
            console.log('error', error);
        }

		// Limpio los valores
		// clearCart(); // Se limpia el carrito
		setVisibleButtons(true);
		// setPurchaseCode("");

		setTimeout(() => {
			clearCart(); // Se limpia el carrito
			setPurchaseCode("");
			setVisibleButtons(false);
		}, 5000);
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
												<Typography variant="h8" color="black">Email: {userData.email}</Typography><br></br>
												<Typography variant="h8" color="black">Id. Cart: {userData.cart}</Typography><br></br>
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
						{purchaseCode && <MessageSuccess purchaseCode={purchaseCode} />}
					</div>
				</div>
			{/*  <h3>El Carrito de compras está vacío</h3> } */}
		</>
	);
};

export default ShopPage;
