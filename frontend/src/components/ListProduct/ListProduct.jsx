import { useState, useEffect } from 'react';
import CardProduct from '../CardProduct/CardProduct';
import Spinner from '../Spinner/Spinner';
import { useNavigate, Link } from 'react-router-dom';
import image from '../../assets/images/fake-img.png';

import './ListProduct.css';

const ListProduct = () => {
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [products, setProducts] = useState([]);
	let detail = false;

	useEffect(() => {
		const getProducts = async () => {
			setIsLoading(true);

			try {
				// Obtengo todos los productos
                const response = await fetch('http://localhost:4000/api/products', {
                    method: 'GET',
                    headers: {
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

			setIsLoading(false);
		};

		getProducts();

	}, []);

	// console.log("PROD", products);
	return (
		<div className='List-Product'>
			{isLoading ? <Spinner/> : null}

			<div className='Card-list'>
				{products.map((prod) => {
					return (
						<div style={{ margin: 5 }} key={prod._id}>
							<Link to={`/detail/${prod._id}`}>
								<CardProduct id={prod._id} title={prod.title} description={prod.description} category={prod.category} thumbnail={image} price={prod.price} stock={prod.stock} detail={detail} />
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ListProduct;
