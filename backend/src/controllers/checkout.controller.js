import { ticketModel } from "../models/ticket.models.js";
import { cartModel } from "../models/carts.models.js";
import { userModel } from "../models/users.models.js";
import { productModel } from "../models/products.models.js";

export const createTicket = async (req, res) => {
    try {
        const { cid } = req.params;
        // Obtengo los obj cart y user con el id del carrito
        const cart      = await cartModel.findById(cid);
        const user      = await userModel.findOne({ cart: cid });
        let purchaser   = user.email;
        let amount      = 0;

        if (cart) {
            // Se actualiza el stock de productos
            const filteredProducts = await Promise.all(cart.products.map(async (prod) => {
                let product = await productModel.findById(prod.id_prod._id);
                const updatedStock = product.stock - prod.quantity;
                await productModel.findByIdAndUpdate(product._id, { stock: updatedStock }); // Actualizo el stock del producto
                console.log("Producto que va para orden", prod)
                return prod;
            }));

            // Filtra los productos que cumplen la condición y elimina los nulos
            const validProducts = filteredProducts.filter(Boolean);

            if (validProducts.length > 0) {
                validProducts.forEach(prod => {
                    amount += prod.quantity * prod.id_prod.price;
                    console.log("Valor total", amount)
                });

                const ticket = await ticketModel.create({ amount, purchaser });
                console.log("ticket", ticket);

                if (ticket) {
                    res.status(200).send({ ticket });

                } else {
                    res.status(404).send({ error: "Error al generar ticket. Algunos de los datos no son correctos" });
                }

            } else {
                res.status(404).send({ error: "No hay productos válidos en el carrito" });
            }

        } else {
            res.status(404).send({ "Error al procesar carrito": error })
        }

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ error: "Error en el servidor", details: error });
    }

}