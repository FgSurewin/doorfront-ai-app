import { InputImageList, InputLabel } from "../../../components/LabelTool";
import { ReactToolBoxAttributes } from "../../../components/LabelTool/state/reactToolState";
import {
  CollectedImageInterface,
  CollectedLabelInterface,
  PovInterface,
} from "../../../types/collectedImage";
import { calculatePointPov } from "./math";

/* -------------------------------------------------------------------------- */
/*                   Parse database data to label tool data                   */
/* -------------------------------------------------------------------------- */
export function convertInitImageToInputImageList(
  data: CollectedImageInterface[]
): InputImageList[] {
  return data.map((item) => ({
    imageId: item.image_id,
    imgSrc: item.url,
    fileName: item.fileName,
    location: item.location,
    labels: modelLabelsToInputLabels(item.model_labels),
  }));
}

export function convertHumanImageToInputImageList(
  data: CollectedImageInterface[]
): InputImageList[] {
  return data.map((item) => ({
    imageId: item.image_id,
    imgSrc: item.url,
    fileName: item.fileName,
    location: item.location,
    labels: item.human_labels && item.human_labels.length > 0 ? modelLabelsToInputLabels(item.human_labels[0].labels) : [],
  }));
}

export function modelLabelsToInputLabels(
  data: CollectedLabelInterface[]
): InputLabel[] {
  return data.map((item) => modelLabelToInputLabel(item));
}

export function modelLabelToInputLabel(
  data: CollectedLabelInterface
): InputLabel {
  const x = data.box.x;
  const y = data.box.y;
  const width = data.box.width;
  const height = data.box.height;
  return {
    x,
    y,
    width,
    height,
    type: data.label,
    subtype: data.subtype || "",
    id: data.label_id,
    labeledBy: data.labeledBy,
    notes: data.notes
  };
}

/* -------------------------------------------------------------------------- */
/*                   Parser label tool data to database data                  */
/* -------------------------------------------------------------------------- */
export function convertReactToolImageLabelsToDBImageLabels(
  labels: ReactToolBoxAttributes[],
  pov: PovInterface
): CollectedLabelInterface[] {
  return labels.map((label) => reactToolLabelToDBLabel(label, pov));
}

export function reactToolLabelToDBLabel(
  label: ReactToolBoxAttributes,
  pov: PovInterface
): CollectedLabelInterface {
  const targetX = label.x + label.width / 2;
  const targetY = label.y + label.height / 2;
  return {
    label_id: label.id,
    box: { x: label.x, y: label.y, width: label.width, height: label.height },
    label: label.type,
    subtype: label.subtype,
    labeledBy: label.labeledBy,
    markerPov: calculatePointPov(targetX, targetY, pov),
    notes: label.notes
  };
}
