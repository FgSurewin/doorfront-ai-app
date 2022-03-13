import { baseRequest } from ".";
import { CollectedImageInterface, HumanLabels } from "../types/collectedImage";
import {
  CollectedImageApiReturnType,
  CreateImageData,
  HandleFailedTokenFuncs,
  UpdateImageData,
} from "../utils/api";

export function generateNewImage(
  data: CreateImageData
): CollectedImageInterface {
  return {
    ...data,
    isLabeled: false,
    human_labels: [],
    model_labels: [],
    // panoMarkers: [],
    image_size: [640, 640],
    fileName: "",
    url: "",
  };
}

/* -------------------------------------------------------------------------- */
/*                   Exploration - Upload Street View Image                   */
/* -------------------------------------------------------------------------- */
export const createDBImage = (
  data: CreateImageData,
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<CollectedImageInterface>>({
      method: "POST",
      url: `/collectImage/createImage`,
      data: generateNewImage(data),
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });

export const updateDBImage = (
  data: { imageId: string; data: UpdateImageData },
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<any>>({
      method: "POST",
      url: `/collectImage/updateImage`,
      data,
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*               Exploration Page & Labeling Page - Delete Image              */
/* -------------------------------------------------------------------------- */
export const deleteDBImage = (
  data: { imageId: string },
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<any>>({
      method: "DELETE",
      url: `/collectImage/deleteImage`,
      data,
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                 Exploration Page - Fetch Images By Pano ID                 */
/* -------------------------------------------------------------------------- */
export const fetchStreetViewImagesByPano = (
  data: { panoId: string },
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<CollectedImageInterface[]>>({
      method: "POST",
      url: `/collectImage/getMultiImageByPano`,
      data,
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                         Labeling Page - Get Images                         */
/* -------------------------------------------------------------------------- */
export const getMultiImageByIds = (
  data: { idList: string[] },
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<CollectedImageInterface[]>>({
      method: "POST",
      url: `/collectImage/getMultiImageByIds`,
      data,
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                       Labeling Page - Get User Labels                      */
/* -------------------------------------------------------------------------- */
/* ------------------------------ Old Function ------------------------------ */
// export const updateHumanLabels = (
//   data: {
//     imageId: string;
//     data: HumanLabels[];
//   },
//   handleFailedTokenFuncs?: HandleFailedTokenFuncs
// ) =>
//   baseRequest
//     .request<CollectedImageApiReturnType<any>>({
//       method: "POST",
//       url: `/collectImage/addHumanLabels`,
//       data,
//     })
//     .then((res) => {
//       if (res.data.code === 2000) {
//         if (handleFailedTokenFuncs) {
//           handleFailedTokenFuncs.navigate("/login");
//           handleFailedTokenFuncs.deleteAllLocal();
//           handleFailedTokenFuncs.clearUserInfo();
//         }
//         return Promise.reject(new Error(res.data.message));
//       }
//       return res.data;
//     })
//     .catch((res) => {
//       throw new Error(res);
//     });
/* -------------------------------------------------------------------------- */
/* ------------------------------ New Function ------------------------------ */
export const updateNewHumanLabels = (
  data: {
    imageId: string;
    data: HumanLabels;
  },
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<any>>({
      method: "POST",
      url: `/collectImage/addNewHumanLabels`,
      data,
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                     Exploration Page - Fetch All Images                    */
/* -------------------------------------------------------------------------- */
export const fetchAllImages = (
  handleFailedTokenFuncs?: HandleFailedTokenFuncs
) =>
  baseRequest
    .request<CollectedImageApiReturnType<CollectedImageInterface[]>>({
      method: "GET",
      url: `/collectImage/getAllImages`,
    })
    .then((res) => {
      if (res.data.code === 2000) {
        if (handleFailedTokenFuncs) {
          handleFailedTokenFuncs.navigate("/login");
          handleFailedTokenFuncs.deleteAllLocal();
          handleFailedTokenFuncs.clearUserInfo();
        }
        return Promise.reject(new Error(res.data.message));
      }
      return res.data;
    })
    .catch((res) => {
      throw new Error(res);
    });
