import { CollectedBoxInterface, NotesInterface } from "../../../types/collectedImage";

export interface StreetViewMarkerType {
  point: number[];
  pov: { heading: number; pitch: number; zoom: number };
  title: string;
  subtype?: string;
  image_id: string;
  label_id: string;
  nickname: string;
  imgSrc: string;
  isShow: boolean;
  box: CollectedBoxInterface;
  imagePov: { heading: number; pitch: number; zoom: number };
  notes?:NotesInterface
}
