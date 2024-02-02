import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import CardProduct from '../../components/CardProduct/CardProduct';
import image from '../../assets/images/fake-img.png';

const styles = {
	containerContact: {
		textAlign: "center",
		paddingTop: 20,
	},
};

const CategoryPage = () => {
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [cat, setCat] = useState([]);
	let { category } = useParams();
	let detail = false;
	
	useEffect(() => {
		const getProductsByCategory = async () => {
			setIsLoading(true);

			try {
				// Obtengo los productos de la categoría
                const response = await fetch(`http://localhost:4000/api/products/category/${category}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })

                if (response.status == 200) {
                    const data = await response.json();
                    setCat(data);

                } else if (response.status === 401) {
                    const datos = await response.json()
                    console.error('Error al acceder a los productos por categoría', datos);
					navigate('/')

                } else {
                    const data = await response.json();
                    console.log("Error", data)
                }

            } catch (error) {
                console.log('Error al intentar acceder a esta url', error);
            }

			setIsLoading(false);
		};

		getProductsByCategory();

	}, [category]);

	return (
		<>
			{isLoading ? <Spinner/> : null}

			<h2 style={styles.containerContact}>{category}</h2>
			<div className='Card-list'>
				{cat.map((prod) => {
					return (
						<div style={{ margin: 5 }} key={prod._id}>
							<Link to={`/detail/${prod._id}`}>
								<CardProduct id={prod._id} title={prod.title} description={prod.description} category={prod.category} thumbnail={image} price={prod.price} stock={prod.stock} detail={detail} />
							{/* <CardProduct id={prod._id} title={prod.title} description={prod.description} category={prod.category} thumbnail={image} price={prod.price} stock={prod.stock} detail={detail} /> */}
							</Link>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default CategoryPage
