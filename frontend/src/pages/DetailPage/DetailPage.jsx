import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardProduct from '../../components/CardProduct/CardProduct';
import Spinner from '../../components/Spinner/Spinner';

import './DetailPage.css'

// Imports de Firebase
import { getDoc, doc, getFirestore } from "firebase/firestore";

const styles = {
	containerHome: {
		textAlign: "center",
		paddingTop: 20,
	},
};


const DetailPage = () => {
	const [prod, setProd] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	let { id } = useParams();
	let detail = true;

	useEffect(() => {
		
		const db = getFirestore();
		const biciRef = doc(db, "products", id);

		getDoc(biciRef).then((onSnapshot) => {
			setIsLoading(true);
			if (onSnapshot.exists()) {
				setProd({ id: onSnapshot.id, ...onSnapshot.data() });
			}
			setIsLoading(false);
		});
		
	}, [id]);

	const { title, description, category, image, price, stock } = prod;

	return (
		<div style={styles.containerHome}>
			<h2>Detail Page</h2>
			{isLoading ? <Spinner/> : null}
			<div className='Card-detail'>
				{prod.id ? <CardProduct id={id} title={title} description={description} category={category} image={image} price={price} stock={stock} detail={detail} /> : null}
			</div>
		</div>
	);
};

export default DetailPage;
