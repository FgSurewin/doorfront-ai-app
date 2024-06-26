import React from 'react'
import { useUserStore } from "../../global/userState"
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Grid, Tab, Tabs, Typography, SxProps, Divider, TextField, Button} from "@mui/material";
import { Box } from "@mui/system";
import { TwitterShareButton, TwitterIcon, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton } from 'react-share';
import ResetPasswordForm from "./ResetPasswordForm";
import ContributionsChart from "./ContributionsChart"
import { addUserBonusCredit, getNickname, getUserScoreFromDB, updateReferredUserBonus } from "../../apis/user";
import { readLocal,LocalStorageKeyType } from '../../utils/localStorage';
// import { useLocation } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { getReferralCode,getAllReferredUsers, referredUser} from '../../apis/user';
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

export default function Profile() {
    const { userInfo, userScore, updateUserScore } = useUserStore();
    const [value, setValue] = useState(0);
    const [ref,setRef] = useState("9XG4T")
    const[usersReferred,setUsersReferred] = useState<referredUser[]>([])
    //const update = useUserStore().updateUserScore(testScores);
    const gridTitle: SxProps = { borderBottom: 1, borderColor: 'divider', fontWeight: 'bold' }
    const gridContent: SxProps = { borderBottom: 1, borderLeft: 1, borderColor: 'divider' }
    // const passwordSxProps: SxProps = { borderLeft: 1, borderColor: 'divider' }
    const sidebar: SxProps = { borderBottom: 1, borderColor: 'divider' }
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
  const {enqueueSnackbar} = useSnackbar();
  console.log(userInfo)

    React.useEffect(() => {
        async function innerFunc() {
          const { code, data: score } = await getUserScoreFromDB({
            id: userInfo.id!,
          });
          const allReferredUsers = await getAllReferredUsers({
            id: userInfo.id!,
          });
          console.log(allReferredUsers)
          var users:referredUser[] = []
          if(allReferredUsers.data){
            for(var i =0; i <allReferredUsers.data.length;i++){
                var BR = false;
                if(allReferredUsers.data[i].bonusReceived === true) BR =true;
                const currentUser = await getNickname({id:allReferredUsers.data[i].userID})
                const currentUserScore = await getUserScoreFromDB({id:allReferredUsers.data[i].userID})
                console.log(currentUserScore)
                if(currentUserScore.data.score >= 1 && allReferredUsers.data[i].bonusReceived !== true){
                    BR = true
                    //give 10 points to referrer and referree
                    await addUserBonusCredit({id:allReferredUsers.data[i].userID})
                    const update = await addUserBonusCredit({id:userInfo.id!})
                    updateUserScore(update.data)
                    
                    //update bonusReceived to reflect added bonus
                    const t1= await updateReferredUserBonus({referrerId:userInfo.id!,refereeId:allReferredUsers.data[i].userID})
                    console.log(t1)
                }
                users.push({userID:currentUser.data,bonusReceived:BR})
            }
          }

          setUsersReferred(users)
          if (code === 0) {
            updateUserScore(score);
          }
        }

        
        async function referralCode(){
            const data = await getReferralCode({id:userInfo.id!});
            if(data){
                setRef(data.data)
            }
        }
        referralCode();
        innerFunc();
        console.log(usersReferred)
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
                        <Tab label='Referrals' value={3} sx={sidebar} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Box >
                        <Grid container rowSpacing={3}>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Nickname:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userInfo.nickname}</Typography></Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Score:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userScore.score}</Typography></Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Created:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userScore.create}</Typography></Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Labeled:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userScore.label}</Typography></Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Reviewed:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userScore.review}</Typography></Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Modified:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userScore.modify}</Typography></Grid>
                            {readLocal("contest" as LocalStorageKeyType) !== null && readLocal("contest" as LocalStorageKeyType) !== ""&&
                            <>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Contest Score:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userScore.contestScore}</Typography></Grid>
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
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Nickname:</Typography></Grid>
                            <Grid item xs={8} sx={gridContent} textAlign='center' display="flex" justifyContent={"center"}><Typography marginTop={1} sx={{display:"flex", flexDirection:"row", alignSelf:"center"}} fontSize={18}>{userInfo.nickname}</Typography></Grid>
                            <Grid item xs={4} sx={gridTitle} textAlign='center'><Typography marginTop={1} sx={{display:"flex", flexDirection:"row",fontWeight: 'bold'}} fontSize={18}>Change Password:</Typography></Grid>
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
                <TabPanel value={value} index={3}>
                    <Typography component="h1" variant="h5" sx={{ color: "text.primary",pb:'4px' }}>
                            Your Referral Information
                    </Typography>
                    <Divider />
                    <Grid container marginTop={2} spacing={.1}>
                        <Grid item xs={6} >
                            <Typography marginTop={1} sx={{display:"flex", flexDirection:"row"}} fontSize={18}>Referral Code</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField disabled size={"small"} sx={{display:"flex", flexDirection:"row", "& .MuiInputBase-input.Mui-disabled": {WebkitTextFillColor: "#000000"}}} defaultValue={ref}></TextField>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography marginTop={1} sx={{display:"flex", flexDirection:"row"}} fontSize={18}>Referral Link</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField disabled size={"small"} sx={{display:"flex", flexDirection:"row","& .MuiInputBase-input.Mui-disabled": {WebkitTextFillColor: "#000000"}}} defaultValue={window.location.host + "/login?ref="+ref}></TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <Button 
                                size='large' 
                                defaultValue={"Copy"} 
                                variant='outlined' 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.host + "/login?ref="+ref)
                                    enqueueSnackbar("Copied to clipboard!",{variant:"success",disableWindowBlurListener:true})
                                }}>
                            Copy
                            </Button>
                        </Grid>
                        <Grid item xs={12} mt={4}>
                            <Divider />
                        </Grid>
                        <Grid item xs={6}>
                        <Typography marginTop={1} sx={{display:"flex", flexDirection:"row", fontWeight:"bold"}} fontSize={18} color={"black"}>User Referred</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <Typography marginTop={1} sx={{display:"flex", flexDirection:"row", fontWeight:"bold"}} fontSize={18} color={"black"}>Bonus Received</Typography>
                        </Grid>
                        {Array.from(Array(usersReferred.length)).map((_, index) => (
                            <>
                            <Grid item xs={6}>
                            <Typography marginTop={1} sx={{display:"flex", flexDirection:"row"}} fontSize={18} >{usersReferred[index].userID}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                            {usersReferred[index].bonusReceived?
                            <Typography marginTop={1} sx={{display:"flex", flexDirection:"row"}} fontSize={18}>✓</Typography>
                            :<Typography marginTop={1} sx={{display:"flex", flexDirection:"row"}} fontSize={18}>X</Typography>
                            }
                            </Grid>
                            </>
                        ))}
                    </Grid>
                </TabPanel>
            </Box>
        </div>
    )
}