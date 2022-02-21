import mongoose, { Schema } from "mongoose";

export interface LocationModelType {
  lat: number;
  lng: number;
}

const LocationModel = new Schema<LocationModelType>({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<LocationModelType>("Location", LocationModel);
