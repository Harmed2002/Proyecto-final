/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Card, CardContent, CardMedia, Typography, CardActionArea, CardActions, Button } from "@mui/material";
// import { AddShoppingCartIcon, VpnKeyOutlined } from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';
import MessageSuccess from "../../components/MessageSuccess/MessageSuccess";
import PurchaseDetails from "../../components/PurchaseDetails/PurchaseDetails";
import { getCookiesByName } from '../../utils/formsUtils';
import "./ShopPage.css";

// Context
import { SalesContext } from "../../context/SalesContext";


const initialState = {
	name: "",
	lastname: "",
	phone: "",
	email: "",
};

const ShopPage = () => {
	const token = getCookiesByName('jwtCookie');
    const navigate = useNavigate();
	// const outerTheme = useTheme();
	const [values, setValues] = useState(initialState); // Para setear los datos del form
	const [purchaseID, setPurchaseID] = useState(""); // Guarda el id de la compra
	const [items, qtyTotal, addItemToCart, clearCart] = useContext(SalesContext);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [visibleButtons, setVisibleButtons] = useState(false);

	useEffect(() => {
		setVisibleButtons(items.length == 0 ? false : true);
	}, [items]);

	// Obtengo los datos del usr logueado
	useEffect(() => {
		
	}, [items]);

	// Manejador de los campos del formulario
	const handleOnChange = (e) => {
		const { value, name } = e.target;
		setValues({ ...values, [name]: value });
	};

	// Envío de datos del formulario
	const savePurchase = async () => {
		// Valido que el campo de email no esté vacío
		setEmailError(false);
        if (email == '') {
            setEmailError(true)
        }

		// Convierto el array en un objeto
		const object = items.reduce((acc, item) => {
			acc[item.id] = item
			return acc
		}, {})

		// Obtengo la fecha actual
		const todayTime = new Date(Date.now());
		const today = todayTime.getFullYear().toString() + '-' + (todayTime.getMonth() + 1).toString().padStart(2, '0') + '-' + todayTime.getDate().toString();

		// Grabo los datos de la compra y obtengo el id generado de la misma
		const docRef = await addDoc(collection(db, "purchases"), {values, items: object, date: today});
		setPurchaseID(docRef.id);
		setValues(initialState); // Se limpia el form
		clearCart(); // Se limpia el carrito
		setVisibleButtons(true);
	};

	return (
		<>
			{/* {(items && items.length > 0) ?  */}
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
										<hr color="black"></hr>
										{ token ?
											<Typography variant="h8" color="black">{token}</Typography>
										:	<Typography variant="h8" color="black">There is no personal information. You must be logged in to complete the purchase</Typography>
										}
									</CardContent>
									<CardActionArea>
										<CardActions sx={{ backgroundColor:'white' }} >
											{ token ? null : <Button variant="contained" fullWidth onClick={ () => navigate('/login') } startIcon={<VpnKeyOutlined />}>Login</Button> }
											{ token ? <Button variant="contained" color="success" fullWidth onClick={ () => savePurchase() } startIcon={<AddShoppingCartIcon />}>Finish purchase</Button> : null }
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
