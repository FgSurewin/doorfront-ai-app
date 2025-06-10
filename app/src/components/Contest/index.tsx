import { readLocal } from "../../utils/localStorage"
import { getNickname, getAreaScore } from "../../apis/user"
import { getArea } from "../../apis/contest"
import { LocalStorageKeyType } from "../../utils/localStorage"
import * as React from 'react'
import { Typography } from '@mui/material'
import { useUserStore } from "../../global/userState"

export function ContestAreaInfo({ areaName }: {
  areaName: string;
}) {


  const { userInfo } = useUserStore()
  const [currentOwner,setCurrentOwner] = React.useState("")
  const [currentOwnerScore, setCurrentOwnerScore] = React.useState(0)
  const [myScore,setMyScore] = React.useState(0)
  const [ownershipBonus, setOwnershipBonus] = React.useState(0)
  // const [contestUsers, setContestUsers] = React.useState<contestUserReturn[]>([])
  // const [contestInfo, setContestInfo] = React.useState({
  //   currentOwnerId: "",
  //   currentOwner: "",
  //   currentOwnerScore: 0,
  //   ownershipBonus: 0,
  //   myScore: 0
  // })

  React.useEffect(() => {

    // async function getAllUsers() {
    //   const contestNumber = readLocal("contest" as LocalStorageKeyType) as unknown as number

    //   const currentArea = await getArea({ contestNumber: contestNumber, areaName: areaName })
    //   console.log(currentArea)
    //   if (currentArea.data !== undefined) {
    //     setContestInfo((prevState) => ({ ...prevState, ownershipBonus: currentArea.data!.ownershipBonus }))
    //     setContestInfo((prevState) => ({ ...prevState, currentOwnerId: currentArea.data!.currentOwner! }))
    //     console.log(contestInfo)
    //     // if (currentArea.data.currentOwner !== undefined) {
    //     //   setContestInfo((prevState) => ({ ...prevState, currentOwnerId: currentArea.data!.currentOwner! }))
    //     //   console.log(contestInfo)

    //     // }

    //     const contestUsersDB = await getAllContestUsersInfo()
    //     //console.log(contestUsersDB)
    //     if (contestUsersDB && contestUsersDB.data.length > 0) {
    //       // setContestUsers(contestUsersDB.data)
    //       console.log(contestUsersDB)
    //       var count = 0;
    //       for (var i = 0; i < contestUsersDB.data.length; i++) {
    //         //console.log(contestUsersDB.data[i]._id)
            

    //           if(contestUsersDB.data[i]._id === contestInfo.currentOwnerId){

    //           console.log("found current owner ")
    //           setContestInfo((prevState) => ({ ...prevState, currentOwner: contestUsersDB.data[i].nickname }))

    //           for (var k = 0; k < contestUsersDB.data[i].areaScores.length; k++) {
    //             //   console.log(contestUsersDB.data[i].areaScores[k].areaName)
    //             // console.log(areaName as string)

    //             if (contestUsersDB.data[i].areaScores[k].areaName == areaName) {
    //                console.log("found areaName CO")
    //               setContestInfo((prevState) => ({ ...prevState, currentOwnerScore: contestUsersDB.data[i].areaScores[k].areaScore }))
    //               count++
    //             }
    //           }
    //         }
    //         if (contestUsersDB.data[i].nickname === userInfo.nickname) {
    //           console.log("found yourself")
    //           for (var k = 0; k < contestUsersDB.data[i].areaScores.length; k++) {
    //             // console.log(contestUsersDB.data[i].areaScores[k].areaName)
    //             // console.log(areaName as string)
    //             if (contestUsersDB.data[i].areaScores[k].areaName == areaName) {
    //               console.log("found areaName ME")
    //               setContestInfo((prevState) => ({ ...prevState, myScore: contestUsersDB.data[i].areaScores[k].areaScore }))
    //               count++
    //             }

    //           }
    //         }
    //         if (count == 2) break
    //       }
    //       // console.log(contestInfo)


    //     }
    //   }
    // }
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
    retrieveAreaOwner()
    // getAllUsers()
    // console.log(contestInfo)
  }, [areaName])



  if (ownershipBonus > 0 && areaName !== "") {
    // console.log(contestInfo)
    return (
      <div>

        {currentOwner !== "" &&
          <Typography variant="h6" sx={{ ml: 3, mt: '2px' }}>
            <b>Current Owner:</b> {currentOwner}
          </Typography>
        }
        {currentOwnerScore !== 0 &&
          <Typography variant="h6" sx={{ ml: 3, mt: '2px' }}>
            <b>Current Owner Area Score:</b> {currentOwnerScore}
          </Typography>
        }
        <Typography variant="h6" sx={{ ml: 3, mt: '2px' }}>
          <b>Ownership Bonus:</b> {ownershipBonus}
        </Typography>
        {myScore !== 0 &&
          <Typography variant="h6" sx={{ ml: 3, mt: '2px', mb: '5px' }}>
            <b>My Area Score:</b> {myScore}
          </Typography>
        }
      </div>
    )
  }
  // if (contestInfo.ownershipBonus > 0 && areaName !== "") {
  //   // console.log(contestInfo)
  //   return (
  //     <div>

  //       {contestInfo.currentOwner !== "" &&
  //         <Typography variant="h6" sx={{ ml: 3, mt: '2px' }}>
  //           <b>Current Owner:</b> {contestInfo.currentOwner}
  //         </Typography>
  //       }
  //       {contestInfo.currentOwnerScore !== 0 &&
  //         <Typography variant="h6" sx={{ ml: 3, mt: '2px' }}>
  //           <b>Current Owner Area Score:</b> {contestInfo.currentOwnerScore}
  //         </Typography>
  //       }
  //       <Typography variant="h6" sx={{ ml: 3, mt: '2px' }}>
  //         <b>Ownership Bonus:</b> {contestInfo.ownershipBonus}
  //       </Typography>
  //       {contestInfo.myScore !== 0 &&
  //         <Typography variant="h6" sx={{ ml: 3, mt: '2px', mb: '5px' }}>
  //           <b>My Area Score:</b> {contestInfo.myScore}
  //         </Typography>
  //       }
  //     </div>
  //   )
  // }
  else return <></>
}