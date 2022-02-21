/* -------------------------------------------------------------------------- */
/*                        Helper Function  - React Tool                       */
/* -------------------------------------------------------------------------- */

import { InputImageList, InputLabel } from ".";
import { LabelingPoint } from "./state/internalState";
import {
  ReactToolBoxAttributes,
  ReactToolImageListItemType,
  TypeConfig,
} from "./state/reactToolState";

export const generateReactToolImages = (
  collectedImageList: InputImageList[],
  typeConfigs: TypeConfig[]
): ReactToolImageListItemType[] => {
  return collectedImageList.map((item) => ({
    ...item,
    labels: generateReactToolLabels(item.labels, typeConfigs),
  }));
};

/**
 *
 * @description
 * Converts the input data into the required format and
 * generate a new labels array.
 */
export const generateReactToolLabels = (
  labels: InputLabel[],
  typeConfigs: TypeConfig[]
) => {
  return labels.map((label) => {
    let strokeColor = "";
    typeConfigs.forEach((item) => {
      if (item.type === label.type) strokeColor = item.color;
    });
    if (strokeColor === "") {
      throw new Error(
        "The label's type is not matching the types you provided..."
      );
    }
    return generateLabelConfig(label, strokeColor);
  });
};

/**
 *
 * @description
 * Converts the input data into the required format and
 * generate a new labels array.
 */
export function generateLabelConfig(
  label: InputLabel,
  stokeColor: string
): ReactToolBoxAttributes {
  return {
    ...label,
    fill: "rgba(255,255,255, 0.2)",
    stroke: stokeColor,
    strokeWidth: 3,
    isVisible: true,
  };
}

/* -------------------------------------------------------------------------- */
/*                       Helper Function - Labeling Box                       */
/* -------------------------------------------------------------------------- */

/**
 *
 * @param {{x:number, y:number}} start The position of the first point
 * @param {{x:number, y:number}} end The position of the second point
 * @returns
 */

export function calculateBoundingBox(start: LabelingPoint, end: LabelingPoint) {
  let width = end.x - start.x;
  let height = end.y - start.y;
  let posX = start.x;
  let posY = start.y;

  if (width < 0) {
    width = Math.abs(width);
    posX -= width;
  }

  if (height < 0) {
    height = Math.abs(height);
    posY -= height;
  }
  return {
    x: posX,
    y: posY,
    width: width,
    height: height,
  };
}

/* -------------------------------------------------------------------------- */
/*                 Helper Function - Prevent Box Out of Image                 */
/* -------------------------------------------------------------------------- */

export function preventBoxOutOfImage(
  currentPosition: LabelingPoint,
  xRange: number[],
  yRange: number[]
) {
  const result = currentPosition;
  if (result.x <= xRange[0]) result.x = xRange[0];
  if (result.x >= xRange[1]) result.x = xRange[1];
  if (result.y <= yRange[0]) result.y = yRange[0];
  if (result.y >= yRange[1]) result.y = yRange[1];
  return result;
}
