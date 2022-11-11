import { height } from '@mui/system'
import MapboxMap from '../../components/Map'
import {Typography,Grid, Container} from'@mui/material'
import Item from '@mui/material/Grid'
import LeaderBoard from '../../components/Leaderboard'
import Navbar from '../../components/Navbar'

export default function Contest() {
    return(
        <div>

            <Navbar/>
            <Container >
            <Typography variant="h2" align="center" > Welcome to the contest page! </Typography>
            <Grid container maxWidth="md" sx={{alignItems:'center'}}>
                <Item xs={6}><Typography fontSize={16} >Mark doors within an area to earn points!<br/>User that has the most points in an area earns ownership of that area!<br/>
                Attaining ownership of an area grants a point bonus while you maintain it!<br/>Steal ownership from other users by marking more doors than them in an area!<br/>
                Top three users at the end of the competition will recieve gift cards!<br/>Competition ends on December 31st!</Typography></Item>
                <Item xs={6}>
                    <LeaderBoard />
                </Item>
            </Grid>
            </Container>
            <MapboxMap />

        </div>
    )
}