import 'dotenv/config';
import express, { json } from "express";
// import multer from 'multer';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
//rutas de db
import router from './routes/index.routes.js';
import compression from 'express-compression'
import { addLogger } from './config/logger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.js';


const PORT = 4000;

const app = express();

const specs = swaggerJSDoc(swaggerOptions);

const whiteList = ['http://192.168.80.10:5173']
// const whiteList = ['http://localhost:5173/']
// const whiteList = ['http://127.0.0.1:5173/']

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('access denied'));
        }
    },
    credentials: true
}

// Configuración de Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'src/public/img') // null hace referencia a q no envía errores
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}${file.originalname}`)
//     }
// });

// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.SIGNED_COOKIE)) // La cookie esta firmada
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            useNewUrlParser: true, //Establezco que la conexion sea mediante URL
            useUnifiedTopology: true //Manego de clusters de manera dinamica
        },
        ttl: 60 //Duracion de la sesion en la BDD en segundos

    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos
    saveUninitialized: false //Fuerzo a guardar la session a pesar de no tener ningun dato
}))
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
// app.use(cors());
// const upload = multer({ storage: storage });

//inicializamos la estrategia
initializePassport();
//para que funcione passport en toda la aplicacion
app.use(passport.initialize());
//inicializamos las sesiones. Hacemos que maneje sesiones
app.use(passport.session());


//conectando mongoDB atlas con visual studio code.
mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {console.log('DB is connected');})
    .catch(() => console.log('error en conexion a DB'));


app.use(compression());
//generacion de loggers
app.use(addLogger);
//swagger
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//db routes
app.use('/', router);


app.get('/testArtillery', (req, res) => {
    let sum = 0;
    for (let i = 0; i < 5e8; i++) {
        sum += i
    }
    res.send({ sum });
})

app.listen(PORT, () => {
    console.log(`server on PORT ${PORT}`)
})

// Ruta de multer
// app.post('/upload', upload.single('product'), (req, res) => { // key: 'product'
//     console.log(req.file)
//     console.log(req.body)

//     res.status(200).send("Imagen cargada");
// })








