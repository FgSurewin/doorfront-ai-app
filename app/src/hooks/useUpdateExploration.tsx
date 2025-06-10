import React from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { fetchStreetViewImagesByPano } from "../apis/collectedImage";
import {fetchMetadata, getNewStreetview} from "../apis/queryStreetView";
import { useExplorationStore } from "../global/explorationState";
import { useUserStore } from "../global/userState";
import { deleteAllLocal } from "../utils/localStorage";
import { getRandomLocationFromDB } from "../apis/location";
import streetlines from "../components/Map/streetlines.json"

export const useUpdateExplorationPage = () => {
	/* ------------------------------ React router ------------------------------ */
	const navigate = useNavigate();
	/* ------------------------------ Global State ------------------------------ */
	const {
		googleMapConfig,
		streetViewImageConfig,
		updateGoogleMapConfig,
		saveCollectedImageList,
		setIsNextPosition,
    updateStreetViewImageConfig
	} = useExplorationStore();
	const { clearUserInfo } = useUserStore();

	/* ------------------------------ Notification ------------------------------ */
	const { enqueueSnackbar } = useSnackbar();

	const handleNextPosition = React.useCallback(async () => {
    // console.log("handleNextPosition");
    try {
      // const { data: location } = await getRandomLocationFromDB();
      const location = getRandomPoint()
      const newMetaData = await fetchMetadata(
        process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
        location
      );
      getRandomPoint()
       // console.log("Action One - Not Changed");
       // console.log(location)
      if (newMetaData.status === "OK") {
        if (googleMapConfig.panoId !== newMetaData.pano_id) {
          // console.log("Action Two- Changed -> Update Map");
          updateGoogleMapConfig({
            panoId: newMetaData.pano_id,
            position: newMetaData.location,
            povConfig: streetViewImageConfig.imagePov,
          });
          updateStreetViewImageConfig({
            panoId: newMetaData.pano_id,
            imageLocation: newMetaData.location,
          });
          setIsNextPosition(true);
        }
      }
    } catch (_) {
      navigate("/login");
    }
  }, [
    googleMapConfig.panoId,
    setIsNextPosition,
    streetViewImageConfig.imagePov,
    navigate,
    updateGoogleMapConfig,
  ]);

  // const handleClickedLocation = React.useCallback(
  //   async (location: { lat: number; lng: number }) => {
  //     try {
  //       const newMetaData = await fetchMetadata(
  //         process.env.REACT_APP_API_KEY!,
  //         location
  //       );
  //       // console.log("Action One - Not Changed");
  //       if (newMetaData.status === "OK") {
  //         if (googleMapConfig.panoId !== newMetaData.pano_id) {
  //           // console.log(
  //           //   "handleClickedLocation - Action Two- Changed -> Update Map"
  //           // );
  //           updateGoogleMapConfig({
  //             panoId: newMetaData.pano_id,
  //             position: newMetaData.location,
  //             povConfig: streetViewImageConfig.imagePov,
  //           });
  //           setIsNextPosition(true);
  //         }
  //       }
  //     } catch (_) {
  //       navigate("/login");
  //     }
  //   },
  //   [
  //     updateGoogleMapConfig,
  //     navigate,
  //     setIsNextPosition,
  //     streetViewImageConfig.imagePov,
  //     googleMapConfig.panoId,
  //   ]
  // );

  function getRandomPoint(){
    //console.log(streetlines)
    const randomArea = Math.floor(Math.random() * streetlines.length)
    const randomLocation = Math.floor(Math.random() * streetlines[randomArea].locations.length);
    return streetlines[randomArea].locations[randomLocation]
    // for(const area of streetlines){
    //   const random = Math.floor(Math.random() * streetlines.length)
    //   console.log(random)
    //   console.log(area.locations[1])
    //   // for(const point of area.locations[random]){
    //   //   const random = Math.floor(Math.random() * streetlines.length)
    //   // }
    // }
  }
  const handleClickedLocation = React.useCallback(
    async (location: { lat: number; lng: number }) => {
      try {
        const newMetaData = await getNewStreetview(
          process.env.REACT_APP_API_KEY!,
          location
        );

        // console.log("Action One - Not Changed");
        if (newMetaData && newMetaData.data.links) {
          if (googleMapConfig.panoId !== newMetaData.data.location?.pano) {
            // console.log(
            //   "handleClickedLocation - Action Two- Changed -> Update Map"
            // );
            updateGoogleMapConfig({
              panoId: newMetaData.data.location?.pano,
              position: location,
              povConfig: streetViewImageConfig.imagePov,
            });
            setIsNextPosition(true);
          }
        }
      } catch (_) {
        navigate("/login");
      }
    },
    [
      updateGoogleMapConfig,
      navigate,
      setIsNextPosition,
      streetViewImageConfig.imagePov,
      googleMapConfig.panoId,
    ]
  );

  React.useEffect(() => {
    const internalFunc = async (panoId: string) => {
      try {
        const streetViewImages = await fetchStreetViewImagesByPano(
          { panoId },
          {
            clearUserInfo,
            navigate,
            deleteAllLocal,
          }
        );
        // console.log("Save Images with pano-> ", streetViewImages);

        if (
          streetViewImages.code === 0 &&
          streetViewImages.data &&
          streetViewImages.data.length > 0
        ) {
           //console.log("Save Images -> ", streetViewImages);
          saveCollectedImageList(streetViewImages.data);
        } else {
          saveCollectedImageList([]);
        }
      } catch (e) {
        const error = e as Error;
        console.log(error.message);
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    };
    internalFunc(googleMapConfig.panoId);
  }, [
    googleMapConfig.panoId,
    saveCollectedImageList,
    enqueueSnackbar,
    navigate,
    clearUserInfo,
  ]);

  return { handleNextPosition, handleClickedLocation };
};