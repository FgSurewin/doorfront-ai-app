import React, {useState} from "react";
import {
  GoogleMapContainerStyle,
  MapContainerStyle,
  StreetViewContainerStyle,
} from "./GoogleMap.style";
import makeAsyncScriptLoader from "react-async-script";
import {combineMapOptions} from "./utils/mapTool";
import StreetViewMarkerList from "./StreetViewMarker/StreetViewMarkerList";
import {
  bindStreetViewEvents,
  combineStreetViewOptions,
  StreetViewEvents,
} from "./utils/streetViewTool";
// import { panoMarker } from "./testData";
import {StreetViewMarkerType} from "./utils/panoMarker";
import {useExplorationStore} from "../../global/explorationState";
import Notes from "../Notes"
// import {Box,Typography,} from "@mui/material"
// import asyncLoading from "react-async-loader";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import {Button, Box, Grid, TextField} from "@mui/material";
import {fromAddress} from "react-geocode";
import {getNewStreetview} from "../../apis/queryStreetView";
import {useSnackbar} from "notistack";


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
  const [location, setLocation] = React.useState({lat: 0, lng: 0})
  const [address, setAddress] = React.useState("");
  const {
    streetViewImageConfig,
    updateGoogleMapConfig,
    updateStreetViewImageConfig,
  } = useExplorationStore();
  const {enqueueSnackbar} = useSnackbar();
  const [showSearch, setShowSearch] = React.useState(false);
  // const _panoID = React.useRef("");

  /* -------------------------------------------------------------------------- */
  /*                                Global State                                */
  /* -------------------------------------------------------------------------- */
  const {isNextPosition, setIsNextPosition, currentSelectedImage,} = useExplorationStore();
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
    */
  React.useEffect(() => {
    if (google) {
      mapConfig = {...mapConfig, streetViewControlOptions: {sources: [google.maps.StreetViewSource.GOOGLE]}}
    }
  }, [google,
    map,
    streetView,
    streetViewEvents,
    streetViewConfig,
    isNextPosition,
    setIsNextPosition,])

  React.useEffect(() => {
    if (google && !_isMounted.current) {
      // mapConfig = {...mapConfig, streetViewControlOptions:{sources: [google.maps.StreetViewSource.GOOGLE]}}
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
      //console.log(streetViewConfig);
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

  const [showMap, setShowMap] = useState(false);

  const handleToggleMap = () => {
    setShowMap(!showMap);
  };

  async function handleClick() {
    try {
      //console.log(streetViewImageConfig)
      const result = await fromAddress(address)
      //console.log(result)
      if (result.status === "OK") {
        setLocation({lat: result.results[0].geometry.location.lat, lng: result.results[0].geometry.location.lng});
        const newSV = await getNewStreetview(process.env.REACT_APP_GOOGLE_MAP_API_KEY!, result.results[0].geometry.location)
        //  console.log(newSV!.data.location?.pano);
        // const metadata = await fetchMetadata(process.env.REACT_APP_GOOGLE_MAP_API_KEY!, result.results[0].geometry.location)
        // console.log(metadata)

        updateGoogleMapConfig({
          position: {
            lat: newSV!.data.location?.latLng?.lat() as number,
            lng: newSV!.data.location?.latLng?.lng() as number
          },
          panoId: newSV!.data.location?.pano,
          povConfig: streetViewImageConfig.imagePov
        })
        updateStreetViewImageConfig({
          imageLocation: {lat: location.lat, lng: location.lng},
          panoId: newSV!.data.location?.pano
        })
        setIsNextPosition(true)
        //  console.log(location)
      } else {
        enqueueSnackbar("The location is not a valid address!", {variant: "error"})
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("The location is not a valid address!", {variant: "error"});
    } finally {
      // console.log(googleMapConfig)


    }

    // .then(({ results }) => {
    //   const { lat, lng } = results[0].geometry.location;
    //   if(results){
    //     updateStreetViewImageConfig({imageLocation: {lat, lng}})
    //     updateGoogleMapConfig({
    //       position: {
    //         lat,
    //         lng
    //       }
    //     })
    //     updateClickedLocation({
    //       lat,
    //       lng
    //     });
    //
    //     console.log(lat, lng)
    //     console.log(googleMapConfig)
    //   }
    // })
    // .catch((error)=>{
    //   console.error(error);
    //   enqueueSnackbar("The location is not a valid address!", {variant: "error"});
    // })}
  }

  return (
    <>
      {google && (
        <div id="GoogleMapContainer" style={GoogleMapContainerStyle}>
          <div id="StreetViewContainer" style={StreetViewContainerStyle}>
            <div
              id="StreetView"
              ref={_streetView}
              style={{width: "100%", height: "100%"}}
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
          {/* Toggle search bar */}
          <Button size="small" variant="contained"
                  sx={{position: "absolute", zIndex: 1000000, display: "block", top: 10, left: 10,}} onClick={() => {
            setShowSearch(!showSearch);
            setAddress("")
          }}>
            {showSearch ? <SearchOffIcon/> : <SearchIcon/>}
          </Button>
          <Box width="auto" maxWidth="65%"
               sx={{
                 display: (showSearch ? "block" : "none"),
                 bgcolor: "white",
                 position: "absolute",
                 zIndex: 10000,
                 top: "4rem",
                 left: 10,
                 p: "1rem",
                 borderRadius: 2,
                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
               }}>
            <Grid container>
              <Grid item xs={8}>
                <TextField label={"Search Address"} fullWidth size="small" value={address}
                           onChange={(e) => setAddress(e.target.value)}/>

              </Grid>
              <Grid item xs={4}>
                <Button variant={"contained"} sx={{ml: 2}} onClick={() => handleClick()}>
                  Go!
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/*  MapToggler */}
          <div id="miniMapToggler">
            <Button
              variant="contained"
              startIcon={showMap ? <VisibilityOffIcon/> : <VisibilityIcon/>}
              onClick={handleToggleMap}>
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>


          {/* <IconButton aria-label="Open in new tab" component="a" href="#as-link">
              {showMap ?<VisibilityOffIcon /> : <VisibilityIcon/>}
            </IconButton> */}
          <div
            id="MapContainer"
            className={showMap ? 'MapBlock' : 'MapNone'}
            style={MapContainerStyle}
          >


            <div
              id="Map"
              ref={_map}
              style={{width: "100%", height: "100%"}}
            />
          </div>
        </div>
      )}
    </>
  );
}

const api = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
const url = `https://maps.googleapis.com/maps/api/js?key=${api}&libraries=places&callback=Function.prototype&v=quarterly`;
export default makeAsyncScriptLoader(url, {
  globalName: "google",
})(GoogleMap);
