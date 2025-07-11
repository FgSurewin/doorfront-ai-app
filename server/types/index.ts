// import { ModifierInterface } from "./../database/models/collectImage";
import { Request, Response, NextFunction } from "express";
import { CollectedLabelInterface } from "../database/models/collectImage";
import { LabelInterface } from "../database/models/image";
import {LocationType} from "../database/models/request";

export interface ImageParams {
  panoId?: string;
  Id?: string;
}

export interface AppContext {
  req: Request;
  res: Response;
  next: NextFunction;
}

type FilterQuery = {
  searchQuery?: string;
  searchType?: "creator" | "labledBy" | "address";
  addressFilter?: string;
  page?: string;
  limit?: string;
  skip?:string;
};

export interface FilteringContext {
  req: Request;
  res: Response;
  next: NextFunction;
  query: FilterQuery;
}

export type ImageField = "user_one" | "user_two" | "user_three";

export interface ImageBody {
  labeled?: boolean;
  id?: string;
  labelArea?: LabelInterface[];
  field?: ImageField;
}
export interface CollectImageBody {
  labeled?: boolean;
  id?: string;
  labelArea?: CollectedLabelInterface[];
  field?: ImageField;
  modifier?: CollectedLabelInterface;
}

export interface UserBody {
  nickname: string;
  password: string;
  email: string;
  role: string;
  institution: string;
  referralCode?:string;
  accessLevel:string;
  hoursCertified?:number;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateImageBody {
  id: string;
  number: number;
}

export interface UpdateUserLabelsBody {
  name: string;
  number: number;
  type: "label" | "revise" | "modify";
}

export interface RequestBody {
  requestedBy: string;
  address:string;
  type: string;
  deadline:number;
  location: LocationType
}
