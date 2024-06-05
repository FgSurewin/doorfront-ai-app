import * as React from 'react';
import Map, { Source, Layer, MapLayerMouseEvent } from 'react-map-gl';
import {Box, Container, Grid, Typography, Dialog, DialogTitle, List, ListItemButton} from '@mui/material'
import type { Feature, GeoJsonProperties, Point, Geometry } from 'geojson'
import * as turf from '@turf/turf';
import nearestPoint from '@turf/nearest-point';
import { useExplorationStore } from '../../global/explorationState';
import { useNavigate } from 'react-router-dom';
import type { LayerProps } from 'react-map-gl';
import { features, turfFeatureCollection, queriedFeatures, defaultHoverInfo, defaultMessage, llb } from './data';
import {contestNeighborhoods} from './contest';
import { getContestScore } from '../../apis/user';
import { ContestAreaInfo } from '../Contest';
import { readLocal } from '../../utils/localStorage';
import Button from "@mui/material/Button";


export default function ContestMap() {
  const { updateGoogleMapConfig, updateClickedLocation } = useExplorationStore();
  const navigate = useNavigate();

  const [subtitle, setSubtitle] = React.useState<string>(defaultMessage)
  const [mapClicked, setMapClicked] = React.useState<boolean>(false);
  const [hoverInfo, setHoverInfo] = React.useState<features>(defaultHoverInfo)
  const turfStreetPoints: turfFeatureCollection[] = React.useMemo(() => pointsToFeatureCollection(), [])
  const [contestScore,setContestScore] =React.useState(0)
   React.useEffect(()=>{
    async function retrieveContestScore(){
      //console.log(readLocal("id"))
      const res = await getContestScore({id:readLocal("id") as string})
      //console.log(res)
      setContestScore(res.data)
    }
    retrieveContestScore()
  },[])
  const neighborhoodCoordinates = React.useMemo(() => {
    if (hoverInfo.name !== "") {
      return contestNeighborhoods.features.filter(loc => String(loc.properties.name) == hoverInfo.name)[0].geometry.coordinates
    }
    else {
      return [[[0]]]
    }
  }, [hoverInfo.name])

  const [layerStyle, setLayerStyle] = React.useState<LayerProps>({
    id: 'border',
    type: 'line',
    paint: { "line-color": "#000000", "line-width": 0 },
    beforeId: "settlement-subdivision-label"
  })

  const [drawnFeatures, setDrawnFeatures] = React.useState<Feature<Geometry, GeoJsonProperties>>({
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: []
    },
    properties: {
      stroke: "#000000",
      strokeWidth: '1',
      strokeOpacity: "1"
    }
  })

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [clickedPoint,setClickedPoint] = React.useState<null| MapLayerMouseEvent>(null)

  React.useEffect(() => {
    if (hoverInfo.name !== "") {
      setDrawnFeatures({
        ...drawnFeatures,
        //@ts-ignore
        geometry: { type: 'Polygon', coordinates: neighborhoodCoordinates }
      })
      setSubtitle(hoverInfo.progress + ' commercial doorfronts (' + hoverInfo.percentage + '%) marked in ' + hoverInfo.name + '.')

      //@ts-ignore
      setLayerStyle({ ...layerStyle, paint: { "line-color": "#000000", "line-width": 1.5 } })
    }
    else if (subtitle !== defaultMessage) setSubtitle(defaultMessage)
  }, [hoverInfo.name])


  // React.useEffect(() => {
  //   if (mapClicked) {
  //     navigate('/exploration')
  //   }
  // }, [mapClicked, navigate])

  function mouseMove(point: any): void {
    if (point.features[0] !== undefined) {
      const newPoint = point.features[0] as queriedFeatures
      setHoverInfo({
        name: newPoint.properties.name,
        progress: newPoint.properties.progress,
        total: newPoint.properties.total,
        percentage: newPoint.properties.percentage,
        geometry:newPoint.geometry.coordinates,
        id: ""
      })

    }

  }
  // make point global variable, doesn't need to be a state because it does not affect re-rendering
  function findNearestPoint() {
    console.log(clickedPoint)
    if(!clickedPoint) return
    const turfPoint = turf.point([clickedPoint.lngLat.lng, clickedPoint.lngLat.lat])
    var closePoint: any
    if (hoverInfo.name !== '') {
      for (var i = 0; i < turfStreetPoints.length; i++) {
        //console.log(hoverInfo)
        if (hoverInfo.name.toString() === turfStreetPoints[i].name) {
          closePoint = nearestPoint(turfPoint, turfStreetPoints[i].points)
          //console.log(closePoint)
          //closePoint = nearestPoint(turfPoint,turfStreetPoints[0].points)
          updateGoogleMapConfig({ position: { lat: closePoint.geometry.coordinates[1], lng: closePoint.geometry.coordinates[0] } })
          updateClickedLocation({ lat: closePoint.geometry.coordinates[1], lng: closePoint.geometry.coordinates[0] } )
          navigate('/exploration')
          // setMapClicked(true)
          return
        }
      }
    }
  }

  function navigateValidatePage(){
    navigate('/reviewLabels', {state: {area:hoverInfo.name}})
  }

  function pointsToFeatureCollection(): turfFeatureCollection[] {
    var sp = require("./contestStreets.json")
    var turfStreetPoints: turfFeatureCollection[] = [];
    sp.map((neighborhoods: any, index: number) => {
      var spPoints: Feature<Point, GeoJsonProperties>[] = [];
      neighborhoods.locations.map((locations: any) =>
        spPoints.push(turf.point([locations.lng, locations.lat]))
      )

      turfStreetPoints.push({ name: neighborhoods.name, points: turf.featureCollection(spPoints) })
    }
    )
    //console.log(turfStreetPoints)
    return turfStreetPoints
  }
  function openDialog(point: MapLayerMouseEvent){
    if(hoverInfo.name !== "") {
      setDialogOpen(true)
      setClickedPoint(point)
    }
  }

  function closeDialog(){
    setDialogOpen(false)
  }

  // function onMouseLeave() {
  //   setHoverInfo(defaultHoverInfo)
  //   //@ts-ignore
  //   setLayerStyle({ ...layerStyle, paint: { "line-color": "#000000", "line-width": 0 } })
  // }

  function renderMap() {

    return (
      <Map
        initialViewState={{
          bounds: llb
        }}
        style={{ width: '100%', height: '87vh', zIndex: 0 }}
        mapStyle="mapbox://styles/tort8678/clei1xklm001z01p1ififm6hx"
        styleDiffing
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN as string}
        interactive={false}
        interactiveLayerIds={["contest-652024"]}
        onClick={(e) => openDialog(e)}
        onMouseMove={(e) => mouseMove(e)}
        //onMouseLeave={onMouseLeave}
      >

        <Source id='border' type='geojson' data={drawnFeatures}>
          <Layer {...layerStyle} />
        </Source>
        <Typography variant="subtitle1" color="text.primary" position='absolute' zIndex={1} fontSize={18}>Your Total Score: {contestScore}</Typography>
        <Dialog open={dialogOpen} onClose={closeDialog} sx={{m:"4rem"}}>
          <DialogTitle>Where would you like to navigate?</DialogTitle>
          <Box textAlign="center" display="flex" flexDirection="column" margin={2} >
            <Button variant="contained" sx={{mb:"1rem"}}  onClick={()=>findNearestPoint()}>Go to explore page</Button>
            <Button variant="contained" onClick={navigateValidatePage}>Go to validate page</Button>
          </Box>
        </Dialog>
        {/*}
        <Grid container spacing={2} maxWidth={100} rowSpacing={.005} sx={gridSX}>
          <Grid item xs={12}><div><b>Percentage</b></div></Grid>
          {Array.from(Array(legend.colors.length)).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Item ><CircleIcon htmlColor={legend.colors[index]} sx={{ fontSize: 15, top: 0 }}></CircleIcon> {legend.layers[index]}</Item>
            </Grid>
          ))}
        </Grid> */
      }
      </Map>
    )
  }

  return (
    <Container maxWidth='xl' sx={{ pt: 4, pb: 4 }}>
      <Grid container>

        <Grid item xs={12} md={3}>
        <Typography variant="h6" sx={{ml:3}}><b>Current Area:</b> {hoverInfo.name}</Typography>
          <ContestAreaInfo areaName={hoverInfo.name}></ContestAreaInfo>
          {/*
          <Grid container spacing={0} columnSpacing={0} rowSpacing={5} sx={{pt:'10%'}}>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Neighborhood Name:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1' >{hoverInfo.name}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Your Area Score:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "0"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Percent Owned:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "0%"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Current Owner:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "n/a"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Ownership Bonus:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : "500 points"}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant='subtitle1' fontWeight='bold'>Percentage Completed:</Typography>
            </Grid>
            <Grid item xs={4}>
            <Typography variant='subtitle1'>{hoverInfo.name === "" ? "" : hoverInfo.percentage+"%"}</Typography>
            </Grid>
          </Grid>
  */}
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ border: '3px solid grey' }}>
            {renderMap()}
          </Box>
        </Grid>


      </Grid>
    </Container>
  )
}