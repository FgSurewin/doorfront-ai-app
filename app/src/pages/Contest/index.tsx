import ContestMap from '../../components/Map/ContestMap'
import { Typography, Grid, Container, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import Item from '@mui/material/Grid'
import LeaderBoard from '../../components/Leaderboard'
import Navbar from '../../components/Navbar'
import CircleIcon from '@mui/icons-material/Circle';
import Footer from "../../components/Footer";

export default function Contest() {

    const helperText = [
        "Mark doors within an area to earn points!",
        "User that has the most points in an area earns ownership of that area!",
        "Attaining ownership of an area grants a point bonus while you maintain it!",
        "Steal ownership from other users by marking more doors than them in an area!",
        "Top three users at the end of the competition will recieve gift cards!",
        "Competition ends on December 31st!",
        "Hover over a neighborhood to view it's contest information!"
    ]

    return (
        <div>

            <Navbar />
            <Paper
                id="ExplorationContainer"
                sx={{
                    minHeight: "calc(100vh - 74px)",
                    backgroundColor: "rgba(225, 207, 185, 0.15)",
                    minWidth: "1440px",
                }}
            >
                <Container maxWidth='xl'>
                    <Typography variant="h2" align="center" paddingBottom={6} pt={6}> Welcome to the first DoorRace Contest!</Typography>
                    <Grid container maxWidth="xl" sx={{ alignItems: 'center' }} spacing={0}>
                        <Grid item xs={7}>
                            <Item>
                                <List>

                                    {helperText.map((text) => (
                                        <ListItem>
                                            <ListItemIcon><CircleIcon /></ListItemIcon>
                                            <ListItemText primary={text} primaryTypographyProps={{ variant: "h6" }} />
                                        </ListItem>


                                    ))}



                                </List>
                            </Item>
                        </Grid>
                        <Grid item xs={5}>
                            <Item >
                                <Typography variant="subtitle1" color="text.primary" align='center'>Current Contest Leaders</Typography>
                                <LeaderBoard />
                            </Item>
                        </Grid>
                    </Grid>
                </Container>
                <ContestMap />
            </Paper>
            <Footer/>

        </div>
    )
}