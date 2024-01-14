import { useContext } from "react";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { SalesContext } from "../../context/SalesContext";
import './CardWidget.css'

// Cant de elementos del carrito
const CardWidget = () => {
	const [items, qtyTotal, addItemToCart, clearCart] = useContext(SalesContext);

	return (
		<div className="wd">
			<LocalGroceryStoreIcon sx={{ color: "white" }} />
			<p>{qtyTotal}</p>
		</div>
	);
};

export default CardWidget;
