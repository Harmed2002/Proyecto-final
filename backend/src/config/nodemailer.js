import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log("NODEMAILER_PASSWORD", process.env.NODEMAILER_PASSWORD)
// Configuro la cuenta que envía el correo
let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "medinaharold196@gmail.com",
		pass: process.env.NODEMAILER_PASSWORD,
		authMethod: "LOGIN"
	},
    debug: true,
})


export default transporter;


