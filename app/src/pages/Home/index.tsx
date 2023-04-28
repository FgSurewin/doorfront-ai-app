import React from "react";
import { getActiveContest, getEndDate } from "../../apis/contest";
import Content from "../../components/Content";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MapboxMap from "../../components/Map";
import { AppBar, Typography } from "@mui/material";
import { readLocal, saveLocal } from "../../utils/localStorage";
import { LocalStorageKeyType } from "../../utils/localStorage";
export default function Home() {
  const [activeContest,updateActiveContest] = React.useState<number|undefined>()
  const [endDate, updateEndDate] = React.useState<string |undefined>()
  async function ac() { 
    const res = await getActiveContest();
    console.log(res)
    updateActiveContest(res.data)
    if (activeContest !== undefined) {
      console.log(activeContest)
      const date = await getEndDate({contestNumber:activeContest})
      updateEndDate(new Date(date.data as string).toUTCString())
      //console.log(endDate)
    }
  }

  React.useEffect(()=>{
    //console.log(readLocal("contest" as LocalStorageKeyType))
    ac();
    if(activeContest !== undefined && activeContest !== null){
      saveLocal("contest" as LocalStorageKeyType,activeContest as unknown as string);
      //console.log(readLocal("contest" as LocalStorageKeyType))
    } 
    else saveLocal("contest" as LocalStorageKeyType, "" )
    //console.log(activeContest)  
  },[activeContest]);

  //console.log(activeContest)
  // React.useEffect(() => {
  //   window.addEventListener("beforeunload", alertUser);
  //   return () => {
  //     window.removeEventListener("beforeunload", alertUser);
  //   };
  // }, []);
  // const alertUser = (e: BeforeUnloadEvent) => {
  //   e.preventDefault();
  //   e.returnValue = "";
  // };
  return (
    <div>
      {activeContest !== undefined && activeContest > 0 &&
      <AppBar position="fixed" color="primary" sx ={{top:'auto', bottom: 0}}>
       <Typography align="center" >Contest {activeContest} is Active! Start Exploring Now to Earn Points for Prizes! Contest Ends {endDate}</Typography>
      </ AppBar>
      }
      <Header />
      <Content />
      <MapboxMap />
      { //<WinnerSection />
      }
      <Footer />
    </div>
  );
}
