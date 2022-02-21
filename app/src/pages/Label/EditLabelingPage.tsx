import { useSnackbar } from "notistack";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMultiImageByIds,
  updateHumanLabels,
} from "../../apis/collectedImage";
import { addUserCredit, addUserLabelCredit } from "../../apis/user";
import LabelTool from "../../components/LabelTool";
import { ReactToolImageListItemType } from "../../components/LabelTool/state/reactToolState";
import { useUserStore } from "../../global/userState";
import { CollectedImageInterface } from "../../types/collectedImage";
import { deleteAllLocal } from "../../utils/localStorage";
import { testTypeConfigs } from "./testImageData";
import {
  convertHumanImageToInputImageList,
  convertReactToolImageLabelsToDBImageLabels,
} from "./utils/label";

export default function EditLabelingPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [state, setState] = React.useState<CollectedImageInterface[]>([]);
  const { userInfo, clearUserInfo } = useUserStore();
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    async function loadFunc() {
      try {
        const result = await getMultiImageByIds(
          {
            idList: [params.id!],
          },
          {
            clearUserInfo,
            navigate,
            deleteAllLocal,
          }
        );
        if (result.code === 0) {
          setState(result.data!);
        }
      } catch (e) {
        const error = e as Error;
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    }
    loadFunc();
  }, [clearUserInfo, navigate, enqueueSnackbar, params.id]);

  const onSubmit = async (image: ReactToolImageListItemType) => {
    try {
      const filterImageList = state.filter(
        (item) => item.image_id === image.imageId
      );
      // Extract images data from response data
      const humanLabelList = filterImageList[0].human_labels;
      const currentImagePov = filterImageList[0].pov;

      // Parse data into certain format required by database
      const newHumanLabels = convertReactToolImageLabelsToDBImageLabels(
        image.labels,
        currentImagePov
      );

      // Insert new label list at the head of the array
      humanLabelList.unshift({
        name: userInfo.nickname || "Nobody",
        labels: newHumanLabels,
      });

      // Send back to Database
      const result = await updateHumanLabels(
        {
          imageId: image.imageId,
          data: humanLabelList,
        },
        {
          clearUserInfo,
          navigate,
          deleteAllLocal,
        }
      );
      if (result.code === 0) {
        // * Handle User Credits
        // add create credit
        await addUserCredit({ id: userInfo.id!, type: "modify" });
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
    navigate("/exploration");
  };

  const onSuccessExit = () => {
    navigate("/exploration");
  };

  return (
    <>
      {state && state.length > 0 && (
        <LabelTool
          collectedImageList={convertHumanImageToInputImageList(state)}
          typeConfigs={testTypeConfigs}
          operations={{
            onSubmitImage: onSubmit,
            onFailureExit,
            onSuccessExit,
          }}
          disableDelete={true}
        />
      )}
    </>
  );
}
