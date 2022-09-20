import React from "react";
import StreetViewMarker from "./StreetViewMarker";
import { StreetViewMarkerType } from "../utils/panoMarker";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useExplorationStore } from "../../../global/explorationState";
import { useTourStore } from "../../../global/tourState";
import { useReactToolInternalStore } from "../../LabelTool/state/internalState";

export interface StreetViewMarkerListProps {
  streetViewContainer: HTMLElement;
  streetViewInstance: google.maps.StreetViewPanorama;
  panoramaMarkerList: StreetViewMarkerType[];
  markerClickFunc?: () => void;
}

// export interface InnerPanoramaMarkerType extends StreetViewMarkerType {
//   isShow: boolean;
// }

export default function StreetViewMarkerList({
  panoramaMarkerList,
  streetViewInstance,
  streetViewContainer,
}: StreetViewMarkerListProps) {
  const { updatePanoramaMarkerList, updateCurrentSelectedImage, updateCurrentSelectedImageTitle } =
    useExplorationStore();
  
  const {onChangeSelectedBoxId} = useReactToolInternalStore()

  const {
    sampleMarkerId,
    updateExplorationTourStepIndex,
    explorationTour,
    explorationTourStepIndex,
  } = useTourStore();
  return (
    <>
      {panoramaMarkerList.map((item) => (
        <StreetViewMarker
          key={item.label_id}
          id={item.label_id}
          googleMaps={google.maps}
          pano={streetViewInstance}
          position={item.pov}
          title={item.title}
          anchor={new google.maps.Point(item.point[0], item.point[1])}
          size={new google.maps.Size(20, 20)}
          container={streetViewContainer}
          // clickFunc={markerClickFunc}
        >
          <div
            className={item.label_id}
            style={{
              backgroundColor: getColor(item.title),
              width: "20px",
              height: "20px",
              borderRadius: "50%",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              updatePanoramaMarkerList(
                panoramaMarkerList.map((marker) => {
                  if (marker.label_id === item.label_id) marker.isShow = true;
                  else marker.isShow = false;
                  return marker;
                })
              );
              updateCurrentSelectedImage(item.image_id);
              updateCurrentSelectedImageTitle(item.title)
              onChangeSelectedBoxId(item.label_id)
              if (
                item.label_id === sampleMarkerId &&
                explorationTour &&
                explorationTourStepIndex === 3
              ) {
                updateExplorationTourStepIndex(4);
              }
            }}
          >
            {item.isShow && (
              <MarkerContent
                marker={item}
                onClose={() => {
                  updatePanoramaMarkerList(
                    panoramaMarkerList.map((marker) => {
                      if (marker.label_id === item.label_id)
                        marker.isShow = false;
                      return marker;
                    })
                  );
                  updateCurrentSelectedImage("");
                  updateCurrentSelectedImageTitle("");
                  onChangeSelectedBoxId("")
                }}
              />
            )}
          </div>
        </StreetViewMarker>
      ))}
    </>
  );
}

function MarkerContent({
  marker,
  onClose,
}: {
  marker: StreetViewMarkerType;
  onClose: () => void;
}) {
  const { sampleMarkerId } = useTourStore();
  return (
    <Card
      sx={{
        width: "200px",
        zIndex: 10000000000000000000,
        transform: "translate(30px, -100%)",
        position: "relative",
      }}
      id={`${sampleMarkerId}-streetViewMarkerCard`}
      className={`${sampleMarkerId}-streetViewMarkerCard`}
    >
      <CardMedia
        component="img"
        height="140px"
        image={marker.imgSrc}
        alt={marker.image_id}
        className={`${sampleMarkerId}-CardMedia`}
      />
      <div
        style={{
          position: "absolute",
          left: (200 * marker.box.x) / 640,
          top: (140 * marker.box.y) / 640,
          width: `${(200 * marker.box.width) / 640}px`,
          height: `${(140 * marker.box.height) / 640}px`,
          border: `2px solid ${getColor(marker.title)}`,
        }}
      />
      <CardContent className={`${sampleMarkerId}-CardContent`}>
        <Typography
          gutterBottom
          variant="h5"
          sx={{ textTransform: "uppercase" }}
        >
          {marker.title}
        </Typography>
        <Typography variant="subtitle1">
          Image:{" "}
          <span style={{ fontWeight: "bold" }}>{`image-H_${Math.floor(
            marker.imagePov.heading
          )}_P_${Math.floor(marker.imagePov.pitch)}`}</span>
        </Typography>
        <Typography variant="subtitle1">
          Subtype: {marker.subtype ? marker.subtype : "Undefined"}
        </Typography>
        <Typography variant="subtitle1">
          Labeled By: {marker.nickname}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          className={`${sampleMarkerId}-CardActions`}
          size="small"
          variant="contained"
          sx={{
            color: "white",
            bgcolor: "red",
            "&:hover": { bgcolor: "darkred" },
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          Close
        </Button>
      </CardActions>
    </Card>
  );
}

function getColor(type: string): string {
  let result = "";
  switch (type) {
    case "door":
      result = "#F97F51";
      break;
    case "knob":
      result = "#9AECDB";
      break;
    case "ramp":
      result = "#EAB543";
      break;
    case "stairs":
      result = "#D6A2E8";
      break;
    default:
      break;
  }
  return result;
}
