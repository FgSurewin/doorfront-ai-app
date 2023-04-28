import { readLocal } from "../../utils/localStorage"
import { getNickname, getAreaScore } from "../../apis/user"
import { getArea } from "../../apis/contest"
import { LocalStorageKeyType } from "../../utils/localStorage"
import * as React from 'react'
import {Typography} from '@mui/material'
import { contestNeighborhoods } from "../../components/Map/contest";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { LocationType } from "../../global/explorationState";
import * as turf from '@turf/turf'
import { useReactToolsStore } from "../LabelTool/state/reactToolState";
import { useUserStore } from "../../global/userState"

export function ContestAreaInfo({ areaName }: {
  areaName: string;
}){
  const {
    selectedImageId,
    reactToolImageList,
  } = useReactToolsStore()

  const {userInfo} = useUserStore();

  //const [areaName, setAreaName] = React.useState("")
  const [currentOwner,setCurrentOwner] = React.useState("")
  const [currentOwnerScore, setCurrentOwnerScore] = React.useState(0)
  const [myScore,setMyScore] = React.useState(0)
  const [ownershipBonus, setOwnershipBonus] = React.useState(0)
  const selectedLocation: LocationType = React.useMemo(()=>{
    for(let i = 0; i< reactToolImageList.length; i++){
      if(reactToolImageList[i].imageId === selectedImageId){
        return reactToolImageList[i].location;
      }
    }
    return {lat:0,lng:0}
  }, [selectedImageId,reactToolImageList])
  /*
  React.useEffect(()=>{
    if(selectedLocation.lat !== 0){
    const point =  turf.point([selectedLocation.lng,selectedLocation.lat]);
    for( const area of contestNeighborhoods.features){
      if(booleanPointInPolygon(point, area)){
        setAreaName(area.properties.name as string)
        break
      }
    }

  }
  },[selectedImageId, selectedLocation.lng,selectedLocation.lat])
*/
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
            if(ownerScore) setCurrentOwnerScore(ownerScore.data)
          }
        }
      } else {
        //console.log("reset values")
        setCurrentOwner("")
        setCurrentOwnerScore(0)
        setOwnershipBonus(0)
        setMyScore(0)
      }
    }
}

if(ownershipBonus > 0){
  return(
    
      <div>
        <Typography sx={{ml:3, mt:'2px'}}>
        <b>Current Owner:</b> {currentOwner}
          
        </Typography>
        {currentOwnerScore > 0 &&
        <Typography sx={{ml:3, mt:'2px'}}>
          <b>Current Owner Area Score:</b> {currentOwnerScore}
        </Typography>
        }
        <Typography sx={{ml:3, mt:'2px'}}>
          <b>Ownership Bonus:</b> {ownershipBonus}
        </Typography>
        <Typography sx={{ml:3, mt:'2px',mb:'5px'}}>
          <b>My Area Score:</b> {myScore}
        </Typography>
        
      </div>
  )
}
else return <></>
}