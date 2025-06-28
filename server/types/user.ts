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

export interface UpdateContestStats {
  id:string;
  areaName:string;
  areaScoreIncrement:number;
}

export interface UpdateContestScore {
  id:string;
  contestScore: number;
}

export interface getAreaScore {
  id:string;
  areaName: string;
}

export interface ResetBody {
  nickname: string;
  newPassword: string;
  email: string;
}

export interface ChallengeArea{
  id:string;
  areaName:string;
  areaScore:number;
  
}

export interface setReferrer{
  id:string;
  referrer:string
}

export interface GetAccessLevelBody {
  userId: string; 
}

export interface GetUser {
  id: string;
  nickname: string;
  email: string;
  role:string
  accessLevel: string;
}

export interface GrantAdminRight {
  id: string;         
}

