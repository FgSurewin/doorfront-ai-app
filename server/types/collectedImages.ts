import {
  CollectedImageInterface,
  HumanLabels,
} from "../database/models/collectImage";

export type GetMultiImagesByIdsBody = { idList: string[] };
export type GetMultiImageByPano = { panoId: string };

export type AddHumanLabelsBody = { imageId: string; data: HumanLabels[] };

export type AddNewHumanLabelsBody = { imageId: string; data: HumanLabels };

export type UpdateImageBody = {
  imageId: string;
  data: Partial<CollectedImageInterface>;
};

export type DeleteImageBody = {
  imageId: string;
};
