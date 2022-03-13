import mongoose, { Document, Schema } from "mongoose";

export interface QueryImageAttribute {
  imageId: string;
  imgSrc: string;
  fileName: string;
}

const QueryImageAttributeSchema = new Schema<QueryImageAttribute>(
  { imageId: String, imgSrc: String, fileName: String },
  { timestamps: true }
);

export interface UserInterface extends Document {
  nickname: string;
  password: string;
  email: string;
  role: string;
  institution: string;
  isSent: boolean;
  isReviewed: boolean;
  label: number; // Total number of labels
  score: number; // Total score
  modify: number; // Number of images that user has modified
  create: number; // Number of images that user has created
  review: number; // Number of images that user has reviewed
  bonus: number; // Number of bonus that user has gained
  checkOld: number; // Number of old images (labelBox images) that user has reviewed
  label_images: QueryImageAttribute[];
  modify_images: QueryImageAttribute[];
  review_images: QueryImageAttribute[];
  unLabel_images: QueryImageAttribute[];
}

const UserModel = new Schema<UserInterface>(
  {
    nickname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    isSent: {
      type: Boolean,
      required: true,
    },
    isReviewed: {
      type: Boolean,
      required: true,
    },
    label: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    modify: {
      type: Number,
      required: true,
    },
    create: {
      type: Number,
      required: true,
    },
    review: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: true,
    },
    checkOld: {
      type: Number,
      required: true,
    },
    label_images: [QueryImageAttributeSchema],
    modify_images: [QueryImageAttributeSchema],
    review_images: [QueryImageAttributeSchema],
    unLabel_images: [QueryImageAttributeSchema],
  },
  { timestamps: true }
);

export default mongoose.model<UserInterface>("User", UserModel);
