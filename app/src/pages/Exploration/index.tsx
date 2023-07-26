import React from "react";
import Navbar from "../../components/Navbar";
import GoogleMap from "../../components/GoogleMap";
import ActionPanel from "../../components/ActionPanel";
import ImageDrawer from "./ImageDrawer";
import BadgeShowcase from "./BadgeShowcase";
import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { generateInfo } from "../../components/GoogleMap/utils/streetViewTool";
import { debouncedStreetViewImageChange } from "./utils/debounceFunc";
import { useExplorationStore } from "../../global/explorationState";
import { useUpdateExplorationPage } from "../../hooks/useUpdateExploration";
import { useTourStore } from "../../global/tourState";
import Joyride, { CallBackProps, EVENTS } from "react-joyride";
import TreasureShowcase from "./TreasureShowcase";
import UserCreditShowcase from "./UserCreditShowcase";
import { contestNeighborhoods } from "../../components/Map/contest";
import * as turf from '@turf/turf'
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { LocalStorageKeyType, readLocal } from "../../utils/localStorage";
import { ContestAreaInfo } from "../../components/Contest";

export default function ExplorationPage() {
  const {
    explorationTour,
    explorationSteps,
    explorationTourStepIndex,
    updateExplorationTourStepIndex,
    updateExplorationTour,
  } = useTourStore();

  /* ------------------------------ Global State ------------------------------ */
  const {
    googleMapConfig,
    streetViewImageConfig,
    updateGoogleMapConfig,
    updateStreetViewImageConfig,
    panoramaMarkerList,
    setIsNextPosition,
    updateCurrentSelectedImage,

  } = useExplorationStore();

  const [currentArea,setCurrentArea] = React.useState("")
  /*
  function parseGeoinput() {
    var neighborhoods: Feature<Polygon>[] = [];
    for(var i = 0; i < contestNeighborhoods.features.length; i++){
      neighborhoods.push(turf.polygon(contestNeighborhoods.features[i].geometry.coordinates,contestNeighborhoods.features[i].properties))
    }
    return neighborhoods;
  }

  const turfStreetPoints: Feature<Polygon>[] = React.useMemo(() => parseGeoinput(), [])
  */
  
  React.useEffect(()=>{
    const point =  turf.point([googleMapConfig.position.lng,googleMapConfig.position.lat]);
    var found = false;
    for( const area of contestNeighborhoods.features){
      if(booleanPointInPolygon(point, area)){
        console.log('update current area')
        setCurrentArea(String(area.properties.name))
        found = true;
        break
      }
    }
    if(!found) setCurrentArea("");
    
  },[googleMapConfig.position])
  
  /* -------------------------------------------------------------------------- */
  /*                                 Custom Hook                                */
  /* -------------------------------------------------------------------------- */
  const { handleNextPosition, } = useUpdateExplorationPage();

  const onPovChanged = (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => {
    debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
  };

  const onPositionChanged = (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => {
    console.log("onPositionChanged -> ", result);
    debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
    if (result.position && result.pov) {
      setIsNextPosition(false);
      updateGoogleMapConfig({
        panoId: result.pano,
        position: result.position,
        povConfig: { ...result.pov, zoom: result.zoom },
      });
      updateCurrentSelectedImage("");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                        Guild Tour Callback Function                        */
  /* -------------------------------------------------------------------------- */
  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { action, index, type } = data;

    // * Handle error situation
    if ([EVENTS.TARGET_NOT_FOUND].includes(type as "error:target_not_found")) {
      await handleNextPosition();
      updateExplorationTour(false);
      updateExplorationTourStepIndex(0);
    }
    // * Handle next situation
    if (action === "next" && type === EVENTS.STEP_AFTER) {
      // console.log("next");
      updateExplorationTourStepIndex(index + 1);
    }
    // * Handle prev situation
    if (action === "prev" && type === EVENTS.STEP_AFTER) {
      // console.log("prev");
      updateExplorationTourStepIndex(index - 1);
    }
    // * Handle over situation (even skip will trigger "over" so I just comment skip situation)
    if (type === "tour:end") {
      // console.log("over");
      updateExplorationTour(false);
      updateExplorationTourStepIndex(0);
      await handleNextPosition();
    }
  };

  return (
    <div style={{ minWidth: "1440px" }} className="ExplorationWrapper">
      <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        run={explorationTour}
        scrollToFirstStep={true}
        showProgress={true}
        steps={explorationSteps}
        stepIndex={explorationTourStepIndex}
        styles={{
          options: {
            zIndex: 10000,
            width: "500px",
          },
        }}
      />
      <Navbar position="static" isTransparent={false} />
      <Paper
        id="ExplorationContainer"
        sx={{
          minHeight: "calc(100vh - 74px)",
          backgroundColor: "rgba(225, 207, 185, 0.15)",
          minWidth: "1440px",
        }}
      >
        <Container maxWidth="xl">
          <Grid container sx={{ pt: 3 }}>
            <Grid item xs={12}>
            {readLocal("contest" as LocalStorageKeyType) !== null && readLocal("contest" as LocalStorageKeyType) !== ""&&
              <>
              {currentArea != "" && <Typography variant="h6" sx={{ml:3}}><b>Current Area:</b> {currentArea}</Typography>
              }
              <ContestAreaInfo areaName={currentArea} />
              </>
             }

            </Grid>
            <Grid item xs={8} sx={{ minHeight: "640px", minWidth: "890px" }}>
              {googleMapConfig.panoId !== "" && (
                <GoogleMap
                  streetViewEvents={{ onPovChanged, onPositionChanged }}
                  mapConfig={{
                    center: googleMapConfig.position,
                    zoom: googleMapConfig.staticMapZoom,
                  }}
                  streetViewConfig={{
                    pov: googleMapConfig.povConfig,
                    position: googleMapConfig.position,
                  }}
                  streetViewMarkerList={panoramaMarkerList}
                />
              )}
              <Stack direction="row" spacing={2}>
                <Typography variant="h6">
                  Heading: {Math.round(streetViewImageConfig.imagePov.heading)}
                </Typography>
                <Typography variant="h6">
                  Pitch: {Math.round(streetViewImageConfig.imagePov.pitch)}
                </Typography>
                <Typography variant="h6">
                  Zoom: {Math.round(streetViewImageConfig.imagePov.zoom)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <BadgeShowcase />
              <UserCreditShowcase />
              <ActionPanel onNext={handleNextPosition} />
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <ImageDrawer />
      <TreasureShowcase />
    </div>
  );
}
