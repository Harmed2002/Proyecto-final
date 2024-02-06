import React from 'react';
import { TableCell, tableCellClasses, IconButton, Stack, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));


const TableActionsComponent = ( product ) => {
	const { prod } = product;

	// console.log("PROD", product);
	return (
		<StyledTableCell width="10%" align="right">
			<Stack spacing={1} direction='row'>
				<Tooltip title='Edit' placement='left'>
					<IconButton size='small'>
						<EditOutlinedIcon />
					</IconButton>
				</Tooltip>

				<Tooltip title='Delete' placement='right'>
					<IconButton size='small'>
						<DeleteOutlineOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Stack>
		</StyledTableCell>
	)
}

export default TableActionsComponent;
