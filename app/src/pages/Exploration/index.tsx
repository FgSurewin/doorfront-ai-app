import React from "react";
import Navbar from "../../components/Navbar";
import GoogleMap from "../../components/GoogleMap";
import ActionPanel from "../../components/ActionPanel";
import ImageDrawer from "./ImageDrawer";
import BadgeShowcase from "./BadgeShowcase";
import {Container, Grid, Paper, Stack, Typography, Button, TextField} from "@mui/material";
import {generateInfo} from "../../components/GoogleMap/utils/streetViewTool";
import {debouncedStreetViewImageChange} from "./utils/debounceFunc";
import {useExplorationStore} from "../../global/explorationState";
import {useUpdateExplorationPage} from "../../hooks/useUpdateExploration";
import {useTourStore} from "../../global/tourState";
import {CallBackProps, EVENTS} from "react-joyride";
import TreasureShowcase from "./TreasureShowcase";
import UserCreditShowcase from "./UserCreditShowcase";
import {contestNeighborhoods} from "../../components/Map/contest";
import * as turf from '@turf/turf'
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import {LocalStorageKeyType, readLocal} from "../../utils/localStorage";
import {ContestAreaInfo} from "../../components/Contest";
import "./exploration.css";
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import {fromAddress, setKey} from "react-geocode";
import {useSnackbar} from "notistack";

export default function ExplorationPage() {
  const {
    explorationTour,
    // explorationSteps,
    // explorationTourStepIndex,
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
    clickedLocation,
    updateClickedLocation,
  } = useExplorationStore();

  const {enqueueSnackbar} = useSnackbar();

  const [currentArea, setCurrentArea] = React.useState("")
  const [address, setAddress] = React.useState("");
  const [location, setLocation] = React.useState({lat: 0, lng: 0})
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

  React.useEffect(() => {
    const point = turf.point([googleMapConfig.position.lng, googleMapConfig.position.lat]);
    let found = false;
    for (const area of contestNeighborhoods.features) {
      if (booleanPointInPolygon(point, area)) {
        console.log('update current area')
        setCurrentArea(String(area.properties.name))
        found = true;
        break
      }
    }
    if (!found) setCurrentArea("");

  }, [googleMapConfig.position])

  /* -------------------------------------------------------------------------- */
  /*                                 Custom Hook                                */
  /* -------------------------------------------------------------------------- */
  const {handleNextPosition, handleClickedLocation} =
    useUpdateExplorationPage();

  /* ------------------------------ React Effect ------------------------------ */
  React.useEffect(() => {
    (async function () {
      if (!explorationTour && clickedLocation) {
        await handleClickedLocation(clickedLocation);
        updateClickedLocation(null);
      }
    })();
  }, [
    clickedLocation,
    explorationTour,
    handleClickedLocation,
    // handleNextPosition,
    updateClickedLocation,
  ]);

  /* -------------------------------------------------------------------------- */
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
    // console.log("onPositionChanged -> ", result);
    debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
    if (result.position && result.pov) {
      setIsNextPosition(false);
      updateGoogleMapConfig({
        panoId: result.pano,
        position: result.position,
        povConfig: {...result.pov, zoom: result.zoom},
      });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                        Guild Tour Callback Function                        */
  /* -------------------------------------------------------------------------- */
  const handleJoyrideCallback = async (data: CallBackProps) => {
    const {action, index, type} = data;

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
      if (clickedLocation) {
        await handleClickedLocation(clickedLocation);
      } else {
        await handleNextPosition();
      }
    }
  };


  const scrollToDirection = (direction: 'top' | 'bottom') => {
    const top = 0;
    const bottom = document.documentElement.scrollHeight;

    const scrollToValue = direction === 'top' ? top : bottom;

    window.scrollTo({
      top: scrollToValue,
      behavior: 'smooth',
    });
  };
  setKey(process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY as string)

  async function handleClick() {
    try {
      const result = await fromAddress(address)
      console.log(result)
      if (result.status === "OK") {
        setLocation({lat: result.results[0].geometry.location.lat, lng: result.results[0].geometry.location.lng});
        console.log(location)
      }
      else{
        enqueueSnackbar("The location is not a valid address!", {variant: "error"})
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("The location is not a valid address!", {variant: "error"});
    }
    finally {
      updateStreetViewImageConfig({imageLocation: {lat: location.lat, lng: location.lng}})
          updateGoogleMapConfig({
            position: {
              lat: location.lat, lng: location.lng
            }
          })
          updateClickedLocation({
            lat: location.lat, lng: location.lng
          });
    }

    // .then(({ results }) => {
    //   const { lat, lng } = results[0].geometry.location;
    //   if(results){
    //     updateStreetViewImageConfig({imageLocation: {lat, lng}})
    //     updateGoogleMapConfig({
    //       position: {
    //         lat,
    //         lng
    //       }
    //     })
    //     updateClickedLocation({
    //       lat,
    //       lng
    //     });
    //
    //     console.log(lat, lng)
    //     console.log(googleMapConfig)
    //   }
    // })
    // .catch((error)=>{
    //   console.error(error);
    //   enqueueSnackbar("The location is not a valid address!", {variant: "error"});
    // })}
  }

  return (
    <div id="ExplorationWrapper">

      {/*<Joyride*/}
      {/*	callback={handleJoyrideCallback}*/}
      {/*	continuous={true}*/}
      {/*	run={explorationTour}*/}
      {/*	scrollToFirstStep={true}*/}
      {/*	showProgress={true}*/}
      {/*	steps={explorationSteps}*/}
      {/*	stepIndex={explorationTourStepIndex}*/}
      {/*	styles={{*/}
      {/*		options: {*/}
      {/*			zIndex: 10000,*/}
      {/*			width: "500px",*/}
      {/*		},*/}
      {/*	}}*/}
      {/*/>*/}
      <Navbar position="static" isTransparent={false}/>
      <Paper
        id="ExplorationContainer"
        elevation={4}
        sx={{
          paddingTop: {xs: '0', md: '0', lg: '3em'},
          paddingBottom: "6rem",
          backgroundColor: "rgba(225, 207, 185, 0.15)"
        }}
      >
        <Container maxWidth="xl">
          <Grid container maxWidth="s">
            <Grid item xs={4}>
              <TextField label={"Address"} value={address} onChange={(e) => setAddress(e.target.value)}/>

            </Grid>
            <Grid item xs={8}>
              <Button variant={"contained"} onClick={() => handleClick()}>
                Go!
              </Button>
            </Grid>
          </Grid>

          <Stack
            sx={{display: {xs: 'flex', md: 'flex', lg: 'none'}}}
            padding="1rem"
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Button endIcon={<SouthIcon className='arrow-icon'/>} onClick={() => scrollToDirection('bottom')}>
              Scroll To Bottom
            </Button>
          </Stack>
          <Grid container sx={{pt: {xs: 1, lg: 3}}}>
            <Grid item xs={12}>
              {readLocal("contest" as LocalStorageKeyType) !== null && readLocal("contest" as LocalStorageKeyType) !== "" &&
                  <>
                    {currentArea !== "" &&
                        <Typography variant="h6" sx={{ml: 3}}><b>Current Area:</b> {currentArea}</Typography>
                    }
                      <ContestAreaInfo areaName={currentArea}/>
                  </>
              }
            </Grid>
            <Grid item sm={12} lg={8} width={"100%"} sx={{pr: {sm: 0, lg: 5}}} id="GridBot">
              {googleMapConfig.panoId !== "" && (
                <GoogleMap
                  streetViewEvents={{onPovChanged, onPositionChanged}}
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
            <Grid item sm={12} lg={4} width={"100%"} id="GridBot">
              <BadgeShowcase/>
              <UserCreditShowcase/>
              <ActionPanel onNext={handleNextPosition}/>
            </Grid>
          </Grid>
        </Container>
        <Stack
          sx={{display: {xs: 'flex', md: 'flex', lg: 'none'}}}
          padding="1rem"
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Button startIcon={<NorthIcon className='arrow-icon'/>} onClick={() => scrollToDirection('top')}>
            Scroll To Top
          </Button>
        </Stack>
      </Paper>
      <ImageDrawer/>
      <TreasureShowcase/>
    </div>
  );
}
