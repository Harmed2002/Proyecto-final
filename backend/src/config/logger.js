import winston from 'winston';
import 'dotenv/config';

let customLevelOpt;

if (process.env.MODO == 'DEVELOPMENT') {
	customLevelOpt = {
		levels: {
			fatal: 0,
			error: 1,
			warning: 2,
			info: 3,
			debug: 4
		},
		colors: {
			fatal: 'red',
			error: 'cyan',
			warning: 'yellow',
			info: 'blue',
			debug: 'grey'
		}
	}

} else {
	customLevelOpt = {
		levels: {
			fatal: 0,
			error: 1,
			warning: 2,
			info: 3
		},
		colors: {
			fatal: 'red',
			error: 'cyan',
			warning: 'yellow',
			info: 'blue'
		}
	}
}

// Podemos generar la grabación implementando cada uno de ellos y guardarlos de forma independiente.
const transports = [
	new winston.transports.File({
		filename: './errors_fatal.log',
		level: 'fatal',
		format: winston.format.combine(
			winston.format.simple()
		)
	}),
	new winston.transports.File({
		filename: './errors_errors.log',
		level: 'error',
		format: winston.format.combine(
			winston.format.simple()
		)
	}),
	new winston.transports.File({
		filename: './loggers_warning.log',
		level: 'warning',
		format: winston.format.combine(
			winston.format.simple()
		)
	}),
	new winston.transports.File({
		filename: './loggers_info.log',
		level: 'info',
		format: winston.format.combine(
			winston.format.simple()
		)
	}),
	new winston.transports.Console({
		level: 'debug',
		format: winston.format.combine(
			winston.format.colorize({ colors: customLevelOpt.colors }),
			winston.format.simple()
		)
	})
];

//creacion de los loggers de winston, en base al objeto ya creado
const logger = winston.createLogger({
	levels: customLevelOpt.levels,
	transports
});

export const addLogger = (req, res, next) => {
	if (!req.logger) {
		req.logger = logger;
		//aqui devuelvo quien hizo la peticion
		if (process.env.MODO == "DEVELOPMENT") {
			req.logger.debug(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`);
		}
	}
	next();
}

