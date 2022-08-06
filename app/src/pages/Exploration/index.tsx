import React from "react";
import Navbar from "../../components/Navbar";
import GoogleMap from "../../components/GoogleMap";
import ActionPanel from "../../components/ActionPanel";
import ImageDrawer from "./ImageDrawer";
import BadgeShowcase from "./BadgeShowcase";
import autowalk from "../../images/giphy.gif";
import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { generateInfo } from "../../components/GoogleMap/utils/streetViewTool";
import { debouncedStreetViewImageChange } from "./utils/debounceFunc";
import { useExplorationStore } from "../../global/explorationState";
import { useUpdateExplorationPage } from "../../hooks/useUpdateExploration";
import { useTourStore } from "../../global/tourState";
import Joyride, { CallBackProps, EVENTS } from "react-joyride";
import TreasureShowcase from "./TreasureShowcase";
import UserCreditShowcase from "./UserCreditShowcase";
import Switch from "@mui/material/Switch";
import { useUserStore } from "../../global/userState";
import { useFetchGoogleStreetView } from "../../apis/queryStreetView";
import { useQueryImagesStore } from "../../global/queryImagesState";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { saveImageToDiffList } from "../../apis/user";
import { deleteAllLocal } from "../../utils/localStorage";

// const label = { inputProps: { "aria-label": "Switch demo" } };

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
    isAutoWalk,
    setIsAutoWalk,
  } = useExplorationStore();
  /* ------------------------------ Notification ------------------------------ */
  const { enqueueSnackbar } = useSnackbar();

  /* ------------------------------ React router ------------------------------ */
  const navigate = useNavigate();
  /* -------------------------------------------------------------------------- */
  /*                     Query image and upload to firebase                     */
  /* -------------------------------------------------------------------------- */
  // const [uploadProgress, setUploadProgress] = React.useState(0);
  const { clearUserInfo, userInfo, collectedImgNum, updateCollectedImgNum } =
    useUserStore();
  const { addQueryImage, setIsUploading } = useQueryImagesStore();
  const { refetch } = useFetchGoogleStreetView({
    onSuccess: async (imageId, imgSrc, fileName) => {
      try {
        addQueryImage({ imageId, imgSrc, fileName, isPrelabeled: false });
        //TODO Add UnLabelImage property
        await saveImageToDiffList({
          id: userInfo.id!,
          data: { imageId, imgSrc, fileName },
          category: "unLabel_images",
        });
        enqueueSnackbar("Upload image successfully!", {
          variant: "success",
        });
        setIsUploading(false);
        // setUploadProgress(0);
      } catch (e) {
        const error = e as Error;
        console.log(error.message);
        enqueueSnackbar(error.message, {
          variant: "error",
        });
        clearUserInfo();
        navigate("/");
        deleteAllLocal();
      }
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                 Custom Hook                                */
  /* -------------------------------------------------------------------------- */
  const { handleNextPosition } = useUpdateExplorationPage();

  const onPovChanged = (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => {
    debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
  };

  const onPositionChanged = async (
    result: ReturnType<typeof generateInfo>,
    map: google.maps.Map
  ) => {
    debouncedStreetViewImageChange(result, updateStreetViewImageConfig);
    if (result.position && result.pov) {
      setIsNextPosition(false);
      updateGoogleMapConfig({
        panoId: result.pano,
        position: result.position,
        povConfig: { ...result.pov, zoom: result.zoom },
      });
      if (isAutoWalk) {
        setIsUploading(true);
        await refetch();
        updateCollectedImgNum(collectedImgNum + 1);
      }
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
          <Grid container sx={{ pt: 10 }}>
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
                <Typography variant="h6">
                  Auto walk:{" "}
                  <Switch
                    checked={isAutoWalk}
                    onChange={() => {
                      setIsAutoWalk(!isAutoWalk);
                      // Set isNextPosition to true to force to refresh the map. (Because the map will not update when the auto walk is on)
                      setIsNextPosition(true);
                    }}
                  />
                </Typography>
                {/* <Switch {...label} /> */}
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
      {isAutoWalk && (
        <img
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
          }}
          src={autowalk}
          alt="autowalk"
        />
      )}
    </div>
  );
}


