import axios from "axios";

const MODE = process.env.NODE_ENV;
export const DETECTION_LINK =
  MODE === "development"
    ? "http://localhost:5000/model/detect"
    : "https://doorfront-model-server-zo7id6rtfa-uc.a.run.app//model/detect";

// export const DETECTION_LINK =
//   "https://model-server-v1-paw2roelga-uc.a.run.app/model/detect";

export interface ModelDetectionLabel {
  bbox: number[];
  score: number;
  type: string;
}

export type ModelDetectionResponseType = ModelDetectionLabel[];

export const fetchDetectedLabels = (data: { nms: number; url: string }) => {
  const form_data = new FormData();
  form_data.append("nms", JSON.stringify(data.nms));
  form_data.append("url", data.url);
  return axios
    .post<ModelDetectionResponseType>(DETECTION_LINK, form_data, {
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      withCredentials: false,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
};
