import { baseRequest } from ".";

export interface LocationReturnData {
  code: number;
  message: string;
  data: { lat: number; lng: number };
}

export const getRandomLocationFromDB = () =>
  baseRequest
    .request<LocationReturnData>({
      method: "GET",
      url: `/location/getRandomLocation`,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
