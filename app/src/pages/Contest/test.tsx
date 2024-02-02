import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Box from "@mui/material/Box"
import { useUserStore } from "../../global/userState"
import {sendMail} from "../../apis/mailer"

import { getActiveContest, createArea, createContest, changeContestState, deleteContest, updateAreaOwner, getAreaOwner, contestArea,setAreas} from "../../apis/contest"
import {getNickname, updateContestStats, resetContestScore, getAreaScore} from "../../apis/user"
import React from 'react'
import { AllUserScores, getAllUsersFromDB } from "../../apis/user"
import { LocalStorageKeyType, readLocal } from "../../utils/localStorage"
import { contestNeighborhoods } from "../../components/Map/contest"
import _ from "lodash"

export default function TestPage(){
    const {userInfo} = useUserStore();
    const [activeContest,setActiveContest] = React.useState<number>(0) 
    
    const [areaName, setAreaName] = React.useState<string>("")
    const [areaBonus, setAreaBonus] = React.useState<number>(0)
    const [areaScoreIncrement, setAreaScoreIncrement] = React.useState<number>(0)
    const [contestNumber,setContestNumber] = React.useState<number>(0)
    const [userId,setUserId] = React.useState<string>("")
    const [recEmail,setRecEmail] = React.useState<string>("tortiz003@citymail.cuny.edu")
    const [subject,setSubject] = React.useState<string>("Test")
    const [body,setBody] = React.useState<string>("<b>Hello World!</b>")

    const [allUsers, setAllUsers] = React.useState<AllUserScores[]>([]);
    React.useEffect(() => {
        async function loadFunc() {
            const result = await getAllUsersFromDB();
            if (result.code === 0) {
                setAllUsers(_.orderBy(result.data, ["updatedAt"], ["desc"]));
            }
        }
        loadFunc();
    },[]);

    function showRecentUsers(){
        var emails = ""
        const length = Math.min(allUsers.length,10)
        for(var i = 0; i < length; i++){
            if(i === length-1) emails += allUsers[i].email
            else emails += allUsers[i].email + ", "
        }
        setRecEmail(emails)
        console.log(allUsers)
    }

    async function onSubmitArea(){
        const res= await getActiveContest();
                if(res.data){
                    setActiveContest(res.data);
                }
        const result = await createArea({contestNumber:activeContest, area:{areaName:areaName, ownershipBonus:areaBonus}})
        console.log(result)
    }

    async function onCreateContest(){
        const res= await getActiveContest();
        if(res.data){
            setActiveContest(res.data);
        }
        var moment = new Date()
        moment.setMonth(moment.getMonth()+1)
        const date = moment.toISOString()
        console.log(date)
        if(activeContest !== 0){
            const deactivate = await changeContestState({contestNumber:activeContest, active:false})
            console.log(deactivate)
            const result = await createContest({contestNumber:activeContest+1,areas:[],endDate: date, active:true})
            setActiveContest(activeContest+1)
            console.log(result)
        }
        else{
            const result = await createContest({contestNumber:1,areas:[],endDate: date, active:true})
            setActiveContest(1)
            console.log(result)
        }
    }

    async function destroyContest(){
        const res= await getActiveContest();
                if(res.data){
                    setActiveContest(res.data);
                }
        const destroy = await deleteContest({contestNumber:contestNumber})
        console.log(destroy)
    }
   async function jsonToDB(){
    let contestAreas: contestArea[] = []
    contestNeighborhoods.features.forEach(item=>{
        contestAreas.push({areaName:String(item.properties.name),ownershipBonus: Math.trunc(item.properties.AREA/100000) })
    })
    console.log(contestAreas)
    const update = await setAreas({contestNumber:contestNumber,areas:contestAreas})
    console.log(update)
   }

    async function activateContest(){
        const res= await getActiveContest();
                if(res.data){
                    setActiveContest(res.data);
                }
        
        const activate = await changeContestState({contestNumber:contestNumber, active: true})
        if(activate.code === 0 && activate.data !== activeContest) {
            await changeContestState({contestNumber:activeContest,active:false})
            setActiveContest(contestNumber)   
        }
        console.log(activate)
    }

    async function Mailer(){
        const res = await sendMail({recipient:recEmail,html:body,subject:subject})
        console.log(res)
    }

    async function deactivateContest(){
        if(contestNumber !== 0 ) {
            const res = await changeContestState({contestNumber:contestNumber, active:false})
            console.log(res)
        }
    }
    
    async function onGetNickname(){
        if(userId !== "" && userId !== undefined){
            console.log(userId)
            const res = await getNickname({id:userInfo.id!});
            console.log(res)
        }
    }

    async function onGetAreaOwner(){
        if(areaName !== "" && contestNumber !== 0){
            console.log("getting owner?")
            const res = await getAreaOwner({contestNumber:contestNumber, areaName:areaName})
            console.log(res)
        }
    }

    function UseMyId(){
        setUserId(readLocal("id" as LocalStorageKeyType) as string)
        jsonToDB()
    }

    async function onUpdateArea(){
        if(areaName !== ""){
            console.log(userInfo.id!)
        const res = await updateContestStats({id:userInfo.id!, areaName:areaName,areaScoreIncrement:areaScoreIncrement})
        console.log(res)
        }
    }

    async function resetAllContestScores(){
        const res = await resetContestScore({id:userInfo.id!})
        console.log(res)
    }

    async function clearOwner(){
        const res = await updateAreaOwner({contestNumber:1,areaName:areaName,owner:undefined})
        console.log(res)
    }

    async function retrieveAreaScore(){
        const res = await getAreaScore({id:userId,areaName:areaName})
        console.log(res)
    }
    
    return(
        <>
        <Container>
            <Box sx={{marginTop:5}}>
            <TextField label="Area" size="small" onChange={(e)=>setAreaName(e.target.value)}></TextField> 
            <TextField label="Area Ownership Bonus" size="small" onChange={(e)=>setAreaBonus(+e.target.value)}></TextField> 
            <TextField label="Area Score Increment" size="small" onChange={(e)=>setAreaScoreIncrement(+e.target.value)}></TextField> <br/>

            <button onClick={()=> onSubmitArea()}>Submit new area</button>
            <button onClick={()=> onUpdateArea()}>Update area score for current user</button> <br /> <br />
            <button onClick={()=> resetAllContestScores()}>Reset all contest stats for current user</button> <br />
            <button onClick={()=> clearOwner()}>Clear ownership of area</button>
            <button onClick={()=> onGetAreaOwner()}>Get Area Owner</button>
            <button onClick={()=> retrieveAreaScore()}>Get Area Score</button>
            </Box>
            <Box sx = {{marginTop:5}}>
            <button onClick={()=> onCreateContest()}>Create new contest</button>
            </Box>
            <Box sx = {{marginTop:5}}>
            <TextField label="Contest Number" size="small" onChange={(e)=>setContestNumber(+e.target.value)}></TextField>
            <button onClick={()=> activateContest()}>Activate contest number</button>
            <button onClick={()=> deactivateContest()}>Deactivate contest number</button>
            <button onClick={()=> destroyContest()}>Delete contest number</button>
            </Box>
            <Box sx = {{marginTop:5}}>
            <TextField label="user id" size="small" value={userId} onChange={(e)=>setUserId(e.target.value)}></TextField>
            <button onClick={()=>UseMyId()} > Use My Id</button>
            <button onClick={()=> onGetNickname()}>Get Nickname from Id</button>
            </Box>
            <Box sx= {{marginTop:5}}>
                <TextField label="recipient email" size="small" value={recEmail} onChange={(e)=>setRecEmail(e.target.value)}></TextField>   
                <TextField label="subject" size="small" value={subject} onChange={(e)=>setSubject(e.target.value)}></TextField>   
                <TextField multiline label="Email Body" size="small" value={body} onChange={(e)=>setBody(e.target.value)} fullWidth margin="normal"></TextField> 

                
                <button onClick={()=>Mailer()}>Send Email</button>
            </Box>
            <button onClick={()=> showRecentUsers()}>Get recently modified users</button>
            
        </Container>
        </>
    )
}