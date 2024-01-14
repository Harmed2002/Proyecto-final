import { CircularProgress, Box  } from "@mui/material";

const Spinner = () => {
    return (
        <Box sx={{ marginTop: 5 }}>
            <CircularProgress />
        </Box>
    );
}

export default Spinner;