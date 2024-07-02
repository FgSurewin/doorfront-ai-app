import React from "react";
import {Button, Stack} from "@mui/material";
import { ReactToolAsideTitle } from "../General";
import { useReactToolsStore } from "../state/reactToolState";
import LabelsShowcase from "./LabelsShowcase";
// import OperationSection from "./OperationSection";
import { contestNeighborhoods } from "../../../components/Map/contest";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { LocationType } from "../../../global/explorationState";
import * as turf from '@turf/turf'
import { ContestAreaInfo } from "../../Contest";
import { updateContestStats } from "../../../apis/user";
import { useUserStore} from "../../../global/userState";
import { readLocal,LocalStorageKeyType } from "../../../utils/localStorage";
import { useSnackbar } from "notistack";
import {useReactToolInternalStore} from "../state/internalState";
export default function LabelPanel() {
  const {enqueueSnackbar} = useSnackbar();
  const {userInfo} = useUserStore();
  const {selectedBoxType,selectedBoxId,onChangeNotesOpen, onChangeSelectedBoxType, onChangeSelectedBoxId} = useReactToolInternalStore();
  const {
    selectedImageId,
    reactToolImageList,
    operationsFuncs,
    deleteReactToolImage,
    isSubmitting,
    updateIsSubmitting,
  } = useReactToolsStore();
  const handleSubmit = async () => {
    updateIsSubmitting(true);
    const filterImageList = reactToolImageList.filter(
      (item) => item.imageId === selectedImageId
    );
    const currentImage = filterImageList[0];
    if (operationsFuncs.onSubmitImage) {
      await operationsFuncs.onSubmitImage(currentImage);
      if(currentArea !== "") {
        const res = await updateContestStats({id: userInfo.id!,areaName: currentArea,areaScoreIncrement:1})
      //console.log(res)
        if(res.code === 1 || res.code === 10 || res.code ===5)enqueueSnackbar(res.message)
      }
      onChangeNotesOpen(false)
      onChangeSelectedBoxType("")
      onChangeSelectedBoxId("")
      console.log(selectedBoxType,selectedBoxId,selectedBoxId);
      deleteReactToolImage(selectedImageId);
      updateIsSubmitting(false);
    }
  };

  const [currentArea,setCurrentArea] = React.useState("")

  const selectedLocation: LocationType = React.useMemo(()=>{
    for(let i = 0; i< reactToolImageList.length; i++){
      if(reactToolImageList[i].imageId === selectedImageId){
        return reactToolImageList[i].location;
      }
    }
    return {lat:0,lng:0}
  }, [selectedImageId,reactToolImageList])
  React.useEffect(()=>{
    let found = false;
    if(selectedLocation.lat !== 0){
    const point =  turf.point([selectedLocation.lng,selectedLocation.lat]);
    for( const area of contestNeighborhoods.features){
      if(booleanPointInPolygon(point, area)){
        setCurrentArea(String(area.properties.name))
        found = true;
        break
      }
    }
    if(!found){
      setCurrentArea("");
    }

  }
  },[selectedImageId, selectedLocation.lng,selectedLocation.lat])

  return (
    <Stack >
      {/* <OperationSection /> */}
      {readLocal("contest" as LocalStorageKeyType) !== null && readLocal("contest" as LocalStorageKeyType) !== ""&&(selectedLocation.lat !== 0) && currentArea !== "" && 
      <div>
      <ReactToolAsideTitle text= {"Contest Area " + currentArea} />
        <ContestAreaInfo areaName= {currentArea}/>
      </div>
      }
      <ReactToolAsideTitle text="Submit by Clicking Button Below" />
      <Button
        fullWidth
        variant="contained"
        sx={{
          width: "80%",
          display: "block",
          margin: "1rem auto",
          color: "white",
          bgcolor: "#389e0d",
          mb: 1,
          py: 1,
          "&:hover": { bgcolor: "#52c41a" },
        }}
        disabled={selectedImageId === "" || isSubmitting}
        onClick={handleSubmit}
        className="submitLabelButton"
      >
        submit labels
      </Button>
      <ReactToolAsideTitle text="Labels" />
      <LabelsShowcase />
    </Stack>
  );
}
