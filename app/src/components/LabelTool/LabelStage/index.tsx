import React from "react";
import Konva from "konva";
import useImage from "use-image";
import { Stage, Layer, Image, Rect } from "react-konva";
import { useWindowDimensions } from "../ReactToolHooks/useWindowDimensions";
import { useReactToolsStore } from "../state/reactToolState";
import { useReactToolInternalStore } from "../state/internalState";
import { KonvaEventObject } from "konva/lib/Node";
import ReactToolBox from "../Box";
import IndicatorLine from "../IndicatorLine";
import { calculateBoundingBox, preventBoxOutOfImage } from "../utils";
import { isEqual } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "../../../global/userState";

export default function LabelStage() {
  /* -------------------------------------------------------------------------- */
  /*                                Global State                                */
  /* -------------------------------------------------------------------------- */
  const { userInfo } = useUserStore();

  /* -------------------------------- Image Ref ------------------------------- */
  const imgRef = React.useRef<Konva.Image>(null);

  /* --------------------------- Global Image State --------------------------- */
  const { reactToolImageList, selectedImageId, addReactToolImageLabel } =
    useReactToolsStore();
  const currentImage = React.useMemo(() => {
    const filterImageList = reactToolImageList.filter(
      (item) => item.imageId === selectedImageId
    );
    return filterImageList[0];
  }, [reactToolImageList, selectedImageId]);

  /* -------------------------- Global Internal State ------------------------- */
  const {
    stageAttributes,
    onChangeStageAttributes,
    layerAttributes,
    imageAttributes,
    scaleConfig,
    onChangeSelectedBoxId,
    labelingProcess,
    onChangeLabelingProcess,
    resetLabelingProcess,
  } = useReactToolInternalStore();

  /* -------------------- Layout Configuration of LabelTool ------------------- */
  // Get viewport width and height dynamically
  const { height, width } = useWindowDimensions();
  const [image] = useImage(currentImage ? currentImage.imgSrc : "");

  /* ------------------------------- Wheel Events ------------------------------ */
  const handleStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const oldScale = stageAttributes.scaleX;
    const scaleBy = scaleConfig.wheelStep;
    const maxScale = scaleConfig.maxValue;

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale <= scaleConfig.minValue) newScale = scaleConfig.minValue;
    else if (newScale >= maxScale) newScale = maxScale;
    onChangeStageAttributes({ scaleX: newScale, scaleY: newScale });
  };

  /* ------------------------------- Click Events ------------------------------ */
  const checkDeselect = (
    e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>
  ) => {
    // deselect when clicked on empty area
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target === imgRef.current;
    if (clickedOnEmpty) {
      onChangeSelectedBoxId("");
    }
  };
  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    checkDeselect(e);
    const { isLabeling, startPoint, endPoint } = labelingProcess;
    if (isLabeling && !startPoint && !endPoint) {
      const currentPosition = imgRef.current?.getRelativePointerPosition();
      const xRange = [imageAttributes.x, imageAttributes.width];
      const yRange = [imageAttributes.y, imageAttributes.height];
      const finalPosition = preventBoxOutOfImage(
        currentPosition!,
        xRange,
        yRange
      );
      onChangeLabelingProcess({
        startPoint: finalPosition,
      });
    }
  };
  const handleStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (labelingProcess.endPoint && labelingProcess.startPoint) {
      if (!isEqual(labelingProcess.endPoint, labelingProcess.startPoint)) {
        addReactToolImageLabel(selectedImageId, {
          ...calculateBoundingBox(
            labelingProcess.startPoint,
            labelingProcess.endPoint
          )!,
          fill: "rgba(255,255,255, 0.2)",
          stroke: labelingProcess.labelingColor,
          strokeWidth: 2,
          type: labelingProcess.labelingType,
          subtype: "",
          isVisible: true,
          id: uuidv4(),
          labeledBy: userInfo.nickname!,
        });
        resetLabelingProcess();
      }
    }
  };

  /* ------------------------------- Mouse Move ------------------------------- */
  const handleStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // If it is labeling mode, update indicator cross line
    if (labelingProcess.isLabeling)
      onChangeLabelingProcess({
        indicatorLine: imgRef.current?.getRelativePointerPosition(),
      });

    if (labelingProcess.isLabeling && labelingProcess.startPoint) {
      const currentPosition = imgRef.current?.getRelativePointerPosition();
      const xRange = [imageAttributes.x, imageAttributes.width];
      const yRange = [imageAttributes.y, imageAttributes.height];
      const finalPosition = preventBoxOutOfImage(
        currentPosition!,
        xRange,
        yRange
      );
      onChangeLabelingProcess({
        endPoint: finalPosition,
      });
    }
  };

  /* ------------------------------- Drag Events ------------------------------ */
  const handleStageDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChangeStageAttributes({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <div>
      {currentImage && (
        <Stage
          className="labelStage"
          style={{ cursor: labelingProcess.isLabeling ? "crosshair" : "grab" }}
          width={width - 101 - 400}
          height={height - 64}
          draggable={!labelingProcess.isLabeling}
          {...stageAttributes}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={checkDeselect}
          onDragEnd={handleStageDragEnd}
          onWheel={handleStageWheel}
        >
          <Layer {...layerAttributes}>
            <Image image={image} {...imageAttributes} ref={imgRef} />
            <IndicatorLine />
            {currentImage.labels.length > 0 &&
              currentImage.labels.map((label) => (
                <ReactToolBox key={label.id} boxAttributes={label} />
              ))}
            {labelingProcess.isLabeling &&
              labelingProcess.startPoint &&
              labelingProcess.endPoint && (
                <Rect
                  {...calculateBoundingBox(
                    labelingProcess.startPoint,
                    labelingProcess.endPoint
                  )}
                  fill="rgba(255,255,255, 0.2)"
                  stroke={labelingProcess.labelingColor}
                  strokeWidth={2}
                />
              )}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
