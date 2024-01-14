/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { TextField } from '@mui/material';
import MessageSuccess from "../../components/MessageSuccess/MessageSuccess";
import PurchaseDetails from "../../components/PurchaseDetails/PurchaseDetails";
// Context
import { SalesContext } from "../../context/SalesContext";
// Firebase
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import "./ShopPage.css";

const initialState = {
	name: "",
	lastname: "",
	phone: "",
	email: "",
};

const ShopPage = () => {
	// const outerTheme = useTheme();
	const [values, setValues] = useState(initialState); // Para setear los datos del form
	const [purchaseID, setPurchaseID] = useState(""); // Guarda el id de la compra
	const [items, qtyTotal, addItemToCart, clearCart] = useContext(SalesContext);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [disabledButton, setDisabledButton] = useState(true);

	useEffect(() => {
		setDisabledButton(items.length == 0 ? true : false);
	}, [items]);

	// Manejador de los campos del formulario
	const handleOnChange = (e) => {
		const { value, name } = e.target;
		setValues({ ...values, [name]: value });
	};

	// Envío de datos del formulario
	const onSubmit = async (e) => {
		e.preventDefault();

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

		// Add a new document with a generated id.
		const docRef = await addDoc(collection(db, "purchases"), {values, items: object, date: today});
		setPurchaseID(docRef.id);
		setValues(initialState); // Se limpia el form
		clearCart(); // Se limpia el carrito
		setDisabledButton(true);
	};

	return (
		<>
			{/* {(items && items.length > 0) ?  */}
				<div className='containerShop'>
					<div className='detailsContainer'>
						<h2>Purchase Details</h2>
						<PurchaseDetails />
					</div>
					<div className="FormContainer">
						<h2>Personal Information</h2>
						<form onSubmit={onSubmit}>
							<TextField 
								color="secondary"
								placeholder="Name"
								style={{ margin: 10, width: 500 }}
								name="name"
								value={values.name}
								onChange={handleOnChange}
								label="Name"
								required
							/>
							<TextField
								color="secondary"
								placeholder="Last Name"
								style={{ margin: 10, width: 500 }}
								name="lastname"
								value={values.lastname}
								onChange={handleOnChange}
								label="Last Name"
								required
							/>
							<TextField
								color="secondary"
								placeholder="Phone"
								style={{ margin: 10, width: 500 }}
								name="phone"
								value={values.phone}
								onChange={handleOnChange}
								label="Phone"
							/>
							<TextField
								color="secondary"
								placeholder="Email"
								style={{ margin: 10, width: 500 }}
								name="email"
								value={values.email}
								onChange={handleOnChange}
								label="Email"
								type="email"
								required
								onBlur={e => setEmail(e.target.value)}
								error={emailError}
							/>
							<button className="btnASendAction" type="submit" disabled={disabledButton}>Finalizar Compra</button>
						</form>
						{purchaseID && <MessageSuccess purchaseID={purchaseID} />}
					</div>
				</div>
			{/*  <h3>El Carrito de compras está vacío</h3> } */}
		</>
	);
};

export default ShopPage;
