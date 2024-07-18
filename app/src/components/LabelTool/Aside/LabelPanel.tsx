import React, {useState} from "react";
import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import {ReactToolAsideTitle} from "../General";
import {useReactToolsStore} from "../state/reactToolState";
import LabelsShowcase from "./LabelsShowcase";
// import OperationSection from "./OperationSection";
import {contestNeighborhoods} from "../../../components/Map/contest";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import {LocationType} from "../../../global/explorationState";
import * as turf from '@turf/turf'
import {ContestAreaInfo} from "../../Contest";
import {updateContestStats, addUserBonusCredit} from "../../../apis/user";
import {useUserStore} from "../../../global/userState";
import {readLocal, LocalStorageKeyType} from "../../../utils/localStorage";
import {useSnackbar} from "notistack";
import {useReactToolInternalStore} from "../state/internalState";
import {getOpenRequests, RequestData, addLabeler} from "../../../apis/request";

export default function LabelPanel() {
  const {enqueueSnackbar} = useSnackbar();
  const {userInfo} = useUserStore();
  const {
    selectedBoxType,
    selectedBoxId,
    onChangeNotesOpen,
    onChangeSelectedBoxType,
    onChangeSelectedBoxId
  } = useReactToolInternalStore();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
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
      if (currentArea !== "") {
        try {
          const res = await updateContestStats({id: userInfo.id!, areaName: currentArea, areaScoreIncrement: 1})
          //console.log(res)
          if (res.code === 1 || res.code === 10 || res.code === 5) enqueueSnackbar(res.message)
        }
        catch(e){
          console.log(e)
        }
      }
      if(selectedRequestId !== ""){
        try {
          const res1 = await addUserBonusCredit({id: userInfo.id!})
          const res2 = await addLabeler({labelerId: userInfo.id!, requestId: selectedRequestId})
          console.log(res1)
          console.log(res2)
          if (res1 && res2) {
            setSelectedRequestId("")
            enqueueSnackbar("+10 Bonus Points for completing request!")
          }
        }
        catch(e){
          console.log(e)
        }
      }
      onChangeNotesOpen(false)
      onChangeSelectedBoxType("")
      onChangeSelectedBoxId("")
      console.log(selectedBoxType, selectedBoxId, selectedBoxId);
      deleteReactToolImage(selectedImageId);
      updateIsSubmitting(false);
    }
  };

  const [currentArea, setCurrentArea] = React.useState("")

  const selectedLocation: LocationType = React.useMemo(() => {
    for (let i = 0; i < reactToolImageList.length; i++) {
      if (reactToolImageList[i].imageId === selectedImageId) {
        return reactToolImageList[i].location;
      }
    }
    return {lat: 0, lng: 0}
  }, [selectedImageId, reactToolImageList])
  React.useEffect(() => {
    let found = false;
    if (selectedLocation.lat !== 0) {
      const point = turf.point([selectedLocation.lng, selectedLocation.lat]);
      for (const area of contestNeighborhoods.features) {
        if (booleanPointInPolygon(point, area)) {
          setCurrentArea(String(area.properties.name))
          found = true;
          break
        }
      }
      if (!found) {
        setCurrentArea("");
      }

    }
  }, [selectedImageId, selectedLocation.lng, selectedLocation.lat])

  React.useEffect(() => {
    (async function () {
        try {
          const result = await getOpenRequests()
          //console.log(result)
           console.log(result)
          if(result.data) {
            setRequests(result.data)
            for (const request of result.data) {
              //console.log(googleMapConfig.position)
              const decimalPoint = 3
              //console.log(request, selectedLocation)
              if (request.location &&
                request.location.lng.toFixed(decimalPoint) === selectedLocation.lng.toFixed(decimalPoint) &&
                request.location.lat.toFixed(decimalPoint) === selectedLocation.lat.toFixed(decimalPoint)) {
                //console.log("Nearby!");
                console.log(request)
                setSelectedRequestId(request._id as string)
                break
              } else {
                setSelectedRequestId("")
              }
            }
          }
        } catch (e) {
          console.log(e)
        }
      }
    )();
  }, [])


  return (
    <Stack>
      {/* <OperationSection /> */}
      {readLocal("contest" as LocalStorageKeyType) !== null && readLocal("contest" as LocalStorageKeyType) !== "" && (selectedLocation.lat !== 0) && currentArea !== "" &&
          <div>
              <ReactToolAsideTitle text={"Contest Area " + currentArea}/>
              <ContestAreaInfo areaName={currentArea}/>
          </div>
      }
      {selectedRequestId !== "" &&
          <div>
              <Box sx={{ pt: 1 }}>
                  <Typography
                      variant="subtitle2"
                      sx={{
                        textTransform: "uppercase",
                        textAlign: "center",
                        mb: 1,
                        color: "text.primary",
                        fontWeight: "bold",
                      }}
                  >
                    Fulfilling Request!
                  </Typography>
                  <Divider sx={{ borderBottomWidth: 5, bgcolor: "#FFB45C" }} />
              </Box>
          </div>
      }
      <ReactToolAsideTitle text="Submit by Clicking Button Below"/>
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
          "&:hover": {bgcolor: "#8ace00"},
        }}
        disabled={selectedImageId === "" || isSubmitting}
        onClick={handleSubmit}
        className="submitLabelButton"
      >
        submit labels
      </Button>
      <ReactToolAsideTitle text="Labels"/>
      <LabelsShowcase/>
    </Stack>
  );
}
