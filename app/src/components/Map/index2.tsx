
import * as React from 'react';
import { useState, useRef, useEffect,useMemo} from 'react';
import mapboxgl from 'mapbox-gl';
import { useContext } from 'react';
import { ConfigContext } from '../../App';
import readFile, { datasetID } from './readProgressFile'
import './index.css';
import { Box, Container,Grid } from '@mui/material'
import Item from '@mui/material/Grid'
import CircleIcon from '@mui/icons-material/Circle';


const mbxClient = require('@mapbox/mapbox-sdk');
const mbxDatasets = require('@mapbox/mapbox-sdk/services/datasets');

// const baseClient = mbxClient({ accessToken: datasetsToken });
// const datasetsClient = mbxDatasets(baseClient);
const accessToken = "pk.eyJ1IjoidG9ydDg2NzgiLCJhIjoiY2wxcXZncDJtMXMzNTNpb2JjMGM0a3ptNSJ9.esX8M7MJ2cTfFWfL2C4w7g"
export const legend = {
  layers: [
    '0%',
    '5%',
    '10%',
    '20%',
    '30%',
    '40%',
    '50%',
    '60%',
    '70%',
    '80%',
    '90%',
    '100%'],
  colors: [
    '#ffffff',
    '#fcf1cf',
    '#f6d46f',
    '#f3c058',
    '#f2a840',
    '#f08c28',
    '#ee6d11',
    '#ee5b11',
    '#ee4811',
    '#ee3611',
    '#ee1111',
    '#22fa1e']
}

function useCheckModified(datasetID: string, datasetsClient: any): boolean | null {
  const [modifiedToday, setModifiedToday] = useState<boolean | null>(null);

  useEffect(() => {
    if (!datasetsClient) return;

    const today = new Date();
    datasetsClient.getMetadata({ datasetId: datasetID })
      .send()
      .then((response: any) => {
        const modified = new Date(response.body.modified);
        const isModified =
          today.getFullYear() === modified.getFullYear() &&
          today.getMonth() === modified.getMonth() &&
          today.getDate() === modified.getDate();

        setModifiedToday(isModified);
      })
      .catch(() => setModifiedToday(false)); // fallback on error
  }, [datasetID, datasetsClient]);

  return modifiedToday;
}


export default function MapboxMap() {
  const config = useContext(ConfigContext);

  const datasetsToken = config?.REACT_APP_MAPBOX_DATASETS_TOKEN || "";
  const accessToken = "pk.eyJ1IjoidG9ydDg2NzgiLCJhIjoiY2wxcXZncDJtMXMzNTNpb2JjMGM0a3ptNSJ9.esX8M7MJ2cTfFWfL2C4w7g"

  // Create clients here inside component so we have access to tokens
  const baseClient = useMemo(() => mbxClient({ accessToken: datasetsToken }), [datasetsToken]);
  const datasetsClient = useMemo(() => mbxDatasets(baseClient), [baseClient]);

  // Set mapbox-gl access token once config is ready

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
  }, [accessToken]);

  const modified = useCheckModified(datasetID, datasetsClient);
  
  useEffect(() => {
    if (
    modified === false &&
    config?.REACT_APP_MAPBOX_DATASETS_TOKEN &&
    config.REACT_APP_MAPBOX_TOKEN
  ) {
    // We assert the config type to satisfy readFile input type
    readFile(config as { REACT_APP_MAPBOX_DATASETS_TOKEN: string });
  }
}, [modified, config]);



  //change progress.geojson to progress.json before calling readFile()
  const map = useRef<mapboxgl.Map>();
  const mapContainer = useRef<any>();
  const defaultMessage: string = 'Welcome to Doorfront!\nHover over a neighborhood.'
  const [subtitle, setSubtitle] = useState(defaultMessage)
  const geojsonSource = useRef<any>();
  let first = true;
  let llb = new mapboxgl.LngLatBounds(new mapboxgl.LngLat(-73.993432, 40.694029), new mapboxgl.LngLat(-73.930974, 40.879119));

  useEffect(() => {
    if (map.current !== undefined) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/tort8678/cl1om66ls000014pa3qlp6zge',
      bounds: llb,
      interactive: false
    });
    
    map.current.on('load', (e: any) => {
      if (map.current?.getSource('border') === undefined) {
        map.current?.addSource('border', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': []
          }
        });
        
      }
      
    })
  },[]);
  
  useEffect(() => {
    if (map.current === undefined) return;
    map.current.on('mouseleave','doorfront-map',(e: mapboxgl.MapMouseEvent) => {
      setSubtitle(defaultMessage)
      if (map.current?.getLayer('border')) {
        map.current?.removeLayer('border')
      }
    })
    
    map.current.on('mousemove','doorfront-map', (e: mapboxgl.MapMouseEvent) => {
      const point = map.current?.queryRenderedFeatures(e.point) as any
      geojsonSource.current = map.current?.getSource('border');
      if (point && point.length > 0 && point[0].layer.id === 'doorfront-map') {
        setSubtitle(point[0].properties.progress + ' commercial doorfronts (' + point[0].properties.percentage + '%) marked in ' + point[0].properties.name);
        geojsonSource.current.setData({
          "type": "FeatureCollection",
          'features': [{
            "properties": {
              "stroke": "#000000", "stroke-width": 2,
              "stroke-opacity": "1"
            },
            "geometry": {
              'type': 'Polygon',
              'coordinates': point[0].geometry.coordinates
            }
          }]
        });
        if (!map.current?.getLayer('border')) {
          map.current?.addLayer({
            'id': 'border',
            'type': 'line',
            'source': 'border',
            "paint": { "line-color": "#000000" }
          })
        }
      }
      else if (point && point.length > 1 && point[1].layer.id === 'doorfront-map') {
        setSubtitle(point[1].properties.progress + ' commercial doorfronts (' + point[1].properties.percentage + '%) marked in ' + point[1].properties.name);
        geojsonSource.current.setData({
          "type": "FeatureCollection",
          'features': [{
            "properties": {
              "stroke": "#000000", "stroke-width": 2,
              "stroke-opacity": "1"
            },
            "geometry": {
              'type': 'Polygon',
              'coordinates': point[1].geometry.coordinates
            }
          }]
        });
        if (!map.current?.getLayer('border')) {
          map.current?.addLayer({
            'id': 'border',
            'type': 'line',
            'source': 'border',
            "paint": { "line-color": "#000000" }
          })
        }
      }
    });
  }, [subtitle]);


  return (
    <Container maxWidth='xl' sx={{backgroundColor: '#333D58', position:{md:'relative'}}}>
      <Box 
        sx={{
          //backgroundColor: '#ee1111',
          pt: '20px',
          pb: '20px',
          
        }}
      >
        <div>
        <div className='map-overlay'>{subtitle}</div>
          <div ref={mapContainer} className='map-container'>

          <div className='map-overlay2'>
            <Grid container spacing={2} maxWidth={85} rowSpacing={.005}>
              <Grid item xs={12}><div><b>Percentage</b></div></Grid>
              {Array.from(Array(legend.colors.length)).map((_, index) => (
              <Grid item xs = {12} key={index}>
                <Item ><CircleIcon htmlColor={legend.colors[index]} sx={{fontSize:15}}></CircleIcon>      {legend.layers[index]}</Item>
              </Grid>
            ))}
            
            </Grid>
          </div>
          </ div>
        </div>

      </Box>
    </Container>
  )



}
