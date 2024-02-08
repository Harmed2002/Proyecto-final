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
	const productId = req.params.pid;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).send('No se cargaron imágenes');
    }

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send(`El producto con id. ${productId} no existe`);
        }

        const updatedThumbnail = files.map(file => ({
            name: file.originalname,
            reference: file.path
        }));

        // Verifico que product.thumbnail esté inicializado como un array
        if (!product.thumbnail) {
            product.thumbnail = [];
        }

        // Adiciono las imágenes al array
        product.thumbnail.push(...updatedThumbnail);

        await product.save();
        res.status(200).send('Las imágenes fueron grabadas exitosamente');

    } catch (error) {
        console.error('Error al subir imágenes:', error);
        res.status(500).send('Error al grabar imágenes');
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
