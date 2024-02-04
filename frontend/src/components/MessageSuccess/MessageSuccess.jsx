/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

// import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const MessageSuccess = ({ purchaseCode }) => {
	console.log(purchaseCode)
	return (
		<Stack sx={{ width: "100%" }} spacing={2}>
			<Alert severity="success">
				¡Gracias por su compra! su id de ticket es: {purchaseCode}
			</Alert>
		</Stack>
	);
};

export default MessageSuccess;
