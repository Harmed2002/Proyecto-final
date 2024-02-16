import { ticketModel } from "../models/ticket.models.js";
import { cartModel } from "../models/carts.models.js";
import { userModel } from "../models/users.models.js";
import { productModel } from "../models/products.models.js";
import { mailer } from "../config/nodemailer.js"

export const createTicket = async (req, res) => {
	try {
		const { cid } = req.params;
		// Obtengo los obj cart y user con el id del carrito
		const cart		= await cartModel.findById(cid);
		const user		= await userModel.findOne({ cart: cid });
		// const newTicket	= new ticketModel();
		let purchaser	= user.email;
		let amount		= 0;

		if (cart) {
			// Actualizo la colección Cart con el detalle de los productos
			const result = await cartModel.findByIdAndUpdate(cid, { products: req.body });
			console.log("RESULT", result)

			// Recorro el detalle de productos
			req.body.forEach(async item => {
				amount += item.quantity * item.price;
				console.log("Valor total", amount)

				let product = await productModel.findById(item.id); // Busco el producto por su id
				const updatedStock = product.stock - item.quantity; // Calculo el nuevo stock
				
				// Se actualiza el stock del producto
				await productModel.findByIdAndUpdate(product._id, { stock: updatedStock });
				console.log("Producto que va para orden", item)
			});

			// Finalmente, creo el ticket
			const ticket = await ticketModel.create({ amount, purchaser });
			console.log("ticket", ticket);

			if (ticket) {
				/* */
				//Envío el correo al usuario
				await mailer.sendPurchaseConfirmation(purchaser, ticket._id);
				if (updatedCart) {
					return res.status(200).send({ message: "exito" });
				}
				/* */
				res.status(200).send({ ticket });

			} else {
				res.status(404).send({ error: "Error al generar ticket. Algunos datos no son correctos" });
			}

		} else {
			res.status(404).send({ "Error al procesar carrito": error })
		}

	} catch (error) {
		console.error("Error en el servidor:", error);
		res.status(500).send({ error: "Error en el servidor", details: error });
	}

}