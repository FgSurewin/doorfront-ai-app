export interface QueryImageBody {
  id: string;
  data: { imageId: string; imgSrc: string; fileName: string };
}

export interface SaveActionListBody {
  category:
    | "label_images"
    | "modify_images"
    | "review_images"
    | "unLabel_images";
  id: string;
  data: { imageId: string; imgSrc: string; fileName: string };
}

export interface QueryImageListBody {
  id: string;
}

export interface UpdateCreditBody {
  id: string;
  type: "create" | "modify" | "review";
}

export interface UpdateLabelCreditBody {
  id: string;
  labelNum: number;
}

export interface GetUserScoreBody {
  id: string;
}

export interface ResetBody {
  nickname: string;
  newPassword: string;
  email: string;
}
