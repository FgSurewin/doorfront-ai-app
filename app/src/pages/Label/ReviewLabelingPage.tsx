import React from "react";
import LabelTool from "../../components/LabelTool";
import {testTypeConfigs} from "./testImageData";
import {CollectedImageInterface} from "../../types/collectedImage";
import {
  convertHumanImageToInputImageList,
  convertReactToolImageLabelsToDBImageLabels,
} from "./utils/label";
import {ReactToolImageListItemType} from "../../components/LabelTool/state/reactToolState";
import {useLocation, useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import {
  fetchAllImages,
  updateNewHumanLabels,
} from "../../apis/collectedImage";
import {useUserStore} from "../../global/userState";
import {useExplorationStore} from "../../global/explorationState";
import {
  addUserCredit,
  addUserLabelCredit,
  saveImageToDiffList,
} from "../../apis/user";
import {deleteAllLocal} from "../../utils/localStorage";
import {contestNeighborhoods} from "../../components/Map/contest";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import * as turf from "@turf/turf";
import {CircularProgress } from "@mui/material";
import {Box} from "@mui/system";

export default function ReviewLabelingPage() {
  const navigate = useNavigate();
  const {userInfo, clearUserInfo} = useUserStore();
  const {maxModifier} = useExplorationStore();

  const {enqueueSnackbar} = useSnackbar();
  const [Images, setImages] = React.useState<CollectedImageInterface[]>([]);
  const [imagesRetrieved, setImagesRetrieved] = React.useState(false)

  interface LocationStateProps {
    area: number
  }

  const location = useLocation()
  const state = location.state as LocationStateProps;
  if (state) console.log(state.area)
  React.useEffect(() => {
    async function loadFunc() {
      try {
        const result = await fetchAllImages({
          clearUserInfo,
          navigate,
          deleteAllLocal,
        });
        if (result.code === 0) {
          const images = result.data!;
          if (!state) {
            setImages(
              images.filter((image) => {
                // Check if current user has been modify or validate current image
                const names = image.human_labels.map((item) => item.name);
                let incompleteDoor = false;
                if (image.human_labels.length > 0)
                  for (let i = 0; i < image.human_labels[0].labels.length; i++)
                    if (image.human_labels[0].labels[i].label === "door" && image.human_labels[0].labels[i].subtype === "")
                      incompleteDoor = true

                const isDisable =
                  names.includes(userInfo.nickname!) ||
                  //alter to check each label in human_labels[0].labels for door with subtype that is not ""
                  //if door has subtype "", do not disable
                  (image.human_labels.length >= maxModifier && !incompleteDoor) ||
                  image.image_id === "GuildTourSample" ||
                  image.human_labels.length === 0;
                return !isDisable;
              })
            )
          } else {
            const areaData = contestNeighborhoods.features.filter((area) => {
              console.log(state.area)
              if (area.properties.name === state.area) return area
            })
            const areaGeometry = turf.polygon(areaData[0].geometry.coordinates, {name: areaData[0].properties.name})
            setImages(
              images.filter((image) => {
                // Check if current user has been modified or validate current image
                const names = image.human_labels.map((item) => item.name);
                let incompleteDoor = false;
                if (image.human_labels.length > 0)
                  for (let i = 0; i < image.human_labels[0].labels.length; i++)
                    if (image.human_labels[0].labels[i].label === "door" && image.human_labels[0].labels[i].subtype === "")
                      incompleteDoor = true

                const isDisable =
                  names.includes(userInfo.nickname!) ||
                  //alter to check each label in human_labels[0].labels for door with subtype that is not ""
                  //if door has subtype "", do not disable
                  (image.human_labels.length >= maxModifier && !incompleteDoor) ||
                  image.image_id === "GuildTourSample" ||
                  image.human_labels.length === 0 || !booleanPointInPolygon(turf.point([image.location.lng, image.location.lat]), areaGeometry)

                return !isDisable;
              })
            )
          }
        }
      } catch (e) {
        const error = e as Error;
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      } finally {
        setImagesRetrieved(true)
      }

    }

    loadFunc();

  }, [
    enqueueSnackbar,
    userInfo.nickname,
    maxModifier,
    navigate,
    clearUserInfo,
  ]);

  const onSubmit = async (image: ReactToolImageListItemType) => {
    try {
      const filterImageList = Images.filter(
        (item) => item.image_id === image.imageId
      );
      // Extract images data from response data
      // const humanLabelList = filterImageList[0].human_labels;
      const currentImagePov = filterImageList[0].pov;

      // Parse data into certain format required by database
      const newHumanLabels = convertReactToolImageLabelsToDBImageLabels(
        image.labels,
        currentImagePov
      );

      // Insert new label list at the head of the array
      // humanLabelList.unshift({
      //   name: userInfo.nickname || "Nobody",
      //   labels: newHumanLabels,
      // });

      // Send back to Database
      const result = await updateNewHumanLabels(
        {
          imageId: image.imageId,
          data: {
            name: userInfo.nickname || "Nobody",
            labels: newHumanLabels,
          },
        },
        {
          clearUserInfo,
          navigate,
          deleteAllLocal,
        }
      );
      if (result.code === 0) {
        //TODO Add review_images property
        await saveImageToDiffList({
          category: "review_images",
          id: userInfo.id!,
          data: {
            imageId: image.imageId,
            fileName: image.fileName,
            imgSrc: image.imgSrc,
          },
        });
        // * Handle User Credits
        // add create credit
        await addUserCredit({id: userInfo.id!, type: "review"});
        // add label credit
        await addUserLabelCredit({
          id: userInfo.id!,
          labelNum: newHumanLabels.filter(
            (item) => item.labeledBy === userInfo.nickname!
          ).length,
        });

        enqueueSnackbar("Save successfully", {
          variant: "success",
        });
      }
    } catch (e) {
      const error = e as Error;
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  const onFailureExit = () => {
    navigate("/");
  };

  const onSuccessExit = () => {
    navigate("/");
  };

  return (
    <>
      {!imagesRetrieved ?
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress size="3rem"/>
        </Box> :
        (Images && Images.length > 0 ? (
          <LabelTool
            collectedImageList={convertHumanImageToInputImageList(Images)}
            typeConfigs={testTypeConfigs}
            operations={{
              onSubmitImage: onSubmit,
              onFailureExit,
              onSuccessExit,
            }}
            disableDelete={true}
          />
        ) : <div>There are no valid labels!</div>)
      }
    </>
  )
}