import { useState, useEffect } from 'react';
import CardWidget from "../CardWidget/CardWidget";
import { useNavigate, Link } from 'react-router-dom';
import { getCookiesByName } from '../../utils/formsUtils';
import './NavBar.css';

const NavBar = () => {
	const [products, setProducts] = useState([]);
	const categories = [];
	const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

	// Obtengo los productos
	useEffect(() => {
		const getProds = async () => {
			setIsLoading(true);
			try {
                const token = getCookiesByName('jwtCookie');
				// Obtengo todos los productos
                const response = await fetch('http://localhost:4000/api/products', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json'
                    },
                })

                if (response.status == 200) {
                    const data = await response.json();
                    setProducts(data.docs);

                } else if (response.status === 401) {
                    const datos = await response.json()
                    console.error('Error al acceder a productos, debes iniciar session', datos);
					navigate('/')

                } else {
                    const data = await response.json();
                    console.log("Error", data)
                }

            } catch (error) {
                console.log('Error al intentar acceder a esta url.s', error);
            }
		};
		getProds();
	}, []);

	// Obtengo solo las categorías
	products.map((element, index) => {
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
				<Link to="/logout">Logout</Link>
			</ul>
		</nav>
	);
};

export default NavBar
