import React from "react";
import Konva from "konva";

import { Rect, Transformer } from "react-konva";
import {
  ReactToolBoxAttributes,
  useReactToolsStore,
} from "../state/reactToolState";
import { useReactToolInternalStore } from "../state/internalState";
import { KonvaEventObject } from "konva/lib/Node";
import { preventBoxOutOfImage } from "../utils";
import { useUserStore } from "../../../global/userState";

export interface ReactToolBoxProps {
  boxAttributes: ReactToolBoxAttributes;
}

export default function ReactToolBox({ boxAttributes }: ReactToolBoxProps) {
  /* -------------------------------------------------------------------------- */
  /*                                Global State                                */
  /* -------------------------------------------------------------------------- */
  const { userInfo } = useUserStore();

  /* ----------------------------- Internal State ----------------------------- */
  const {
    selectedBoxId,
    onChangeSelectedBoxId,
    labelingProcess,
    imageAttributes,
  } = useReactToolInternalStore();
  const { changeReactToolImageLabels } = useReactToolsStore();
  const { id, x, y, fill, stroke, width, height, strokeWidth, isVisible } =
    boxAttributes;
  // Set refs
  const rectRef = React.useRef<Konva.Rect>(null);
  const trRef = React.useRef<Konva.Transformer>(null);
  React.useEffect(() => {
    if (selectedBoxId === id && trRef.current && rectRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()!.batchDraw();
      rectRef.current.moveToTop();
      trRef.current.moveToTop();
      if (isVisible) {
        rectRef.current.show();
        trRef.current.show();
      } else {
        rectRef.current.hide();
        trRef.current.hide();
      }
    }
  }, [selectedBoxId, id, isVisible]);

  /* ------------------------------- Click Event ------------------------------ */
  const handleSelectClick = (e: KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    onChangeSelectedBoxId(id);
  };

  /* ------------------------------- Drag Event ------------------------------- */
  const handleRectDragStart = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    onChangeSelectedBoxId(id);
  };
  const handleRectDragMove = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const currentPosition = { x: e.target.x(), y: e.target.y() };
    const xRange = [imageAttributes.x, imageAttributes.width - width];
    const yRange = [imageAttributes.y, imageAttributes.height - height];
    const finalPosition = preventBoxOutOfImage(currentPosition, xRange, yRange);
    rectRef.current!.x(finalPosition.x);
    rectRef.current!.y(finalPosition.y);
  };
  const handleRectDragEnd = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    changeReactToolImageLabels(id, {
      x: e.target.x(),
      y: e.target.y(),
      labeledBy: userInfo.nickname!,
    });
  };

  /* ----------------------------- Transform Event ---------------------------- */
  const handleRectTransformEnd = (e: KonvaEventObject<Event>) => {
    e.cancelBubble = true;
    const node = rectRef.current;
    if (node) {
      const newScaleX = node.scaleX();
      const newScaleY = node.scaleY();
      // we will reset it back
      node.scaleX(1);
      node.scaleY(1);
      changeReactToolImageLabels(id, {
        x: node.x(),
        y: node.y(),
        width: node.width() * newScaleX,
        height: node.height() * newScaleY,
        labeledBy: userInfo.nickname!,
      });
    }
  };

  /* -------------------------- Mouse Enter and Leave ------------------------- */
  const handleRectMouseEnter = (e: KonvaEventObject<MouseEvent>) => {
    if (!labelingProcess.isLabeling) {
      const container = e.target.getStage()?.container();
      if (container) container.style.cursor = "pointer";
    }
  };
  const handleRectMouseLeave = (e: KonvaEventObject<MouseEvent>) => {
    if (!labelingProcess.isLabeling) {
      const container = e.target.getStage()?.container();
      if (container) container.style.cursor = "grab";
    }
  };

  /* -------------------------------------------------------------------------- */

  return (
    <React.Fragment>
      {
        <Rect
          // onSelect is used to select current target
          ref={rectRef}
          draggable={!labelingProcess.isLabeling}
          x={x}
          y={y}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill={fill}
          onClick={handleSelectClick}
          onTap={handleSelectClick}
          onDragStart={handleRectDragStart}
          onDragMove={handleRectDragMove}
          onDragEnd={handleRectDragEnd}
          onTransformEnd={handleRectTransformEnd}
          onMouseEnter={handleRectMouseEnter}
          onMouseLeave={handleRectMouseLeave}
          style={{ cursor: "pointer" }}
        />
      }
      {selectedBoxId === id && (
        <Transformer
          ref={trRef}
          draggable
          rotateEnabled={false}
          onDragEnd={(e) => {
            e.cancelBubble = true;
          }}
        />
      )}
    </React.Fragment>
  );
}
