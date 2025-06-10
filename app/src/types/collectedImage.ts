export interface CollectedBoxInterface {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PovInterface {
  heading: number;
  pitch: number;
  zoom: number;
}

export interface NotesInterface {
  name: string;
  address:string;
  additionalInfo:string;
}

export interface CollectedLabelInterface {
  label_id: string;
  box: CollectedBoxInterface;
  label: string;
  subtype?: string;
  labeledBy: string;
  markerPov?: PovInterface;
  notes?: NotesInterface;
}

export type ImageLocation = { lat: number; lng: number };

export interface PanoMarkerInterface {
  id: string;
  pov: PovInterface;
  title: string;
  point: number[];
  image_id: string;
  label_id: string;
  subtype: string;
  nickname: string;
}

export interface HumanLabels {
  name: string;
  labels: CollectedLabelInterface[];
}

export interface CollectedImageInterface {
  image_id: string;
  pano: string;
  fileName: string;
  location: ImageLocation;
  url: string;
  image_size: number[];
  isLabeled: boolean;
  human_labels: HumanLabels[];
  model_labels: CollectedLabelInterface[];
  // panoMarkers: PanoMarkerInterface[];
  pov: PovInterface;
  creator: string;
  // modifiers: ModifierInterface[];
}
