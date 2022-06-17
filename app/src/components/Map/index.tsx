
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import readFile, { datasetsToken, datasetID } from './data'
import './index.css';
import { Box, Container, Typography } from '@mui/material'
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
  const layers = [
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
    '100%'
  ];
  const colors = [
    '#ffffffF',
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
    '#22fa1e'
  ];

  //change progress.geojson to progress.json before calling readFile()
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<any>(null);
  //const [progress, setProgress] = useState(0);
  //const [name, setName] = useState('');
  //let progress:number = 0;
  //let name:string = '';
  //let percentage:number = 0;
  //const [percentage, setPercentage] = useState(0);
  const defaultMessage: string = 'Welcome to Doorfront!\nHover over a neighborhood.'
  const [subtitle, setSubtitle] = useState(defaultMessage)
  const manhattan = useRef();
  let llb = new mapboxgl.LngLatBounds(new mapboxgl.LngLat(-73.993432, 40.694029), new mapboxgl.LngLat(-73.930974, 40.879119));

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/tort8678/cl1om66ls000014pa3qlp6zge',
      center: [-73.965, 40.789],
      bounds: llb,
      zoom: 10.8,
      interactive: false
    });
  });

  useEffect(()=>{
    map.current?.on('load', (e:any) => {
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
  })
  useEffect(() => {
    if (!map.current) return;
    
    map.current.on('mousemove', (e: any) => {
      const manhattan = map.current?.queryRenderedFeatures(e.point) as any
      const geojsonSource: any = map.current?.getSource('border');
      if (manhattan.length > 1 && manhattan[0].layer.id === 'doorfront-map') {
        //setName(manhattan[0].properties.name);
        let name = manhattan[0].properties.name
        //setProgress(manhattan[0].properties.progress);
        let progress = manhattan[0].properties.progress;
        //setPercentage(manhattan[0].properties.percentage);
        let percentage = manhattan[0].properties.percentage;
        setSubtitle(progress + ' doorfronts (' + percentage + '%) marked in ' + name);
        geojsonSource.setData({
          "type": "FeatureCollection",
          'features': [{
            "properties": {
              "stroke": "#000000", "stroke-width": 2,
              "stroke-opacity": "1"
            },
            "geometry": {
              'type': 'Polygon',
              'coordinates': manhattan[0].geometry.coordinates
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
      else if (manhattan.length > 1 && manhattan[1].layer.id === 'doorfront-map') {
        //setName(manhattan[1].properties.name);
        let name = manhattan[1].properties.name
        //setProgress(manhattan[1].properties.progress);
        //setPercentage(manhattan[1].properties.percentage);
        let progress = manhattan[1].properties.progress;
        let percentage = manhattan[1].properties.percentage;
        setSubtitle(progress + ' doorfronts (' + percentage + '%) marked in ' + name);
        geojsonSource.setData({
          "type": "FeatureCollection",
          'features': [{
            "properties": {
              "stroke": "#000000", "stroke-width": 2,
              "stroke-opacity": "1"
            },
            "geometry": {
              'type': 'Polygon',
              'coordinates': manhattan[1].geometry.coordinates
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
        if (map.current?.getLayer('border')) {
          map.current?.removeLayer('border')
        }
      }
    });

  });

  return (
    <Container maxWidth = 'xs'>
      <Box
        sx={{
          position: {
            sm: "relative",
          },
        }}
      >
        <Typography>
          {subtitle}
        </Typography>
        <div ref={mapContainer} className='map-container' />
      </Box>
    </Container>
  )



}
