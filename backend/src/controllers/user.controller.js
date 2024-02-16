import { userModel } from "../models/users.models.js";
import { mailer } from "../config/nodemailer.js"


export const getUsers = async (req, res) => {
	const { limit, page, filter, sort } = req.query;
	const pag = page ? page : 1;
	const lim = limit ? limit : 50;
	const ord = sort == 'asc' ? 1 : -1;

	try {
		const users = await userModel.find();

		if (users) {
			res.status(200).send(users);

		} else {
			res.status(404).send({ error: 'No existen usuarios en la BD' });
		}

	} catch (error) {
		res.status(500).send({ respuesta: "error al consultar usuarios", mensaje: error });
	}
}

export const getUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await userModel.findById(id);
		if (user) {
			res.status(200).send({ respuesta: 'ok', mensaje: user });
		} else {
			res.status(404).send({ respuesta: "error", mensaje: "user not found" });
		}
	} catch (error) {
		res.status(400).send({ respuesta: "error", mensaje: error });
	}
}

export const putUser = async (req, res) => {
	const { id } = req.params;
	const { first_name, last_name, age, email, password } = req.body;

	try {
		const respuesta = await userModel.findByIdAndUpdate(id, { first_name, last_name, age, email, password });

		if (respuesta) {
			res.status(200).send({ respuesta: 'ok', mensaje: respuesta });

		} else {
			res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontrado' });
		}

	} catch (error) {
		res.status(400).send({ respuesta: "error", mensaje: error });
	}
}

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await userModel.findByIdAndDelete(id);

		
		if (user) {
			if (user.email) {
				await mailer.sendMailForDeletedAccount(user.email); // Se envía correo electrónico de notificación al usuario
	
				return res.status(200).send({ mensaje: "Usuario eliminado y notificado exitosamente" });
			}
			
			res.status(200).send({ respuesta: 'ok', mensaje: 'usuario borrado' });

		} else {
			res.status(404).send({ respuesta: 'error', mensaje: 'usuario no encontrado, error al eliminar' });
		}

	} catch (error) {
		res.status(400).send({ respuesta: "error", mensaje: error });
	}
}


