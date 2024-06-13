import { LocationType } from "./../global/explorationState";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";
import { uploadImage } from "../firebase/uploadImage";
import { v4 as uuidv4 } from "uuid";
import { createDBImage } from "./collectedImage";
import { useExplorationStore } from "../global/explorationState";
import { useUserStore } from "../global/userState";
import { useNavigate } from "react-router-dom";
import { deleteAllLocal } from "../utils/localStorage";

const fetchURL = (
  key: string,
  heading: number,
  pitch: number,
  lat: number,
  lon: number,
  zoom: number
) => {
  // return `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${lat},${lon}&fov=90&heading=${heading}&pitch=${pitch}&key=${key}`;
  return `https://maps.googleapis.com/maps/api/streetview?size=640x640&location=${lat},${lon}&fov=${getFov(
    zoom
  )}&heading=${heading}&pitch=${pitch}&key=${key}`;
};

export const fetchGoogleStreetView = (
  key: string,
  heading: number,
  pitch: number,
  lat: number,
  lon: number,
  zoom: number
) => {
  const link = fetchURL(key, heading, pitch, lat, lon, zoom);
  return axios.get(link, {
    responseType: "blob",
  });
};
export function getFov(zoom: number) {
  let result = 90;
  switch (Math.round(zoom)) {
    case 0:
      result = 180;
      break;
    case 1:
      result = 90;
      break;
    case 2:
      result = 45;
      break;
    case 3:
      result = 22.5;
      break;
    case 4:
      result = 11.25;
      break;
    default:
      break;
  }
  return result;
}

export const useFetchGoogleStreetView = (optionFuncs: {
  onSuccess: (imageId: string, imgSrc: string, fileName: string) => void;
  onUpload?: (currentProgress: number) => void;
  onError?: (errorMsg: string) => void;
}) => {
  const { streetViewImageConfig } = useExplorationStore();
  const { userInfo, clearUserInfo } = useUserStore();
  const pov = streetViewImageConfig.imagePov;
  const pano = streetViewImageConfig.panoId;
  const key = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
  const heading = streetViewImageConfig.imagePov.heading;
  const pitch = streetViewImageConfig.imagePov.pitch;
  const lat = streetViewImageConfig.imageLocation.lat;
  const lng = streetViewImageConfig.imageLocation.lng;
  const zoom = streetViewImageConfig.imagePov.zoom;

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useQuery(
    ["fetchGoogleStreetView", key, heading, pitch, lat, lng, zoom],
    async () => {
      try {
        const imageId = uuidv4();
        const res = await createDBImage(
          {
            image_id: imageId,
            location: streetViewImageConfig.imageLocation,
            pov,
            creator: userInfo.nickname!,
            pano,
          },
          { clearUserInfo, navigate, deleteAllLocal }
        );
        if (res.code === 0) {
          enqueueSnackbar(res.message, {
            variant: "success",
          });
          const result = await fetchGoogleStreetView(
            key!,
            heading,
            pitch,
            lat,
            lng,
            zoom
          );
          if (result.status === 200) {
            const imgBlob = result.data;
            uploadImage(imgBlob, imageId, pov, pano, optionFuncs);
          } else {
            enqueueSnackbar("The street view does not exist...", {
              variant: "error",
            });
          }
        }
      } catch (e) {
        const error = e as Error;
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    },
    {
      enabled: false,
    }
  );
};

export function fetchMetadata(key: string, location: LocationType) {
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${location.lat},${location.lng}&key=${key}`
    )
    .then((res) => res.data)
    .catch((e) => new Error(e));
}
