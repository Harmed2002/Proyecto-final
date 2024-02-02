import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardProduct from '../../components/CardProduct/CardProduct';
import Spinner from '../../components/Spinner/Spinner';
import { useNavigate, Link } from 'react-router-dom';


import './DetailPage.css'

const styles = {
	containerHome: {
		textAlign: "center",
		paddingTop: 20,
	},
};


const DetailPage = () => {
	const [prod, setProd] = useState({});
    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	let { id } = useParams();
	let detail = true;

	useEffect(() => {
		const getProductById = async () => {
			setIsLoading(true);
			
			try {
				// Obtengo el producto id
                const response = await fetch(`http://localhost:4000/api/products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })

                if (response.status == 200) {
                    const data = await response.json();
                    setProd(data);

                } else if (response.status === 401) {
                    const datos = await response.json()
                    console.error('Error al acceder al producto', datos);
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

		getProductById();
		
	}, [id]);


	const { _id, title, description, category, thumbnail, price, stock } = prod;

	return (
		<div style={styles.containerHome}>
			<h2>Detail Page</h2>
			{isLoading ? <Spinner/> : null}
			<div className='Card-detail'>
				{prod._id ? <CardProduct id={_id} title={title} description={description} category={category} thumbnail={thumbnail} price={price} stock={stock} detail={detail} /> : null}
			</div>
		</div>
	);
};

export default DetailPage;
