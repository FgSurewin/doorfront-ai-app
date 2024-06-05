import type { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import type { LngLatBoundsLike } from "react-map-gl";
import type {SxProps} from "@mui/material"

export type features = {
  name: string;
  progress: number;
  percentage: number;
  total: number;
  geometry: number[][];
  id: string;
};

export type turfFeatureCollection = {
  name: string | number;
  points: FeatureCollection<Point, GeoJsonProperties>;
};

export type neighborhoodGeometry = {
    name:string;
    coordinates: number[][]
}

export type queriedFeatures = {
  properties: {
    name: string;
    percentage: number;
    progress: number;
    total: number;
  };
  geometry: { coordinates: number[][] };
  id: string
};

export const defaultHoverInfo: features = {
  name: "",
  progress: 0,
  percentage: 0,
  total: 0,
  geometry: [[0]],
  id: ""
};

export const defaultMessage: string =
  "Welcome to Doorfront!\nHover over a neighborhood.";

export const llb: LngLatBoundsLike = [
  -73.993432, 40.694029, -73.930974, 40.879119,
];

export const legend = {
  layers: [ "0%", "5%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%" ], 
  colors: [ "#ffffff", "#fcf1cf", "#f6d46f", "#f3c058", "#f2a840", "#f08c28", "#ee6d11", "#ee5b11", "#ee4811", "#ee3611", "#ee1111", "#22fa1e"]
};

export const gridSX:SxProps = {
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  color: "rgb(0, 0, 0)",
  padding: "3px",
  paddingTop: "5px",
  paddingBottom: "5px",
  fontFamily: "monospace",
  fontSize: "13px",
  zIndex: 1,
  position: "absolute",
  margin: "12px",
  borderRadius: "4px",
  opacity: "1",
  bottom: "20px",
  right: "20px",
  display: "inline-block",
};

export const typographySX:SxProps = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  color: "rgb(0, 0, 0)",
  padding: "6px",
  fontFamily: "monospace",
  fontSize: "14px",
  zIndex: 1,
  position: "absolute",
  textAlign:"center",
  left:'39%',
  borderRadius: "4px",
};
