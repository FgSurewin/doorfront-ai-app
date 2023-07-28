import React from "react";
import Aside from "./Aside";
import { Stack, useMediaQuery } from "@mui/material";
import {
  OperationFunctions,
  TypeConfig,
  useReactToolsStore,
} from "./state/reactToolState";
import LabelStage from "./LabelStage";
import {
  calculateBoundingBox,
  generateReactToolImages,
  preventBoxOutOfImage,
} from "./utils";
import { useReactToolInternalStore } from "./state/internalState";
import ReactToolHeader from "./ReactToolHeader";
import Joyride, { CallBackProps, EVENTS } from "react-joyride";
import { useTourStore } from "../../global/tourState";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "../../global/userState";
import { ImageLocation, NotesInterface } from "../../types/collectedImage";

export interface InputLabel {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  id: string;
  subtype: string | undefined;
  labeledBy: string;
  notes?: NotesInterface
}

export interface InputImageList {
  imageId: string;
  imgSrc: string;
  fileName: string;
  location: ImageLocation;
  labels: InputLabel[];
}

export interface ReactLabelToolProps {
  collectedImageList: InputImageList[];
  typeConfigs: TypeConfig[];
  operations?: OperationFunctions;
  disableDelete?: boolean; // Disable delete function
}

export default function LabelTool({
  collectedImageList,
  typeConfigs,
  operations,
  disableDelete = false,
}: ReactLabelToolProps) {
  /* -------------------------------------------------------------------------- */
  /*                        Guild Tour Callback Function                        */
  /* -------------------------------------------------------------------------- */
  const {
    labelingPageTour,
    labelingSteps,
    labelingTourStepIndex,
    updateLabelingTourStepIndex,
    updateLabelingPageTour,
  } = useTourStore();

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { action, index, type } = data;

    // * Handle error situation
    if ([EVENTS.TARGET_NOT_FOUND].includes(type as "error:target_not_found")) {
      updateLabelingPageTour(false);
      updateLabelingTourStepIndex(0);
    }
    // * Handle next situation
    if (action === "next" && type === EVENTS.STEP_AFTER) {
      // console.log("next");
      updateLabelingTourStepIndex(index + 1);
    }
    // * Handle prev situation
    if (action === "prev" && type === EVENTS.STEP_AFTER) {
      // console.log("prev");
      updateLabelingTourStepIndex(index - 1);
    }
    // * Handle over situation (even skip will trigger "over" so I just comment skip situation)
    if (type === "tour:end") {
      // console.log("over");
      updateLabelingPageTour(false);
      updateLabelingTourStepIndex(0);
    }
  };

  /* -------------------------------------------------------------------------- */
  const {
    initReactToolState,
    reactToolImageList,
    initTypeConfigs,
    deleteReactToolImageLabel,
    initOperationFunctions,
    initDisableDelete,
    selectedImageId,
    addReactToolImageLabel,
  } = useReactToolsStore();
  const {
    selectedBoxId,
    onChangeSelectedBoxId,
    onChangeSelectedBoxType,
    resetLabelingProcess,
    imageAttributes,
    notesOpen
  } = useReactToolInternalStore();
  const { userInfo } = useUserStore();

  const _onMount = React.useRef(false);
  React.useEffect(() => {
    if (!_onMount.current) {
      initReactToolState(
        generateReactToolImages(collectedImageList, typeConfigs)
      );
      initTypeConfigs(typeConfigs);
      operations && initOperationFunctions(operations);
      disableDelete && initDisableDelete(disableDelete);
      _onMount.current = true;
    }
  }, [
    collectedImageList,
    typeConfigs,
    initReactToolState,
    initTypeConfigs,
    initOperationFunctions,
    operations,
    disableDelete,
    initDisableDelete,
  ]);

  const handleCopyBox = () => {
    if (selectedImageId !== "" && selectedBoxId !== "") {
      /* ---------------------------- Get current image --------------------------- */
      const currentImage = reactToolImageList.filter(
        (item) => item.imageId === selectedImageId
      )[0];
      /* ----------------------------- Get current box ---------------------------- */
      const currentBox = currentImage.labels.filter(
        (item) => item.id === selectedBoxId
      )[0];
      /* ------------------------- Duplicate selected box ------------------------- */
      const startPoint = { x: currentBox.x + 5, y: currentBox.y + 5 };
      const _endPoint = {
        x: currentBox.x + currentBox.width + 5,
        y: currentBox.y + currentBox.height + 5,
      };
      /* ---------------------- Prevent the box out of image ---------------------- */
      const xRange = [imageAttributes.x, imageAttributes.width];
      const yRange = [imageAttributes.y, imageAttributes.height];
      const endPoint = preventBoxOutOfImage(_endPoint, xRange, yRange);
      /* ----------------------------- Create new box ----------------------------- */
      const newBoxId = uuidv4();
      addReactToolImageLabel(selectedImageId, {
        ...calculateBoundingBox(startPoint, endPoint)!,
        fill: "rgba(255,255,255, 0.2)",
        stroke: currentBox.stroke,
        strokeWidth: 2,
        type: currentBox.type,
        subtype: currentBox.subtype,
        isVisible: true,
        id: newBoxId,
        labeledBy: userInfo.nickname!,
        notes: currentBox.notes
      });
      onChangeSelectedBoxId(newBoxId);
      onChangeSelectedBoxType(currentBox.type)
    }
  };

  const handleReactToolKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!notesOpen) {
    if (e.key === "q" || e.key === "Q") {
      resetLabelingProcess();
    } else if (e.key === "d" || e.key === "D") {
      if (selectedBoxId !== "") deleteReactToolImageLabel(selectedBoxId);
    } else if (e.key === "c" || e.key === "C") {
      handleCopyBox();
    }
  }
  };

  const isChangingDirection = useMediaQuery("(max-width: 1200px)");


  return (
    <div
      tabIndex={-1}
      onKeyPress={handleReactToolKeyPress}
      className="LabelingTool"
    >
      {/* <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        run={labelingPageTour}
        scrollToFirstStep={true}
        showProgress={true}
        steps={labelingSteps}
        stepIndex={labelingTourStepIndex}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      /> */}
      <ReactToolHeader />
      <Stack
        id="LabelToolContainer"
        direction={isChangingDirection ? "column-reverse" : "row"}
      >
      <Aside />
       
      {reactToolImageList.length > 0 && <LabelStage />}
      
      </Stack>
    </div>
  );
}
