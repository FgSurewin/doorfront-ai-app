import React from "react";
import {
  GoogleMapContainerStyle,
  MapContainerStyle,
  StreetViewContainerStyle,
} from "./GoogleMap.style";
import makeAsyncScriptLoader from "react-async-script";
import { combineMapOptions } from "./utils/mapTool";
import StreetViewMarkerList from "./StreetViewMarker/StreetViewMarkerList";
import {
  bindStreetViewEvents,
  combineStreetViewOptions,
  StreetViewEvents,
} from "./utils/streetViewTool";
// import { panoMarker } from "./testData";
import { StreetViewMarkerType } from "./utils/panoMarker";
import { useExplorationStore } from "../../global/explorationState";
import Notes from "../Notes"
import {Box,Typography,} from "@mui/material"
// import asyncLoading from "react-async-loader";

export interface GoogleMapProps {
  google?: typeof google;
  streetViewEvents?: StreetViewEvents;
  mapConfig: google.maps.MapOptions;
  streetViewConfig: google.maps.StreetViewPanoramaOptions;
  streetViewMarkerList?: StreetViewMarkerType[];
}

function GoogleMap({
  google,
  streetViewEvents,
  mapConfig,
  streetViewConfig,
  streetViewMarkerList = [],
}: GoogleMapProps) {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [streetView, setStreetView] =
    React.useState<google.maps.StreetViewPanorama | null>(null);
  const _map = React.useRef<HTMLDivElement>(null);
  const _streetView = React.useRef(null);
  const _isMounted = React.useRef(false);
  // const _panoID = React.useRef("");

  /* -------------------------------------------------------------------------- */
  /*                                Global State                                */
  /* -------------------------------------------------------------------------- */
  const { isNextPosition, setIsNextPosition, currentSelectedImage, currentSelectedImageTitle } = useExplorationStore();
  /*
  const [currentArea,setCurrentArea] = React.useState("")
    
  React.useEffect(()=>{
    const point =  turf.point([googleMapConfig.position.lng,googleMapConfig.position.lat]);
    for( const area of contestNeighborhoods.features){
      if(booleanPointInPolygon(point, area)){
        setCurrentArea(area.properties.name as string)
        break
      }
    }
    
  },[googleMapConfig.position])
  */
  React.useEffect(() => {
    if (google && !_isMounted.current) {
      if (!map && !streetView) {
        // console.log("Initialize Map...");
        setMap(
          new google.maps.Map(_map.current!, combineMapOptions(mapConfig))
        );
        setStreetView(
          new google.maps.StreetViewPanorama(
            _streetView.current!,
            combineStreetViewOptions(streetViewConfig)
          )
        );
      }

      if (map && streetView) {
        // console.log("Binding events...");
        _isMounted.current = true;
        map.setStreetView(streetView);
        streetViewEvents &&
          bindStreetViewEvents(streetView, streetViewEvents, map);
      }
    }

    // Change _isMounted value
    if (google && map && streetView && _isMounted.current && isNextPosition) {
      // console.log("Update map...", mapConfig);
      _isMounted.current = false;
      setIsNextPosition(false);
      setMap(new google.maps.Map(_map.current!, combineMapOptions(mapConfig)));
      setStreetView(
        new google.maps.StreetViewPanorama(
          _streetView.current!,
          combineStreetViewOptions(streetViewConfig)
        )
      );
    }

    return () => {
      if (map && google) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, [
    google,
    map,
    streetView,
    streetViewEvents,
    mapConfig,
    streetViewConfig,
    isNextPosition,
    setIsNextPosition,
  ]);

  return (
    <>
      {google && (
        <div id="GoogleMapContainer" style={GoogleMapContainerStyle}>
          <div id="StreetViewContainer" style={StreetViewContainerStyle}>
            <div
              id="StreetView"
              ref={_streetView}
              style={{ width: "100%", height: "100%" }}
              className="StreetViewContainer"
            />
            {streetView &&
              _streetView.current &&
              streetViewMarkerList.length > 0 && (
                <StreetViewMarkerList
                  panoramaMarkerList={streetViewMarkerList}
                  streetViewInstance={streetView}
                  streetViewContainer={_streetView.current}
                  // markerClickFunc={() => {
                  //   console.log("TEST");
                  // }}
                />
              )}
          </div>
          <div
            id="MapContainer"
            className="MapContainer"
            style={MapContainerStyle}
          >
            {/*
            {activeContest != undefined &&
              <div>
                  <Box sx = {{bottom:'auto'}}>
                  <Typography>
                    Current Area: {currentArea}
                  </Typography>
                  <Typography>
                    Current Area Score:
                  </Typography>
                  <Typography>
                    Current Area Owner:
                  </Typography>
                </Box>
                </div>

            */}

            {
              currentSelectedImageTitle=== 'door' && currentSelectedImage !== "" &&
              <div style={{position:'absolute',top:'300px',width:'240px'}}>
                <Notes page = "explore" id={currentSelectedImage} />
              </div>
            }
            <div
              id="Map"
              ref={_map}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
}

const api = process.env.REACT_APP_API_KEY;
const url = `https://maps.googleapis.com/maps/api/js?key=${api}&libraries=&v=weekly&channel=2&libraries=places`;
export default makeAsyncScriptLoader(url, {
  globalName: "google",
})(GoogleMap);
