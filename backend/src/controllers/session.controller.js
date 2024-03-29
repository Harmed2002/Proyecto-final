import { generateToken } from "../utils/jwt.js";
import { userModel } from "../models/users.models.js";


export const login = async (req, res) => {
	try {
		if (!req.user) {
			res.status(401).send({ message: 'invalid user' })
		}

		// generamos el token
		const token = generateToken(req.user);
		// //enviamos el token por cookie
		// res.cookie('jwtCookie', token, {
		//     maxAge: 4320000 //12 hs en mili segundos
		// });
		// res.status(200).send({ payload: req.user });

		// Actualizo la fecha de última conexión del usr en la BD
		
		const id = req.user._id;
		const last_connection = Date.now();
		
		// console.log("id", id)
		// console.log("last_connection", last_connection)
		
		const respuesta = await userModel.findByIdAndUpdate(id, { last_connection });

		res.status(200).send({ token });

	} catch (error) {
		res.status(500).send({ message: `error al iniciar  sesion ${error}` });
	}
}

export const register = async (req, res) => {
	try {
		if (!req.user) {
			res.status(400).send({ message: 'existing user' });

		} else {
			res.status(200).send({ mensaje: 'User created' });
		}

	} catch (error) {
		res.status(500).send({ message: `Error register ${error}` });
	}
}

export const github = async (req, res) => {
	res.status(200).send({ message: 'usuario registrado' });
}

export const githubCallback = async (req, res) => {
	req.session.user = req.user;
	res.status(200).send({ message: 'usuario logueado' });
}

export const current = async (req, res) => {
	res.send(req.user);
}

export const logout = async (req, res) => {
	try {
		//si manejo sesiones en base de datos va esto
		if (req.session.user) {
			console.log('session', req.session.user);
			req.session.destroy();

			// } else {
			// console.log("En local");
		}

		// sino, va esto:
		// const lst = window.localStorage.getItem('jwtCookie');
		// console.log("TOKENJWT", lst);

		// res.clearCookie('jwtCookie');
		// res.clearCookie('jwtCookie', { domain: '192.168.80.13', httpOnly: true, secure: true });
		// res.clearCookie('jwtCookie', { domain: '192.168.80.13', path: '/' });
		// res.status(200).clearCookie('jwtCookie', {
		// 	path: '/',
		// 	secure: false,
		// 	httpOnly: false,
		// 	domain: '192.168.80.13',
		// 	sameSite: false,
		// });

		// window.localStorage.removeItem('jwtCookie');
		res.status(200).send({ resultado: 'usuario deslogueado' })

	} catch (error) {
		res.status(400).send({ error: `error en logout ${error}` });
	}
}