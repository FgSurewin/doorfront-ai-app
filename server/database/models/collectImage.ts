import mongoose, { Document, Schema } from "mongoose";

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

export interface CollectedLabelInterface {
  label_id: string;
  box: CollectedBoxInterface;
  label: string;
  subtype?: string;
  labeledBy: string;
  markerPov?: PovInterface;
}

export type ImageLocation = { lat: number; lng: number };

// export interface PanoMarkerInterface extends Document {
//   id: string;
//   pov: PovInterface;
//   title: string;
//   point: number[];
//   image_id: string;
//   label_id: string;
//   subtype: string;
//   nickname: string;
// }

export interface HumanLabels extends Document {
  name: string;
  labels: CollectedLabelInterface[];
}

export interface CollectedImageInterface extends Document {
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

const CollectedLabelSchema = new Schema<CollectedLabelInterface>(
  {
    label_id: { type: String, required: true },
    box: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },
    label: String,
    subtype: { type: String, required: false },
    labeledBy: String,
    markerPov: {
      heading: Number,
      pitch: Number,
      zoom: Number,
    },
  },
  { timestamps: false }
);

const HumanLabelsSchema = new Schema<HumanLabels>(
  { name: String, labels: [CollectedLabelSchema] },
  { timestamps: true }
);

const CollectImageModel = new Schema<CollectedImageInterface>(
  {
    image_id: {
      type: String,
      required: true,
    },
    pano: {
      type: String,
      required: true,
    },
    fileName: String,
    url: String,
    location: { type: { lat: Number, lng: Number }, required: true },
    image_size: {
      type: [Number],
      required: true,
    },
    isLabeled: {
      type: Boolean,
      required: true,
    },
    human_labels: {
      type: [HumanLabelsSchema],
      required: true,
    },
    model_labels: {
      type: [CollectedLabelSchema],
      required: true,
    },
    pov: {
      type: {
        heading: Number,
        pitch: Number,
        zoom: Number,
      },
      required: true,
    },
    creator: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<CollectedImageInterface>(
  "CollectImage",
  CollectImageModel,
  "collect_panorama"
);
