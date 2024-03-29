import passport from 'passport';


// función para retornar errores en las estrategias de Passport

export const passportError = (strategy) => {
    return async (req, res, next) => {
        //recibimos o local o github o jwt
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                // Retornamos next porque depende el tipo de error sera como lo manejaremos
                return next(error)
            }

            if (!user) {
                res.status(401).send({ error: info.messages ? info.messages : info.toString() }) // Aqui me aseguro que no me tire errores, ya que dependera de la estrategia si envia un string u objeto simple, o un objeto.

            } else {
                req.user = user
                next()
            }
        })(req, res, next) //esto es porque me va a llamar un middleware, a nivel de ruta.
        //significa que estamos ejecutando esta funcion y la misma me va a devolver lo que seria el proyecto.
    }
}


export const authorization = (rol) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: "Unathorized user: Don't exist active session" });
        }

        if (!rol.includes(req.user.user.rol)) {
            return res.status(401).send({ error: 'Do not have permissions', user : req.user });
        }

        next()
    }
}
