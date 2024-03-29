import 'dotenv/config';
import nodemailer from 'nodemailer';
import { userModel } from "../models/users.models.js"


// Configuro la cuenta que envía el correo de prueba
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "medinaharold196@gmail.com",
		pass: process.env.NODEMAILER_PASSWORD,
		authMethod: "LOGIN"
	},
    debug: true,
});

// Función para envío de mail por eliminación de usuario inactivo
const sendMailForDeletedAccount = async (email) => {
	try {
		const mailOptions = {
			from: 'ECOMMERCE medinaharold196@gmail.com',
			to: email,
			subject: 'NOTIFICACION: Eliminación de cuenta',
			text: 'Tu cuenta ha sido eliminada por un administrador por falta de actividad.',
		};

		await transporter.sendMail(mailOptions);

		console.log('Correo de eliminación de cuenta enviado correctamente');

	} catch (error) {
		console.log('Error al enviar correo de eliminación de cuenta:', error);
	}
};

// Función para envío de mail para notificación de compra
const sendPurchaseConfirmation = async (email, ticket) => {
	try {
		// Se obtiene la información del usuario
		const user = await userModel.findOne({ email: email });

		if (!user) {
			console.log('Usuario no encontrado');
			return;
		}

		const mailOptions = {
			from: 'ECOMMERCE medinaharold196@gmail.com',
			to: email,
			subject: `Gracias por tu compra, ${user.first_name}`,
			text: `Gracias por tu compra, ${user.first_name}. Aquí está la información de tu compra:\n
                    Número de ticket: ${ticket._id}\n
                    Monto total: ${ticket.amount}\n
                    Fecha de compra: ${ticket.purchase_datetime}\n`
		};

		await transporter.sendMail(mailOptions);
		console.log('Email de confirmación de compra enviado correctamente');

	} catch (error) {
		console.log('Error al obtener información del ticket o usuario:', error);
	}
};


export const mailer = {
	sendMailForDeletedAccount,
	sendPurchaseConfirmation
}


