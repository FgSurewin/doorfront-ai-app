import create from "zustand";
import { devtools } from "zustand/middleware";
import { StreetViewMarkerType } from "../components/GoogleMap/utils/panoMarker";
import { CollectedImageInterface } from "../types/collectedImage";

export type LocationType = { lat: number; lng: number };
export type PovType = { heading: number; pitch: number; zoom: number };

export interface GoogleMapConfig {
	panoId: string;
	position: LocationType;
	povConfig: PovType;
	staticMapZoom: number;
	collectedStreetViewImages?: any;
}

export interface StreetViewImageConfig {
	panoId: string;
	imagePov: PovType;
	imageLocation: LocationType;
}

export interface ExplorationState {
  googleMapConfig: GoogleMapConfig;
  updateGoogleMapConfig: (update: Partial<GoogleMapConfig>) => void;
  isNextPosition: boolean;
  setIsNextPosition: (update: boolean) => void;

  streetViewImageConfig: StreetViewImageConfig;
  updateStreetViewImageConfig: (update: Partial<StreetViewImageConfig>) => void;

  collectedImageList: CollectedImageInterface[];
  saveCollectedImageList: (update: CollectedImageInterface[]) => void;
  updateCollectedImageList: (update: CollectedImageInterface[]) => void;
  panoramaMarkerList: StreetViewMarkerType[];
  updatePanoramaMarkerList: (update: StreetViewMarkerType[]) => void;
  currentSelectedImage: string;
  updateCurrentSelectedImage: (imageId: string) => void;

  /* -------------------------- Used with Mapbox map -------------------------- */
  clickedLocation: { lat: number; lng: number } | null;
  updateClickedLocation: (update: { lat: number; lng: number } | null) => void;

  /* ------------- Global state to control the number of modifier ------------- */
  maxModifier: number;
}

// Test location
// 40.7299154,-73.9930226

/**
 *   lat: 40.76053914888549,
 *   lng: -73.97417372824286,
 */

const guildTourLocation = {
  lat: 40.7299154,
  lng: -73.9930226,
};

const guildTourPov = {
  heading: 306,
  pitch: 0,
  zoom: 1,
};

// const guildTourImagePano = "O06zgWTW9GvbMLOT1CKrEg";
// const guildTourImagePano = "vO-Wd4dXOI1yVd0Lt5CwpQ";
const guildTourImagePano = "None";

export const useExplorationStore = create<ExplorationState>(
  devtools(
    (set) => ({
      googleMapConfig: {
        panoId: guildTourImagePano,
        position: guildTourLocation,
        povConfig: guildTourPov,
        staticMapZoom: 18,
      },
      updateGoogleMapConfig: (update) => {
        set(
          (state) => ({
            ...state,
            googleMapConfig: { ...state.googleMapConfig, ...update },
          }),
          false,
          "ExplorationState/updateGoogleMapConfig"
        );
      },
      isNextPosition: false,
      setIsNextPosition: (update) => {
        set(
          (state) => ({
            ...state,
            isNextPosition: update,
          }),
          false,
          "ExplorationState/setIsNextPosition"
        );
      },

      streetViewImageConfig: {
        panoId: "",
        imagePov: {
          heading: 0,
          pitch: 0,
          zoom: 0,
        },
        imageLocation: { lat: 0, lng: 0 },
      },
      updateStreetViewImageConfig: (update) => {
        set(
          (state) => ({
            ...state,
            streetViewImageConfig: {
              ...state.streetViewImageConfig,
              ...update,
            },
          }),
          false,
          "ExplorationState/updateStreetViewImageConfig"
        );
      },
      collectedImageList: [],
      panoramaMarkerList: [],
      saveCollectedImageList: (update) => {
        set(
          (state) => {
            const markerList: StreetViewMarkerType[] = [];
            update.forEach((image) => {
              if (image.human_labels.length > 0) {
                image.human_labels[0].labels.forEach((label) => {
                  const marker: StreetViewMarkerType = {
                    point: [0, 0],
                    label_id: label.label_id,
                    title: label.label, // Label Type
                    subtype: label.subtype,
                    image_id: image.image_id,
                    nickname: label.labeledBy,
                    pov: label.markerPov!,
                    imgSrc: image.url,
                    isShow: false,
                    box: label.box,
                    imagePov: image.pov,
                  };
                  markerList.push(marker);
                });
              }
            });
            return {
              ...state,
              collectedImageList: update,
              panoramaMarkerList: markerList,
            };
          },
          false,
          "ExplorationState/saveCollectedImageList"
        );
      },
      updateCollectedImageList: (update) => {
        set(
          (state) => ({ ...state, collectedImageList: update }),
          false,
          "ExplorationState/updateCollectedImageList"
        );
      },
      updatePanoramaMarkerList: (update) => {
        set(
          (state) => ({ ...state, panoramaMarkerList: update }),
          false,
          "ExplorationState/updatePanoramaMarkerList"
        );
      },
      currentSelectedImage: "",
      updateCurrentSelectedImage: (imageId) => {
        set(
          (state) => ({ ...state, currentSelectedImage: imageId }),
          false,
          "ExplorationState/updateCurrentSelectedImage"
        );
      },
      maxModifier: 3,

      /* -------------------------- Used with Mapbox map -------------------------- */
      clickedLocation: null,
      updateClickedLocation: (update) => {
        set(
          (state) => ({ ...state, clickedLocation: update }),
          false,
          "ExplorationState/updateClickedLocation"
        );
      },
    }),
    { name: "ExplorationState" }
  )
);

// function savePanoramaImages(panoId:string, set:NamedSet<ExplorationState>) {

// }
