/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState, useContext } from 'react';

import { Link } from "react-router-dom";
import { SalesContext } from "../../context/SalesContext";
import { Card, CardContent, CardMedia, Typography, CardActionArea, CardActions, Button } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ItemCount from "../ItemCount/ItemCount";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import image from '../../assets/images/fake-img.png';

import './CardProduct.css';


const CardProduct = ( props ) => {
	// Desestructurando:
	const { id, title, description, category, thumbnail, price, stock, detail} = props;
	const [items, qtyTotal, addItemToCart] = useContext(SalesContext);
	const [isLoading, setIsLoading] = useState(false);
	
	// Verifico que la imagen no venga vacía
	if (thumbnail.length == 0) thumbnail.push(image)

	const newItem = {
		id:				id,
		title:			title,
		description: 	description,
		category: 		category,
		thumbnail: 		thumbnail,
		price: 			price,
		quantity: 		0
	};

	const addCart = () => {
		addItemToCart(newItem);
	}

	// console.log("newItem", newItem)

	return (
		<Card sx={{ maxWidth: 300, backgroundColor:'red' }}>
			<CardActionArea>
				<div className="imagen">
					<CardMedia component="img" height="400" image={thumbnail} alt="logo-product" />
				</div>
				{
					detail 
					?	<CardActions sx={{ backgroundColor:'orange' }} >
							<div className="buyContainer">
								<Tooltip title="Back to Gallery">
									<Link to="/">
										<IconButton>
											<ArrowBackTwoToneIcon />
										</IconButton>
									</Link>
								</Tooltip>
								<Tooltip title="Add to Cart">
									<IconButton onClick={ () => addCart() }>
										<AddShoppingCartIcon />
									</IconButton>
								</Tooltip>
								<ItemCount stock={ stock } newItem={ newItem } />
							</div>
						</CardActions>
					: null
				}
				<CardContent>
					<Typography gutterBottom variant="body2" component="div" color="white">{title}</Typography>
					<hr color="white"></hr>
					{detail ? <Typography variant="h8" color="white">{description}</Typography> : null}
					{detail ? <hr color="white"></hr> : null}
					<br></br>
					<div className="vlr-stock">
						<Typography variant="caption" color="black">Price: ${price}</Typography>
						<Typography variant="caption" color="black">Stock: {stock}</Typography>
					</div>
					<Typography variant="caption" color="black">{category}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CardProduct;
