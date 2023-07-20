import React from 'react'
import { useUserStore, UserCredit } from "../../global/userState"
import { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { Grid, Tab, Tabs, Typography, SxProps, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import { TwitterShareButton, TwitterIcon, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton } from 'react-share';
import ResetPasswordForm from "./ResetPasswordForm";
import ResetEmailForm from './ResetEmailForm';
import ContributionsChart from "./ContributionsChart"
import { getUserScoreFromDB } from "../../apis/user";
import { readLocal,LocalStorageKeyType } from '../../utils/localStorage';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
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
    const { userInfo, userScore, updateUserScore } = useUserStore();
    const [value, setValue] = useState(0);
    //const update = useUserStore().updateUserScore(testScores);
    const gridTitle: SxProps = { borderBottom: 1, borderColor: 'divider', fontWeight: 'bold' }
    const gridContent: SxProps = { borderBottom: 1, borderLeft: 1, borderColor: 'divider' }
    const passwordSxProps: SxProps = { borderLeft: 1, borderColor: 'divider' }
    const sidebar: SxProps = { borderBottom: 1, borderColor: 'divider' }
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    React.useEffect(() => {
        async function innerFunc() {
          const { code, data: score } = await getUserScoreFromDB({
            id: userInfo.id!,
          });
          if (code === 0) {
            updateUserScore(score);
          }
        }
        innerFunc();
      }, [updateUserScore, userInfo.id]);
    return (
        <div>
            <Navbar />
            <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 3, width: '100%' }}>
                <Box sx={{ width: '20%', paddingTop: 2, paddingRight: 5 }}>
                    <Tabs value={value} onChange={handleTabChange} aria-label="profile" orientation="vertical" sx={{ backgroundColor: '#f9edda' }}>
                        <Tab label='User Contributions' value={0} sx={sidebar}/>
                        <Tab label='Change Settings' value={1} sx={sidebar} />
                        <Tab label='Share to Social Media' value={2} sx={sidebar} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Box >
                        <Grid container rowSpacing={3}>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Nickname:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userInfo.nickname}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Score:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.score}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Created:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.create}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Labeled:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.label}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Reviewed:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.review}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Modified:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.modify}</Grid>
                            {readLocal("contest" as LocalStorageKeyType) !== null && readLocal("contest" as LocalStorageKeyType) !== ""&&
                            <>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Contest Score:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userScore.contestScore}</Grid>
                            </>
                            }
                        </Grid>
                        {userScore.score > 0 &&<Box>
                            <ContributionsChart />
                        </Box>
                        }
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Box sx={{width:'75%'}}>
                        <Grid container rowSpacing={3}>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Nickname:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'>{userInfo.nickname}</Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Change Password:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' alignItems='center'>
                                <ResetPasswordForm />
                            </Grid>
                            {/*
                            <Grid item xs={4} sx={gridTitle} textAlign='center'>Change Email Address:</Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center'> 
                                <ResetEmailForm />
                            </ Grid>
    */}
                        </Grid>
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Box>
                        <Typography component="h1" variant="h5" sx={{ color: "text.primary",pb:'4px' }}>
                            Press one of the social media button below to share your score!<br />Your score: {userScore.score} 
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row',  border: .5 }}>
                        <Box sx={{ mx: 11 }}/>
                        <TwitterShareButton url="DoorFront.org" title={"Try beating my score of " + userScore.score + '!\n\n'}><TwitterIcon /> </TwitterShareButton>
                        <Box sx={{ mx: 4 }} />
                        <FacebookShareButton url='DoorFront.org'hashtag={'#BeatMyScoreOf'+userScore.score + '! #accessibility'}><FacebookIcon /></FacebookShareButton>
                        <Box sx={{ mx: 4}} />
                        <LinkedinShareButton url='DoorFront.org' title={"Try beating my score of " + userScore.score + '!\n\n'} source="DoorFront.org" summary="Crowdsourcing App"><LinkedinIcon /></LinkedinShareButton>
                        <Box sx={{ mx: 2}} />
                    </ Box>
                    </Box>
                </TabPanel>
            </Box>
        </div>
    )
}