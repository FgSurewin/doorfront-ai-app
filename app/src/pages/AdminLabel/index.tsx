import { useSnackbar } from "notistack";
import React from "react";
import {
  deleteDBImage,
  getMultiImageByIds,
  updateNewHumanLabels,
} from "../../apis/collectedImage";
import LabelTool from "../../components/LabelTool";
import { ReactToolImageListItemType } from "../../components/LabelTool/state/reactToolState";
import { useUserStore } from "../../global/userState";
import { deleteAllLocal } from "../../utils/localStorage";
import { testTypeConfigs } from "./testImageData";
import {
  convertInitImageToInputImageList,
  convertReactToolImageLabelsToDBImageLabels,
} from "./utils/label";
import { useNavigate, useParams } from "react-router-dom";
import { deleteImage } from "../../firebase/uploadImage";
import { CollectedImageInterface } from "../../types/collectedImage";
import {
  addUserCredit,
  addUserLabelCredit,
  deleteImageFromList,
  saveImageToDiffList,
} from "../../apis/user";

export default function LabelPage() {
  const [Images, setImages] = React.useState<CollectedImageInterface[]>([]);
  const { userInfo, clearUserInfo } = useUserStore();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { imageId } = useParams(); // ✅ get single imageId from URL
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  React.useEffect(() => {
    async function loadFunc() {
      try {
        if (!imageId) {
          enqueueSnackbar("No image ID provided", { variant: "error" });
          navigate("/adminPage");
          return;
        }

        const result = await getMultiImageByIds(
          { idList: [imageId] },
          {
            clearUserInfo,
            navigate,
            deleteAllLocal,
          }
        );

        if (result.code === 0 && result.data && result.data.length > 0) {
          setImages(result.data);
        }
        else {
        enqueueSnackbar("Image not found or empty data.", { variant: "warning" });
        navigate("/adminPage");
      }
      } catch (e) {
        enqueueSnackbar((e as Error).message, { variant: "error" });
      }
    }

    loadFunc();
  }, [imageId, clearUserInfo, navigate, enqueueSnackbar]);

  const onSubmit = async (image: ReactToolImageListItemType) => {
    try {
      const target = Images.find((item) => item.image_id === image.imageId);
      if (!target) throw new Error("Image not found.");

      const newHumanLabels = convertReactToolImageLabelsToDBImageLabels(
        image.labels,
        target.pov
      );

      newHumanLabels.forEach((item) => {
        item.labeledBy = userInfo.nickname!;
      });

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
        await deleteImageFromList({
          id: userInfo.id!,
          data: {
            imageId: image.imageId,
            fileName: image.fileName,
            imgSrc: image.imgSrc,
          },
          category: "unLabel_images",
        });

        await saveImageToDiffList({
          id: userInfo.id!,
          data: {
            imageId: image.imageId,
            fileName: image.fileName,
            imgSrc: image.imgSrc,
          },
          category: "label_images",
        });

        await addUserCredit({ id: userInfo.id!, type: "create" });
        await addUserLabelCredit({
          id: userInfo.id!,
          labelNum: newHumanLabels.length,
        });

        enqueueSnackbar("Save successfully", { variant: "success" });
      }
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    }
  };

  const onFailureExit = () => {
    if (!hasUnsavedChanges) {
      navigate("/adminPage");
    } else if (window.confirm("You have unsaved changes. Exit without saving?")) {
      navigate("/adminPage");
    } else {
      enqueueSnackbar("Please save your changes before exiting.", {
        variant: "info",
      });
    }
  };

  const onSuccessExit = () => navigate("/adminPage");

  const onDeleteImage = async (image: ReactToolImageListItemType) => {
    try {
      await deleteDBImage(
        { imageId: image.imageId },
        { clearUserInfo, navigate, deleteAllLocal }
      );

      await deleteImageFromList({
        id: userInfo.id!,
        data: {
          imageId: image.imageId,
          fileName: image.fileName,
          imgSrc: image.imgSrc,
        },
        category: "unLabel_images",
      });

      await deleteImage(image.fileName);

      enqueueSnackbar("Delete image successfully", { variant: "warning" });
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    }
  };

  return (
    <>
      {Images.length > 0 && (
        <LabelTool
          collectedImageList={convertInitImageToInputImageList(Images)}
          typeConfigs={testTypeConfigs}
          operations={{
            onSubmitImage: onSubmit,
            onFailureExit,
            onSuccessExit,
            onDeleteImage,
          }}
        />
      )}
    </>
  );
}
