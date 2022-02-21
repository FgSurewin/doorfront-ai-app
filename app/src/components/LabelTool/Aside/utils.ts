/* -------------------------------------------------------------------------- */
/*                        Helper Function - Label Panel                       */
/* -------------------------------------------------------------------------- */

import { ReactToolImageListItemType } from "../state/reactToolState";

/**
 *
 * @param currentScale
 * @param step
 * @param minValue
 * @param maxValue
 * @param action
 * @returns
 */
export const helpResizeImage = (
  currentScale: number,
  step: number,
  minValue: number,
  maxValue: number,
  action: "plus" | "minus"
): number => {
  let result = currentScale;
  if (action === "plus") {
    result = Math.min(currentScale + step, maxValue);
  } else if (action === "minus") {
    result = Math.max(currentScale - step, minValue);
  }
  return result;
};
/**
 *
 * @param currentImageId
 * @param imageList
 * @param action
 * @returns
 */
export const helpSwitchImage = (
  currentImageId: string,
  imageList: ReactToolImageListItemType[],
  action: "next" | "back"
): string => {
  const currentIndex = imageList.findIndex(
    (item) => item.imageId === currentImageId
  );
  let result = currentImageId;
  if (action === "back") {
    const newIndex =
      (currentIndex - 1) % imageList.length < 0
        ? imageList.length - 1
        : (currentIndex - 1) % imageList.length;
    result = imageList[newIndex].imageId;
  } else if (action === "next") {
    result = imageList[(currentIndex + 1) % imageList.length].imageId;
  }

  return result;
};
