import React from "react";
import Aside from "./Aside";
import { Stack } from "@mui/material";
import {
  OperationFunctions,
  TypeConfig,
  useReactToolsStore,
} from "./state/reactToolState";
import LabelStage from "./LabelStage";
import { generateReactToolImages } from "./utils";
import { useReactToolInternalStore } from "./state/internalState";
import ReactToolHeader from "./ReactToolHeader";
import Joyride, { CallBackProps, EVENTS } from "react-joyride";
import { useTourStore } from "../../global/tourState";

export interface InputLabel {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  id: string;
  subtype: string | undefined;
  labeledBy: string;
}

export interface InputImageList {
  imageId: string;
  imgSrc: string;
  fileName: string;
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
  } = useReactToolsStore();
  const { selectedBoxId, resetLabelingProcess } = useReactToolInternalStore();

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

  const handleReactToolKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "q" || e.key === "Q") {
      resetLabelingProcess();
    } else if (e.key === "d" || e.key === "D") {
      deleteReactToolImageLabel(selectedBoxId);
    }
  };

  return (
    <div
      tabIndex={-1}
      onKeyPress={handleReactToolKeyPress}
      style={{ minWidth: "1440px" }}
      className="LabelingTool"
    >
      <Joyride
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
      />
      <ReactToolHeader />
      <Stack
        id="LabelToolContainer"
        direction="row"
        sx={{ height: "calc(100vh - 64px)" }}
      >
        <Aside />
        {reactToolImageList.length > 0 && <LabelStage />}
      </Stack>
    </div>
  );
}
