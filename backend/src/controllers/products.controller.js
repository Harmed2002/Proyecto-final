import { productModel } from "../models/products.models.js";

const getProducts = async (req, res) => {
	const { limit, page, filter, sort } = req.query;

	const pag = page ? page : 1;
	const lim = limit ? limit : 50;
	const ord = sort == 'asc' ? 1 : -1;

	try {
		const products = await productModel.paginate({ filter: filter }, { limit: lim, page: pag, sort: { price: ord } });
		if (products) {
			res.status(200).send(products);
		} else {
			res.status(404).send({ error: 'No existen productos en la BD' });
		}

	} catch (error) {
		res.status(500).send({ error: `error al consultar productos: ${error}` });
	}
}

const getProductById = async (req, res) => {
	const { id } = req.params;

	try {
		const product = await productModel.findById(id);

		if (product) {
			res.status(200).send(product);

		} else {
			res.status(404).send({ error: 'producto no encontrado' });
		}

	} catch (error) {
		res.status(500).send({ error: `error en consultar producto ${error}` });
	}

}

const getProductsByCategory = async (req, res) => {
	const { idCat } = req.params;

	try {
		// const products = await productModel.find({"category": { $in: [cat] }});
		const prodByCat = await productModel.find({"category": idCat});

		if (prodByCat) {
			res.status(200).send(prodByCat);

		} else {
			res.status(404).send({ error: 'Categoría no encontrada' });
		}

	} catch (error) {
		res.status(500).send({ error: `error en consultar productos ${error}` });
	}
}

const postProduct = async (req, res) => {
	const { title, description, code, price, stock, category, thumbnail } = req.body;

	try {
		const product = await productModel.create({ title, description, code, price, stock, category, thumbnail });

		if (product) {
			res.status(201).send(product);

		} else {
			res.status(400).send({ error: 'error en crear producto' });
		}

	} catch (error) {
		// Code error de llave duplicada
		if (error.code == 11000) {
			res.status(400).send({ error: 'producto ya creado con llave duplicada' });

		} else {
			res.status(500).send({ error: `error en crear producto ${error}` });
		}
	}

}

const putProduct = async (req, res) => {
	console.log(req.params);
	const { id } = req.params;
	const { title, description, code, price, stock, category, thumbnail } = req.body;

	try {
		const product = await productModel.findByIdAndUpdate(id, { title, description, code, price, stock, category, thumbnail });

		if (product) {
			return res.status(201).send(product);
		}

		res.status(400).send({ error: 'error en actualizar producto' });

	} catch (error) {
		res.status(500).send({ error: `error en actualizar producto ${error}` });
	}
}

const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await productModel.findByIdAndDelete(id);
		if (product) {
			res.status(201).send(product);
		}

		res.status(400).send({ error: 'error en eliminar producto' });
	} catch (error) {
		res.status(500).send({ error: `error en eliminar producto ${error}` });
	}

}

const uploadImage = async (req, res) => {
	const productId = req.body.idProd;
    const file = req.file;
	const filePath = req.file.path; // Si la imagen se subió correctamente, Multer agregará la propiedad 'file' al objeto 'req'

	if (!file || file.length === 0) {
	    return res.status(400).send('No se cargaron imágenes');
	}

	try {	
		const product = await productModel.findById(productId);
		product.thumbnail = filePath;

		await product.save();

		// res.status(200).send('La imagen fue grabada exitosamente');
		res.status(200).json({ success: true, message: 'La imagen fue grabada exitosamente', filePath });

	} catch (error) {
		console.error('Error al grabar ruta de imagen en la bd:', error);
		res.status(500).json({ success: false, message: 'Error al grabar la ruta de imagen' });
	}
}

export const productController = {
    getProducts,
    getProductById,
    getProductsByCategory,
    postProduct,
	putProduct,
    deleteProduct,
    uploadImage
}
