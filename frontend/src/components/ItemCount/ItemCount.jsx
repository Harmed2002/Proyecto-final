/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import './ItemCount.css';


// stock => Stock actual del producto, la cantidad de compra no puede superar este valor
const ItemCount = ({ stock, newItem }) => {
	const qtyInitial = 1; 
	const [qty, setQty] = useState(qtyInitial); // La cantidad inicial de compra del producto tiene que ser >= 1

	useEffect(() => {
		newItem.quantity = qty;
	}, [newItem, qty]);

	return (
		<div className='itemCount'>
			<div className='itemControls'>
				<button onClick={ () => setQty(qty - 1) } disabled={ qty === qtyInitial }>-</button>
				<input type="text" id="cant" name="cant" disabled value={ qty }></input>
				<button onClick={ () => setQty(qty + 1) } disabled={ qty === stock }>+</button>
			</div>
		</div>
	)
}

export default ItemCount