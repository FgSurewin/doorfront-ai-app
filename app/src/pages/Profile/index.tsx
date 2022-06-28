import { useUserStore } from "../../global/userState"
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Grid, Tab, Tabs, Typography, SxProps, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import { TwitterShareButton,TwitterIcon,FacebookIcon,FacebookShareButton,LinkedinIcon,LinkedinShareButton } from 'react-share';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const gridTitle: SxProps = { borderBottom: 1, borderColor: 'divider', fontWeight: 'bold' }
const gridContent: SxProps = { borderBottom: 1, borderLeft: 1, borderColor: 'divider' }
const password: SxProps = { borderLeft: 1, borderColor: 'divider' }
const sidebar: SxProps = { borderBottom: 1, borderColor: 'divider' }

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export default function Profile() {
    const { userInfo } = useUserStore();
    const { userScore } = useUserStore();
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <Navbar />
            <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 3, width: '100%'}}>
                <Box sx={{ width: '20%', paddingTop: 2, paddingRight: 5 }}>
                    <Tabs value={value} onChange={handleChange} aria-label="profile" orientation="vertical" sx={{backgroundColor: '#f9edda'}}>
                        <Tab label='User Contributions' value={0} sx={sidebar} />
                        <Tab label='Change Settings' value={1} sx={sidebar}  />
                        <Tab label='Share to Social Media' value={2}  sx={sidebar}  />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Box >
                        <Grid container rowSpacing={3}>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Nickname:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userInfo.nickname}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>ID:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userInfo.id}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Score:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.score}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Created:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.create}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Labeled:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.label}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Reviewed:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.review}</Grid>
                        </Grid>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Box>
                        <Grid container rowSpacing={3}>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Nickname:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userInfo.nickname}</Grid>
                            <Grid item xs={4} sx={{fontWeight:'bold'}} textAlign='center'>Change Password:</Grid>
                            <Grid item xs={8} sx={password} textAlign='center' ><TextField size="small" label='Current Password' type='password' /></Grid>
                            <Grid item xs={4}/>
                            <Grid item xs={8} sx={password} textAlign='center' ><TextField size="small" label='New Password' type='password' /></Grid>
                            <Grid item xs={4}/>
                            <Grid item xs={8} sx={password} textAlign='center' ><TextField size="small" label='Confirm New Password' type='password' /></Grid>
                            <Grid item xs={4} sx ={gridTitle}/>
                            <Grid item xs={8} sx={gridContent} textAlign='center'><Button variant="outlined"> Confirm</Button></Grid>
                            <Grid item xs={4} sx={{fontWeight:'bold'}} textAlign='center'>Change Email Address:</Grid>
                            <Grid item xs={8} sx={password} textAlign='center'><TextField size="small" label='New Email' /></Grid>
                            <Grid item xs={4}/>
                            <Grid item xs={8} sx={password} textAlign='center' ><TextField size="small" label='Confirm New Email'/></Grid>
                            <Grid item xs={4} sx ={gridTitle}/>
                            <Grid item xs={8} sx={gridContent} textAlign='center'><Button variant="outlined"> Confirm</Button></Grid>
                        </Grid>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', border:.5}}>
                    <Box sx={{width:'100px'}} />
                    <TwitterShareButton  url="DoorFront.org" title={"Try beating my score of "+ userScore.score+'!\n\n'}><TwitterIcon /> </TwitterShareButton>
                    <Box sx={{width:'100px'}} />
                    <FacebookShareButton url='DoorFront.org' quote={"Try beating my score of "+ userScore.score+'!\n\n'} hastag='#accessibility'><FacebookIcon /></FacebookShareButton>
                    <Box sx={{width:'100px'}} />
                    <LinkedinShareButton url='DoorFront.org' title={"Try beating my score of "+ userScore.score+'!\n\n'} source="DoorFront.org" summary="Crowdsourcing App"><LinkedinIcon /></LinkedinShareButton>
                    <Box sx={{width:'100px'}} />
                </ Box>

                </TabPanel>
            </Box>
        </div>
    )
}