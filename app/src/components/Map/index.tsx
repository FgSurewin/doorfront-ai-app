
import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import readFile, { datasetsToken, datasetID } from './data'
import './index.css';
import { Box, Container, Typography, Grid } from '@mui/material'
import Item from '@mui/material/Grid'

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxDatasets = require('@mapbox/mapbox-sdk/services/datasets');
const baseClient = mbxClient({ accessToken: datasetsToken });
const datasetsClient = mbxDatasets(baseClient);
const accessToken = process.env.REACT_APP_MAPBOX_TOKEN


mapboxgl.accessToken = accessToken as string

function CheckModified(): boolean | null {
  let modifiedToday: boolean | null = null;
  const [dateModified, setDateModified] = useState<Date | undefined>()
  let today: Date = new Date();

  useEffect(() => {
    if (modifiedToday != null) { return }
    datasetsClient.getMetadata({
      datasetId: datasetID
    })
      .send()
      .then((response: any) => {
        const datasetMetadata = response.body;
        setDateModified(new Date(datasetMetadata.modified))
      })
  }, []);

  if (dateModified !== undefined && today.getFullYear() >= dateModified.getFullYear() &&
    today.getMonth() >= dateModified.getMonth() && today.getDay() > dateModified.getDay()) {
    modifiedToday = false;
  }
  else {
    modifiedToday = true;
  }


  return modifiedToday;
}

export default function MapboxMap() {
  let modified: boolean | null = CheckModified();
  //console.log(modified)
  if (modified !== null && modified === false) {
    readFile();
  }
  const legend = {
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

  //change progress.geojson to progress.json before calling readFile()
  const map = useRef<mapboxgl.Map>();
  const mapContainer = useRef<any>(null);
  //const [progress, setProgress] = useState(0);
  //const [name, setName] = useState('');
  //let progress:number = 0;
  //let name:string = '';
  //let percentage:number = 0;
  //const [percentage, setPercentage] = useState(0);
  const defaultMessage: string = 'Welcome to Doorfront!\nHover over a neighborhood.'
  const [subtitle, setSubtitle] = useState(defaultMessage)
  const geojsonSource = useRef<any>();
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

  });
  /*
  useEffect(() => {
    if (map.current && m1.current !== undefined) {
      console.log(m1.current);
      let name = m1.current.properties!.name
      let progress = m1.current.properties!.progress;
      let percentage = m1.current.properties!.percentage;
      setSubtitle(progress + ' doorfronts (' + percentage + '%) marked in ' + name);
    }
  });
  */
  useEffect(() => {
    if (map.current === undefined) return;

    map.current.on('mousemove', (e: mapboxgl.MapMouseEvent) => {
      const point = map.current?.queryRenderedFeatures(e.point) as any
      geojsonSource.current = map.current?.getSource('border');
      if (point !== undefined && point[0] && point[0].layer.id === 'doorfront-map') {
        setSubtitle(point[0].properties.progress + ' doorfronts (' + point[0].properties.percentage + '%) marked in ' + point[0].properties.name);
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
      else if (point !== undefined && point[1] && point[1].layer.id === 'doorfront-map') {
        setSubtitle(point[1].properties.progress + ' doorfronts (' + point[1].properties.percentage + '%) marked in ' + point[1].properties.name);
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
      else {
        //setName('');
        setSubtitle(defaultMessage)
        //m1.current = undefined
        if (map.current?.getLayer('border')) {
          map.current?.removeLayer('border')
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
                <Item ><Item sx={{ display: "inline",  width: "200px", height: "200px", backgroundColor: legend.colors[index], 
            borderRadius: "50%",marginRight:'10px',marginTop:'2px',color:legend.colors[index] }}>oo</Item>      {legend.layers[index]}</Item>
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
