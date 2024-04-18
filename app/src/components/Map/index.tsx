import * as React from "react";
import Map, { Source, Layer, MapLayerMouseEvent } from "react-map-gl";
import { Box, Container, Grid, Typography } from "@mui/material";
import Item from "@mui/material/Grid";
import CircleIcon from "@mui/icons-material/Circle";
import type { Feature, GeoJsonProperties, Point, Geometry } from "geojson";
import * as turf from "@turf/turf";
import nearestPoint from "@turf/nearest-point";
import { useExplorationStore } from "../../global/explorationState";
import { useNavigate } from "react-router-dom";
import { LayerProps } from "react-map-gl";
import {
  features,
  turfFeatureCollection,
  queriedFeatures,
  defaultHoverInfo,
  defaultMessage,
  llb,
  legend,
  typographySX,
  gridSX,
} from "./data";
import neighborhoods from "./neighborhoods";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";


// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function MapboxMap() {
  return (
    <div>
      <Container maxWidth="xl" sx={{ pt: 4, pb: 4 }}>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "text.primary", mb: 2 }}
        >
          {" "}
          Hover over the map to display the percentage of doors marked in a
          neighborhood
          <br />
          Click within Manhattan to navigate to that location on the Explore
          page!
        </Typography>
        <Container
          maxWidth="xl"
          sx={{ backgroundColor: "#333D58", position: { md: "relative" } }}
        >
          <Box
            sx={{
              //backgroundColor: '#ee1111',
              pt: "20px",
              pb: "20px",
            }}
          >
            <MapRender />
          </Box>
        </Container>
      </Container>
    </div>
  );
}

function MapRender() {
  const { updateClickedLocation } = useExplorationStore();
  const navigate = useNavigate();

  const [subtitle, setSubtitle] = React.useState<string>(defaultMessage);
  const [mapClicked, setMapClicked] = React.useState<boolean>(false);
  const [hoverInfo, setHoverInfo] = React.useState<features>(defaultHoverInfo);
  const prevHoverInfoName = React.useRef<string>("");
  const turfStreetPoints: turfFeatureCollection[] = React.useMemo(
    () => pointsToFeatureCollection(),
    []
  );

  const neighborhoodCoordinates = React.useMemo(() => {
    if (hoverInfo.name !== "") {
      return neighborhoods.features.filter(
        (loc) => loc.properties.name === hoverInfo.name
      )[0].geometry.coordinates;
    } else {
      return [[[0]]];
    }
  }, [hoverInfo.name]);

  const [layerStyle, setLayerStyle] = React.useState({
    id: "border",
    type: "line",
    beforeId: "settlement-subdivision-label",
    paint: { "line-color": "#000000", "line-width": 0 },
  });

  const [drawnFeatures, setDrawnFeatures] = React.useState<
    Feature<Geometry, GeoJsonProperties>
  >({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    properties: {
      stroke: "#000000",
      strokeWidth: "1",
      strokeOpacity: "1",
    },
  });

  React.useEffect(() => {
    if (hoverInfo.name !== "") {
      setDrawnFeatures({
        type: "Feature",
        properties: {
          stroke: "#000000",
          strokeWidth: "1",
          strokeOpacity: "1",
        },
        geometry: { type: "Polygon", coordinates: neighborhoodCoordinates },
      });
      setSubtitle(
        hoverInfo.progress +
          " commercial doorfronts (" +
          hoverInfo.percentage +
          "%) marked in " +
          hoverInfo.name +
          "."
      );
      setLayerStyle({
        id: "border",
        type: "line",
        beforeId: "settlement-subdivision-label",
        paint: { "line-color": "black", "line-width": 1.5 },
      });
    } else if (subtitle !== defaultMessage) setSubtitle(defaultMessage);
  }, [hoverInfo, neighborhoodCoordinates, subtitle]);

  React.useEffect(() => {
    if (mapClicked) {
      navigate("/exploration");
    }
  }, [mapClicked, navigate]);

  function mouseMove(point: any): void {
    if (
      point.features[0] !== undefined &&
      point.features[0].properties.name !== prevHoverInfoName.current
    ) {
      const newPoint = point.features[0] as queriedFeatures;
      prevHoverInfoName.current = newPoint.properties.name;
      setHoverInfo({
        name: newPoint.properties.name,
        progress: newPoint.properties.progress,
        total: newPoint.properties.total,
        percentage: newPoint.properties.percentage,
      });
    }
  }

  async function findNearestPoint(point: MapLayerMouseEvent) {
    const turfPoint = turf.point([point.lngLat.lng, point.lngLat.lat]);
    let closePoint: any;
    if (hoverInfo.name !== "") {
      for (var i = 0; i < turfStreetPoints.length; i++) {
        if (hoverInfo.name === turfStreetPoints[i].name) {
          closePoint = nearestPoint(turfPoint, turfStreetPoints[i].points);
          //closePoint = nearestPoint(turfPoint,turfStreetPoints[0].points)

          /* ---------------------------- Handle navigation --------------------------- */
          // TODO: Update clicked location in global state
          updateClickedLocation({
            lat: closePoint.geometry.coordinates[1] as number,
            lng: closePoint.geometry.coordinates[0] as number,
          });
          setMapClicked(true);
          return;
        }
      }
    }
  }

  function pointsToFeatureCollection(): turfFeatureCollection[] {
    var sp = require("./streetlines.json");
    var turfStreetPoints: turfFeatureCollection[] = [];
    sp.forEach((neighborhoods: any, index: number) => {
      var spPoints: Feature<Point, GeoJsonProperties>[] = [];
      neighborhoods.locations.map((locations: any) =>
        spPoints.push(turf.point([locations.lng, locations.lat]))
      );

      turfStreetPoints.push({
        name: neighborhoods.name,
        points: turf.featureCollection(spPoints),
      });
    });
    return turfStreetPoints;
  }

  function onMouseLeave() {
    setHoverInfo(defaultHoverInfo);
    setLayerStyle({
      ...layerStyle,
      paint: { "line-color": "#000000", "line-width": 0 },
    });
  }

  return (
    <Map
      initialViewState={{
        bounds: llb,
      }}
      style={{ width: "100%", height: "87vh", zIndex: 0 }}
      mapStyle="mapbox://styles/tort8678/cl1om66ls000014pa3qlp6zge"
      styleDiffing
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}
      interactive={false}
      interactiveLayerIds={["doorfront-map"]}
      onClick={(e) => findNearestPoint(e)}
      onMouseMove={(e) => mouseMove(e)}
      onMouseLeave={onMouseLeave}
    >
      <Source id="border" type="geojson" data={drawnFeatures}>
        <Layer {...(layerStyle as LayerProps)} />
      </Source>

      <Typography sx={typographySX}>{subtitle}</Typography>
      <Grid container spacing={2} maxWidth={100} rowSpacing={0.005} sx={gridSX}>
        <Grid item xs={12}>
          <div>
            <b>Percentage</b>
          </div>
        </Grid>
        {Array.from(Array(legend.colors.length)).map((_, index) => (
          <Grid item xs={12} key={index}>
            <Item>
              <CircleIcon
                htmlColor={legend.colors[index]}
                sx={{ fontSize: 15, top: 0 }}
              ></CircleIcon>{" "}
              {legend.layers[index]}
            </Item>
          </Grid>
        ))}
      </Grid>
    </Map>
  );
}
