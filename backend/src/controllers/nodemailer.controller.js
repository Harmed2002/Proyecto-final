// import transporter from "../config/nodemailer.js";

// export const nodemailerSend = async (req, res) => {
//     let resultado;

//     try {
//         resultado = await transporter.sendMail({
//             from: "TEST MAIL medinaharold196@gmail.com",
//             to: "harmed2002@gmail.com",
//             subject: "Correo de Prueba",
//             html:
//             `
//                 <div>
//                     <h1>Buenas tardes</h1>
//                 </div>
//             `
//         });

//         if (resultado) {
//             console.log(resultado);
//             res.status(200).send({ succes: "Mail enviado exitosamente" });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ error: "Error al enviar mail" });
//     }
// }

