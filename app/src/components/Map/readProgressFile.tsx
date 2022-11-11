
import * as turf from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import { neighborhoods } from "./neighborhoods.js";
import * as progress from './progress.json';


export const datasetsToken = process.env.REACT_APP_MAPBOX_DATASETS_TOKEN
export const datasetID = 'cl1zpzqog0jxt2do9zoo11smr';

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxDatasets = require('@mapbox/mapbox-sdk/services/datasets')
const mbxUploads = require('@mapbox/mapbox-sdk/services/uploads')
const baseClient = mbxClient({ accessToken: datasetsToken });
const datasetsClient = mbxDatasets(baseClient);
const uploadsClient = mbxUploads(baseClient);


function uploadTileset() {
  uploadsClient.createUpload({
    tileset: `tort8678.cl1zpzqog0jxt2do9zoo11smr-60nd0`,
    url: 'mapbox://datasets/tort8678/cl1zpzqog0jxt2do9zoo11smr',
    name: 'doorfront_map'
  })
    .send()
    .then((response: any) => {
      const upload = response.body;
      console.log(upload);
    });

}

export default function readFile() {
  let pro = progress;
  let points = [];
  for (let i = 0; i < pro.features.length; i++) {
    points.push(turf.point(pro.features[i].geometry.coordinates))
  }

  let manhattan = [] as any;
  for (let i = 0; i < neighborhoods.features.length; i++) {
    neighborhoods.features[i].properties.progress = 0;
    manhattan.push(turf.polygon(neighborhoods.features[i].geometry.coordinates,
      {
        name: neighborhoods.features[i].properties.name,
        progress: 0,
        total: neighborhoods.features[i].properties.total as number,
        percentage: 0,
        id: neighborhoods.features[i].id,
      }));
  }

  for (let i = 0; i < points.length; i++) {
    let found: boolean = false;
    for (let j = 0; j < manhattan.length; j++) {
      if (booleanPointInPolygon(points[i], manhattan[j])) {
        manhattan[j].properties.progress++;
        found = true;
        break;
      }
    }
    if (!found) { console.log("ERROR: Point not within any neighborhood!\n") }
  }

  manhattan.forEach((element:any) => {
    if (element.properties.progress < element.properties.total) {
      let num = (element.properties.progress / element.properties.total) * 100;
      element.properties.percentage = Math.round(num);
    }
    else {
      element.properties.percentage = 100;
    }
  });

  let different: boolean = false;
  for (let i = 0; i < manhattan.length; i++) {
    let p = manhattan[i].properties.progress
    datasetsClient.getFeature({
      datasetId: datasetID,
      featureId: manhattan[i].properties.id
    })
      .send()
      .then((response: any) => {
        const feature = response.body
        if (feature.properties.progress !== p) {
          different = true;
          console.log(different)
        }
      })

  }

  if (different) {
    for (let i = 0; i < manhattan.length; i++) {
      datasetsClient.putFeature({
        datasetId: datasetID,
        featureId: manhattan[i].properties.id,
        feature: {
          "type": "Feature",
          "properties": {
            "name": manhattan[i].properties.name, "total": manhattan[i].properties.total,
            "progress": manhattan[i].properties.progress, "percentage": manhattan[i].properties.percentage
          },
          "geometry": { "type": "Polygon", "coordinates": manhattan[i].geometry.coordinates }
        }
      })
        .send()
        .then((response: any) => { console.log(response) });
      console.log("Added " + manhattan[i].properties.progress + ' to ' + manhattan[i].properties.name)
    }
    uploadTileset();
  }

}