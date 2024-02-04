import { useContext } from "react";
import { SalesContext } from "../../context/SalesContext";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const PurchaseDetails = () => {
	const [items] = useContext(SalesContext);
	const TAX_RATE = 0.07;
	let totalItem = 0;

	function ccyFormat(num) {
		return `${num.toFixed(2)}`;
	}

	function subtotal(items) {
		// return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
		totalItem = 0;

		try {
			items.map((row) => (
				row.quantity ? (totalItem += row.quantity * row.price) : 0
			))
		} catch (error) {
			console.log(error);
		}
		
		return totalItem;
	}

	const invoiceSubtotal = subtotal(items);
	const invoiceTaxes = TAX_RATE * invoiceSubtotal;
	const invoiceTotal = invoiceTaxes + invoiceSubtotal;

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 700 }} aria-label="spanning table">
				<TableHead>
					<TableRow>
						<TableCell align="center" colSpan={3}>Details</TableCell>
						<TableCell align="right">Price</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Description</TableCell>
						<TableCell align="right">Qty.</TableCell>
						<TableCell align="right">Units</TableCell>
						<TableCell align="right">Sum</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{items.map((row) => (
						<TableRow key={row.id}>
							<TableCell width="250">{row.title}</TableCell>
							<TableCell align="right">{row.quantity}</TableCell>
							<TableCell align="right">{row.price}</TableCell>
							<TableCell align="right">{ccyFormat(row.price * row.quantity)}</TableCell>
						</TableRow>
					))}
					<TableRow>
						<TableCell rowSpan={3} />
						<TableCell colSpan={2}>Subtotal</TableCell>
						<TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Tax</TableCell>
						<TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
						<TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell colSpan={2}>Total</TableCell>
						<TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default PurchaseDetails;
