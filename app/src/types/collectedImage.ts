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
  exactCoordinates?: LabelLocation;
}

export type ImageLocation = { lat: number; lng: number; address?: string; };
export type LabelLocation = { lat: number, lng: number };

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
  createdAt?: string;

}

export interface CollectedImageInterface {
  image_id: string;
  pano: string;
  fileName: string;
  location: ImageLocation;
  address?: string;
  url: string;
  image_size: number[];
  isLabeled: boolean;
  human_labels: HumanLabels[];
  model_labels: CollectedLabelInterface[];
  // panoMarkers: PanoMarkerInterface[];
  pov: PovInterface;
  creator: string;
  createdAt?: string;
  updatedAt?: string;
  // modifiers: ModifierInterface[];
}
export interface FetchUnapprovedLabelsParams {
  limit?: number;
  skip?: number;
}
// 📂 apis/collectedImage.ts

export interface FetchFilteredImagesParams {
  searchQuery?: string;
  searchType?: "creator" | "labledBy" | "address" | "";
  addressFilter?: string;
  limit?: number;
  skip?: number;
  handleFailedTokenFuncs?: {
    navigate?: (path: string) => void;
    deleteAllLocal?: () => void;
    clearUserInfo?: () => void;
  };
}