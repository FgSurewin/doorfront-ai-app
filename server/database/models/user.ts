import mongoose, { Document, Schema } from "mongoose";

export interface QueryImageAttribute {
  imageId: string;
  imgSrc: string;
  fileName: string;
}

export interface areaScores{
  areaName:string;
  areaScore: number;
}

export interface userReferred{
  userID:string;
  bonusReceived: boolean;
}

const areaSchema = new Schema<areaScores> ({
  areaName: {type:String, required:true},
  areaScore: {type:Number, required:true}
})

const QueryImageAttributeSchema = new Schema<QueryImageAttribute>(
  { imageId: String, imgSrc: String, fileName: String },
  { timestamps: true }
);

const UserReferredSchema = new Schema<userReferred> (
  {userID:String, bonusReceived:Boolean},
  {timestamps:true}
)

/*
const PreviousScoresSchema = new Schema<number>(
  {previousScore: Number},
  {timestamps: true}
)
*/

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
  contestScore: number;
  areaScores: areaScores[];
  //previousScores: number[]; //store 12 previous months scores
  //NEW all optional
  referralCode: string;
  usersReferred: userReferred[];
  referrer : string;
  updatedAt: Date
  accessLevel?: string;
  hoursCertified?: number;
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
    contestScore: {
      type: Number,
      required: false
    },
    areaScores: [areaSchema],
   // previousScores: [PreviousScoresSchema]
    referralCode: {
      type:String,
      required:false
    },
    usersReferred:[UserReferredSchema],
    referrer:{
      type:String,
      required:false
    },
    updatedAt:{
      type:Date,
      required: false
    },
    accessLevel:{
      type:String,
      required: false,
      enum: ["admin", "basic"],
      default: "basic"
    },
    hoursCertified:{
      type: Number,
      required: false,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model<UserInterface>("User", UserModel);
