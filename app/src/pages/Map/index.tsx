import MapboxMap from '../../components/Map'
import Grid from '@mui/material/Grid'


import Navbar from '../../components/Navbar'

export default function Map() {
    return(
        <div>
            <Grid container component="main" sx={{ height: "calc(100vh - 74px)" }}>
            <Navbar/>
            <MapboxMap />
            </Grid>
        </div>
    )
}