import React from "react";
import {
  Button,
  ButtonGroup,
  Paper,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  NextButtonStyle,
  QueryButtonStyle,
  LabelButtonStyle,
} from "./ActionPanel.style";
import ImageListItem, { ImageListItemType } from "./ImageListItem";
import { useQueryImagesStore } from "../../global/queryImagesState";
import { useFetchGoogleStreetView } from "../../apis/queryStreetView";
import { useSnackbar } from "notistack";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { updateDBImage } from "../../apis/collectedImage";
import { useUserStore } from "../../global/userState";
import { deleteAllLocal } from "../../utils/localStorage";
import { useExplorationStore } from "../../global/explorationState";
import { saveImageToDiffList } from "../../apis/user";
import { fetchDetectedLabels } from "../../apis/model";
import { UpdateImageData } from "../../utils/api";
import { v4 as uuidv4 } from "uuid";

export default function ActionPanel({ onNext }: { onNext: () => void }) {
  /* ------------------------------ Notification ------------------------------ */
  const { enqueueSnackbar } = useSnackbar();

  //TODO add global state management... (redux .etc)
  const { queryImageList, addQueryImage, isUploading, setIsUploading } =
    useQueryImagesStore();
  const { collectedImageList, maxModifier } = useExplorationStore();
  const { userInfo } = useUserStore();

  /* ------------------------------ React router ------------------------------ */
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                     Query image and upload to firebase                     */
  /* -------------------------------------------------------------------------- */
  // const [uploadProgress, setUploadProgress] = React.useState(0);
  const { clearUserInfo } = useUserStore();
  const { refetch } = useFetchGoogleStreetView({
    onSuccess: async (imageId, imgSrc, fileName) => {
      try {
        const modelLabels = await fetchDetectedLabels({
          nms: 0.2,
          url: imgSrc,
        });
        const updateImageData: { imageId: string; data: UpdateImageData } = {
          imageId,
          data: {
            fileName,
            url: imgSrc,
            model_labels: modelLabels
              .filter((item) => item.score >= 0.3)
              .map((item) => ({
                label_id: uuidv4(),
                box: {
                  x: item.bbox[0],
                  y: item.bbox[1],
                  width: item.bbox[2] - item.bbox[0],
                  height: item.bbox[3] - item.bbox[1],
                },
                label: item.type,
                labeledBy: "model",
              })),
          },
        };
        const result = await updateDBImage(updateImageData, {
          clearUserInfo,
          navigate,
          deleteAllLocal,
        });
        if (result.code === 0) {
          addQueryImage({ imageId, imgSrc, fileName });
          //TODO Add UnLabelImage property
          await saveImageToDiffList({
            id: userInfo.id!,
            data: { imageId, imgSrc, fileName },
            category: "unLabel_images",
          });
          enqueueSnackbar(result.message, {
            variant: "success",
          });
          setIsUploading(false);
          // setUploadProgress(0);
        }
      } catch (e) {
        const error = e as Error;
        console.log(e);
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
  /*                              Handle User Score                             */
  /* -------------------------------------------------------------------------- */
  const { collectedImgNum, updateCollectedImgNum } = useUserStore();

  /* -------------------------------------------------------------------------- */
  /*                               Computed Values                              */
  /* -------------------------------------------------------------------------- */

  // * A computed value to determine whether to enable the label button
  const enableLabelButton = React.useMemo(
    () => queryImageList.length > 0 && !isUploading,
    [queryImageList, isUploading]
  );
  // * A computed value to determine whether to disable the query button
  const disableQueryButton = React.useMemo(
    () => queryImageList.length >= 10,
    [queryImageList]
  );

  const databaseImageList = React.useMemo(() => {
    const imageList: ImageListItemType[] = [];
    collectedImageList.forEach((image) => {
      if (image.human_labels.length > 0) {
        // Check if current user has been modify or validate current image
        const names = image.human_labels.map((item) => item.name);
        const isDisable =
          names.includes(userInfo.nickname!) ||
          image.human_labels.length >= maxModifier ||
          image.image_id === "GuildTourSample";
        const imageName = `image-H_${Math.floor(
          image.pov.heading
        )}_P_${Math.floor(image.pov.pitch)}`;
        const imageId = image.image_id;
        imageList.push({
          disable: isDisable,
          name: imageName,
          imageId,
          human_labels: image.human_labels,
          fileName: image.fileName,
          imgSrc: image.url,
        });
      }
    });
    return imageList;
  }, [collectedImageList, userInfo.nickname, maxModifier]);
  /* -------------------------------------------------------------------------- */

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      sx={{ height: "455px" }}
    >
      <Paper sx={{ borderRadius: 4 }}>
        <ImageListItem imageList={databaseImageList} />
      </Paper>
      <Box component="div">
        {isUploading && (
          <CircularProgress sx={{ m: "0 auto", display: "block", mb: 2 }} />
        )}
        <ButtonGroup
          fullWidth
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="contained"
        >
          <Button
            className="queryButton"
            disabled={disableQueryButton || isUploading}
            sx={QueryButtonStyle}
            onClick={async () => {
              setIsUploading(true);
              await refetch();
              updateCollectedImgNum(collectedImgNum + 1);
            }}
          >
            {isUploading
              ? "AI is Labeling"
              : "Capture current image & AI Labeling"}
          </Button>
          <Button
            className="labelButton"
            component={RouterLink}
            to="/label"
            disabled={!enableLabelButton}
            sx={LabelButtonStyle}
          >
            {isUploading ? "AI is Labeling" : "Edit & Confirm AI Labels"}
          </Button>
          <Button
            className="nextButton"
            sx={NextButtonStyle}
            onClick={async () => {
              await onNext();
            }}
          >
            Change Street View Location
          </Button>
        </ButtonGroup>
      </Box>
    </Stack>
  );
}
