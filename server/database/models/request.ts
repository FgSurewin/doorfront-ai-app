import mongoose, { Document, Schema } from "mongoose";

export interface RequestInterface extends Document {
  requestedBy: string;
  type: string;
  lat: number;
  lon: number;
  labelers: string[];
  deadline: Date;
}

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
    lat:{
      type: Number,
      required: true,
    },
    lon:{
      type: Number,
      required: true,
    },
    labelers:{
      type:[String],
      required: true,
    },
    deadline:{
      type: Date,
      required: true,
    }

  }, {timestamps: true});

export default mongoose.model<RequestInterface>("Request", Request);