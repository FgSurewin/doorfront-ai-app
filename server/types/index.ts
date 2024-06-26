// import { ModifierInterface } from "./../database/models/collectImage";
import { Request, Response, NextFunction } from "express";
import { CollectedLabelInterface } from "../database/models/collectImage";
import { LabelInterface } from "../database/models/image";

export interface ImageParams {
  panoId?: string;
  Id?: string;
}

export interface AppContext {
  req: Request;
  res: Response;
  next: NextFunction;
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
  lat: number;
  lon: number;
  type: string;
}
