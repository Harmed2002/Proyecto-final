import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardProduct from '../../components/CardProduct/CardProduct';
import { Link } from 'react-router-dom';

// Imports de Firebase
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const styles = {
	containerContact: {
		textAlign: "center",
		paddingTop: 20,
	},
};

const CategoryPage = () => {
	let { category } = useParams();
	const [cat, setCat] = useState([]);
	let detail = false;
	
	useEffect(() => {
		const getProducts = async () => {
			const q = query(collection(db, "products"), where("category", "==", category));
			const querySnapshot = await getDocs(q);
			const docs = [];

			querySnapshot.forEach((doc) => {
				docs.push({ ...doc.data(), id: doc.id });	// Unimos en un solo array la data y el id que vienen separados de Firestore
			});

			setCat(docs);	// Pasamos a cat todo lo que trae docs de Firestore
		};
		getProducts();
	}, [category]);

	return (
		<>
			<h2 style={styles.containerContact}>{category}</h2>
			<div className='Card-list'>
				{cat.map((prod) => {
					return (
						<div style={{ margin: 5 }} key={prod.id}>
							<Link to={`/detail/${prod.id}`}>
								<CardProduct title={prod.title} description={prod.description} category={prod.category} image={prod.image} price={prod.price} detail={detail} />
							</Link>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default CategoryPage
