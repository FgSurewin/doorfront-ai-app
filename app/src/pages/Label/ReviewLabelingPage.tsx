import React from "react";
import LabelTool from "../../components/LabelTool";
import { testTypeConfigs } from "./testImageData";
import { CollectedImageInterface } from "../../types/collectedImage";
import {
  convertHumanImageToInputImageList,
  convertReactToolImageLabelsToDBImageLabels,
} from "./utils/label";
import { ReactToolImageListItemType } from "../../components/LabelTool/state/reactToolState";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  fetchUnapprovedLabels,
  updateNewHumanLabels,
} from "../../apis/collectedImage";
import { useUserStore } from "../../global/userState";
import { useExplorationStore } from "../../global/explorationState";
import {
  addUserCredit,
  addUserLabelCredit,
  saveImageToDiffList,
} from "../../apis/user";
import { deleteAllLocal } from "../../utils/localStorage";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

interface LocationStateProps {
  area: number;
}

interface ApiPagination {
  skip: number;
  limit: number;
  hasMore: boolean;
  totalChecked?: number;
  returned?: number;
}

export default function ReviewLabelingPage() {
  const navigate = useNavigate();
  const { userInfo, clearUserInfo } = useUserStore();
  const { maxModifier } = useExplorationStore();
  const { enqueueSnackbar } = useSnackbar();
  const [Images, setImages] = React.useState<CollectedImageInterface[]>([]);
  const [imagesRetrieved, setImagesRetrieved] = React.useState(false);

  const location = useLocation();
  const state = location.state as LocationStateProps;

  const [pagination, setPagination] = React.useState<{
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  }>({
    total: 0,
    limit: 50,
    skip: 0,
    hasMore: false,
  });

  React.useEffect(() => {
    if (!userInfo.nickname) return;
    async function loadFunc() {
      if (!userInfo.nickname) {
        enqueueSnackbar("Missing user nickname", { variant: "error" });
        console.error("No nickname found on userInfo:", userInfo);
        setImagesRetrieved(true);
        return;
      }

      try {
        const result = await fetchUnapprovedLabels(
          { nickname: userInfo.nickname, limit: 100, skip: 0 },
          { clearUserInfo, navigate, deleteAllLocal }
        );

        if (result && result.data) {
          const images = result.data as CollectedImageInterface[];
          const convertedImages = convertHumanImageToInputImageList(images);
          const paginationFromApi = result.pagination as
            | ApiPagination
            | undefined;
          setImages(images);
          setPagination({
            total: paginationFromApi?.totalChecked ?? 0,
            limit: paginationFromApi?.limit ?? 50,
            skip: paginationFromApi?.skip ?? 0,
            hasMore: paginationFromApi?.hasMore ?? false,
          });
        } else {
          console.warn("Unexpected fetch result structure", result);
          setImages([]);
          setPagination({ total: 0, limit: 50, skip: 0, hasMore: false });
        }
      } catch (error) {
        console.error("Error fetching unapproved labels:", error);
        enqueueSnackbar("Failed to load images", { variant: "error" });
      } finally {
        setImagesRetrieved(true);
      }
    }

    loadFunc();
  }, [
    userInfo.nickname, // <-- triggers only when nickname becomes available
    enqueueSnackbar,
    userInfo.nickname,
    // Consider removing maxModifier if not needed here
    navigate,
    clearUserInfo,
    deleteAllLocal,
  ]);

  const onSubmit = async (image: ReactToolImageListItemType) => {
    try {
      const filterImageList = Images.filter(
        (item) => item.image_id === image.imageId
      );
      if (!filterImageList.length) {
        enqueueSnackbar("Image not found", { variant: "error" });
        return;
      }
      const currentImagePov = filterImageList[0].pov;

      const newHumanLabels = convertReactToolImageLabelsToDBImageLabels(
        image.labels,
        currentImagePov
      );

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
        await saveImageToDiffList({
          category: "review_images",
          id: userInfo.id!,
          data: {
            imageId: image.imageId,
            fileName: image.fileName,
            imgSrc: image.imgSrc,
          },
        });
        await addUserCredit({ id: userInfo.id!, type: "review" });
        await addUserLabelCredit({
          id: userInfo.id!,
          labelNum: newHumanLabels.filter(
            (item) => item.labeledBy === userInfo.nickname!
          ).length,
        });

        enqueueSnackbar("Save successfully", { variant: "success" });
      }
    } catch (e) {
      const error = e as Error;
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const onFailureExit = () => {
    navigate("/");
  };

  const onSuccessExit = () => {
    navigate("/");
  };

  // You need to ensure InputImageList is imported or declared
  const convertedImages = convertHumanImageToInputImageList(Images);
  return (
    <>
      {!imagesRetrieved ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress size="3rem" />
        </Box>
      ) : Images && Images.length > 0 ? (
        <LabelTool
          collectedImageList={convertedImages}
          typeConfigs={testTypeConfigs}
          operations={{
            onSubmitImage: onSubmit,
            onFailureExit,
            onSuccessExit,
          }}
          disableDelete={true}
        />
      ) : (
        <div>There are no valid labels!</div>
      )}
    </>
  );
}
