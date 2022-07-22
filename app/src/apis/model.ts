import axios from "axios";

// export const DETECTION_LINK =
//   "https://index-version-two-b7ovn6nbsq-uc.a.run.app/detect";
export const DETECTION_LINK =
  "http://localhost:5000/model/detect";

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
