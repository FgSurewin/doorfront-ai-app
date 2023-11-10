import React from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { fetchStreetViewImagesByPano } from "../apis/collectedImage";
import { fetchMetadata } from "../apis/queryStreetView";
import { useExplorationStore } from "../global/explorationState";
import { useUserStore } from "../global/userState";
import { deleteAllLocal } from "../utils/localStorage";
import { getRandomLocationFromDB } from "../apis/location";

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
	} = useExplorationStore();
	const { clearUserInfo } = useUserStore();

	/* ------------------------------ Notification ------------------------------ */
	const { enqueueSnackbar } = useSnackbar();

	const handleNextPosition = React.useCallback(async () => {
    // console.log("handleNextPosition");
    try {
      const { data: location } = await getRandomLocationFromDB();
      const newMetaData = await fetchMetadata(
        process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
        location
      );
       console.log("Action One - Not Changed");
       console.log(location)
      if (newMetaData.status === "OK") {
        if (googleMapConfig.panoId !== newMetaData.pano_id) {
          console.log("Action Two- Changed -> Update Map");
          updateGoogleMapConfig({
            panoId: newMetaData.pano_id,
            position: newMetaData.location,
            povConfig: streetViewImageConfig.imagePov,
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

  const handleClickedLocation = React.useCallback(
    async (location: { lat: number; lng: number }) => {
      try {
        const newMetaData = await fetchMetadata(
          process.env.REACT_APP_API_KEY!,
          location
        );
        // console.log("Action One - Not Changed");
        if (newMetaData.status === "OK") {
          if (googleMapConfig.panoId !== newMetaData.pano_id) {
            // console.log(
            //   "handleClickedLocation - Action Two- Changed -> Update Map"
            // );
            updateGoogleMapConfig({
              panoId: newMetaData.pano_id,
              position: newMetaData.location,
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
          // console.log("Save Images -> ", streetViewImages);
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