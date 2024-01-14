import { useState, useEffect } from 'react';
import CardProduct from '../CardProduct/CardProduct';
import Spinner from '../Spinner/Spinner';
import { useNavigate, Link } from 'react-router-dom';
import { getCookiesByName } from '../../utils/formsUtils';
import image from '../../assets/images/fake-img.png';

import './ListProduct.css';

const ListProduct = () => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

	let detail = false;

	useEffect(() => {
		const getProducts = async () => {
			setIsLoading(true);
			try {
                const token = getCookiesByName('jwtCookie');
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
			// const q = query(collection(db, "products"));
			// const querySnapshot = await getDocs(q);
			// const docs = [];

			// querySnapshot.forEach((doc) => {
			// 	docs.push({ ...doc.data(), id: doc.id });	// Unimos en un solo array la data y el id que vienen separados de Firestore
			// });
			// setProducts(docs);	// Pasamos a Products todo lo que trae docs de Firestore
			setIsLoading(false);
		};

		getProducts();

	}, []);

	console.log("PRD", products);
	return (
		<div className='List-Product'>
			{isLoading ? <Spinner/> : null}

			<div className='Card-list'>
				{products.map((prod) => {
					return (
						<div style={{ margin: 5 }} key={prod._id}>
							<Link to={`/detail/${prod._id}`}>
								<CardProduct id={prod._id} title={prod.title} description={prod.description} category={prod.category} image={image} price={prod.price} stock={prod.stock} detail={detail} />
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ListProduct;
