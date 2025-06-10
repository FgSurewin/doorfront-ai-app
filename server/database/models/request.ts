import mongoose, { Document, Schema } from "mongoose";

export interface RequestInterface extends Document {
  requestedBy: string;
  type: string;
  address:string;
  labelers: string[];
  deadline: Date;
  location: LocationType;
}

export type LocationType = { lat: number; lng: number };

const Request = new Schema<RequestInterface>(
  {
    requestedBy: {
      type: String,
      required: true
    },
    type:{
      type: String,
      required: true,
    },
    address:{
      type: String,
      required: true,
    },
    labelers:{
      type:[String],
      required: true,
    },
    deadline:{
      type: Date,
      required: true,
    },
    location:{
      type:{ lat: Number, lng: Number },
      required:true
    }

  }, {timestamps: true});

export default mongoose.model<RequestInterface>("Request", Request);