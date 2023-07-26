import { readLocal } from "../../utils/localStorage"
import { getNickname, getAreaScore } from "../../apis/user"
import { getArea } from "../../apis/contest"
import { LocalStorageKeyType } from "../../utils/localStorage"
import * as React from 'react'
import {Typography} from '@mui/material'
import { useUserStore } from "../../global/userState"

export function ContestAreaInfo({ areaName }: {
  areaName: string;
}){
  const {userInfo} = useUserStore()
  const [currentOwner,setCurrentOwner] = React.useState("")
  const [currentOwnerScore, setCurrentOwnerScore] = React.useState(0)
  const [myScore,setMyScore] = React.useState(0)
  const [ownershipBonus, setOwnershipBonus] = React.useState(0)

React.useEffect(()=> {
  retrieveAreaOwner()
},[areaName])

async function retrieveAreaOwner(){
    //console.log(areaName)
    const contestNumber = readLocal("contest" as LocalStorageKeyType) as unknown as number
    if(contestNumber && areaName !== ""){
      //console.log(contestNumber)
      const result = await getArea({contestNumber:contestNumber as number, areaName:areaName as string})
      //console.log(result)
      const myScore = await getAreaScore({id:userInfo.id as string,areaName:areaName})
      if(myScore){
        setMyScore(myScore.data)
      }
      //console.log(result)
      if(result.data){
        setOwnershipBonus(result.data.ownershipBonus)
        if(result.data.currentOwner){
          const ownerName = await getNickname({id:result.data.currentOwner})
          // console.log(ownerName)
          if(ownerName.data) {
            setCurrentOwner(ownerName.data)
            const ownerScore = await getAreaScore({id:result.data.currentOwner, areaName: areaName})
          // console.log(ownerScore)
            if(ownerScore) setCurrentOwnerScore(ownerScore.data - result.data.ownershipBonus)
          }
        } else{
          setCurrentOwner("")
          setCurrentOwnerScore(0)
        }
      } else {
        console.log("reset values")
        setCurrentOwner("")
        setCurrentOwnerScore(0)
        setOwnershipBonus(0)
        setMyScore(0)
      }
    }
}

if(ownershipBonus > 0 && areaName !== ""){
  return(
    
      <div>
        {currentOwner !== "" &&
        <Typography variant="h6" sx={{ml:3, mt:'2px'}}>
        <b>Current Owner:</b> {currentOwner}
        </Typography>
        }
        {currentOwnerScore !== 0 &&
        <Typography variant="h6" sx={{ml:3, mt:'2px'}}>
          <b>Current Owner Area Score:</b> {currentOwnerScore}
        </Typography>
        }
        <Typography variant="h6" sx={{ml:3, mt:'2px'}}>
          <b>Ownership Bonus:</b> {ownershipBonus}
        </Typography>
        {myScore !== 0 &&
        <Typography variant="h6" sx={{ml:3, mt:'2px',mb:'5px'}}>
          <b>My Area Score:</b> {myScore}
        </Typography>
        }
      </div>
  )
}
else return <></>
}