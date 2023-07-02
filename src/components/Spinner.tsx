import {Box, CircularProgress
} from "@mui/material"

function Spinner():JSX.Element{
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress sx={{margin: 'auto'}}/>
        </Box> 
    )
}

export default Spinner;