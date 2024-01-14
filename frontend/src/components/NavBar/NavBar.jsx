import { useState, useEffect } from 'react';
import CardWidget from "../CardWidget/CardWidget";
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
	const [prods, setProds] = useState([]);
	const categories = [];

	// Obtengo los productos
	useEffect(() => {
		const getProds = async () => {
			const q = query(collection(db, "products"));
			const querySnapshot = await getDocs(q);
			const products = [];

			querySnapshot.forEach((doc) => {
				products.push({ ...doc.data() });
			});
			setProds(products);	// Pasamos a Products todo lo que trae docs de Firestore
		};
		getProds();
	}, []);

	// Obtengo solo las categorías
	prods.map((element, index) => {
		categories.push(element.category);
	})

	// Elimino las categorías duplicadas
	let cats = categories.filter((item, index) => {
		return categories.indexOf(item) === index;
	});
	
	return (
		<nav className="NavBar">
			<ul>
				<Link to="/">Home</Link>
				<li className="dropdown-li">Categories
					<ul className="dropdown">
						{cats.map((element, index) => {
							return (
							<Link key={index} to={`/category/${element}`}>
								{element}<br/>
							</Link>
							);
						})}

					</ul>
				</li>
				<Link to="/contact">Contact</Link>
				<Link to="/shop"><CardWidget /></Link>
			</ul>
		</nav>
	);
};

export default NavBar
