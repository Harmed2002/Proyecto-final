/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, createContext } from "react";

export const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
	const [items, setItems] = useState([]);
	
	const [qtyTotal, setQtyTotal] = useState(0)

	// Función para agregar item al carrito
	const addItemToCart = (newItem) => {
		// Si el objeto tiene items
		if (items.length > 0 && newItem) {
			// Se verifica si el nuevo item ya existe en el carrito
			const itemIndex = items.findIndex(item => item.id == newItem.id);

			// si lo encuentra, incrementa la cantidad seleccionada
			if (itemIndex >= 0) {
				const newProducts = structuredClone(items);
				newProducts[itemIndex].quantity += newItem.quantity;
				setItems(newProducts);
			} else {
				// si no lo encuentra, inserta un nuevo item
				if (newItem) items.push(newItem);
				// setItems(newItem);
			}

		} else {
			// Si el objeto no tiene ningún item
			if (newItem) items.push(newItem);
		}
		const qtyTot = items.reduce((acum, el) => acum + el.quantity, 0);
		setQtyTotal(qtyTot);	
	}

	// Función para limpiar el carrito
	const clearCart = () => {
		// setItems([]);
		items.length = 0;
		setQtyTotal(0);
	}

	return (
		<SalesContext.Provider value={[items, qtyTotal, addItemToCart, clearCart]}>
			{children}
		</SalesContext.Provider>
	);
};
