import { baseRequest } from ".";
import { QueryImageType } from "../global/queryImagesState";

export interface LoginData {
  email: string;
  password: string;
}
export interface ResetData {
  email: string;
  newPassword: string;
  nickname: string;
}

export interface LoginReturnData {
  code: number;
  message: string;
  data?: { token: string; nickname: string; id: string };
}

export interface SignUpData {
  nickname: string;
  password: string;
  email: string;
  role: string;
  institution: string;
}

export interface SignUpReturnData {
  code: number;
  message: string;
  data?: any;
}

/* -------------------------------------------------------------------------- */
/*                               Login & Sign Up                              */
/* -------------------------------------------------------------------------- */
export const signUp = (data: SignUpData) =>
  baseRequest
    .request<SignUpReturnData>({
      method: "POST",
      url: `/user/addUser`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
export const login = (data: LoginData) =>
  baseRequest
    .request<LoginReturnData>({
      method: "POST",
      url: `/user/login`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

export const resetPassword = (data: ResetData) =>
  baseRequest
    .request<SignUpReturnData>({
      method: "POST",
      url: `/user/reset`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

export interface UserReturnData<T> {
  code: number;
  message: string;
  data: T;
}

export interface QueryImageBodyData {
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

/* -------------------------------------------------------------------------- */
/*                          Handle User Image Record                          */
/* -------------------------------------------------------------------------- */

/* ------------------------ New Action List Functions ----------------------- */
export const saveImageToDiffList = (data: SaveActionListBody) =>
  baseRequest
    .request<UserReturnData<any>>({
      method: "POST",
      url: `/user/saveImageToDiffList`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
export const deleteImageFromList = (data: SaveActionListBody) =>
  baseRequest
    .request<UserReturnData<any>>({
      method: "POST",
      url: `/user/deleteImageFromList`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
/* -------------------------------------------------------------------------- */

/* ------------------------ Old Action List Functions ----------------------- */
/* -------------------------------------------------------------------------- */
// export const addLabelImage = (data: QueryImageBodyData) =>
//   baseRequest
//     .request<UserReturnData<any>>({
//       method: "POST",
//       url: `/user/addLabelImage`,
//       data,
//     })
//     .then((res) => res.data)
//     .catch((res) => {
//       throw new Error(res);
//     });

// export const deleteLabelImage = (data: QueryImageBodyData) =>
//   baseRequest
//     .request<UserReturnData<any>>({
//       method: "POST",
//       url: `/user/deleteLabelImage`,
//       data,
//     })
//     .then((res) => res.data)
//     .catch((res) => {
//       throw new Error(res);
//     });

// export const addUnLabelImage = (data: QueryImageBodyData) =>
//   baseRequest
//     .request<UserReturnData<any>>({
//       method: "POST",
//       url: `/user/addUnLabelImage`,
//       data,
//     })
//     .then((res) => res.data)
//     .catch((res) => {
//       throw new Error(res);
//     });

// export const deleteUnLabelImage = (data: QueryImageBodyData) =>
//   baseRequest
//     .request<UserReturnData<any>>({
//       method: "POST",
//       url: `/user/deleteUnLabelImage`,
//       data,
//     })
//     .then((res) => res.data)
//     .catch((res) => {
//       throw new Error(res);
//     });
/* -------------------------------------------------------------------------- */

export const getUnLabelImageList = (data: { id: string }) =>
  baseRequest
    .request<UserReturnData<QueryImageType[]>>({
      method: "POST",
      url: `/user/getUnLabelImageList`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                             Handle User Credits                            */
/* -------------------------------------------------------------------------- */
export const addUserCredit = (data: {
  id: string;
  type: "create" | "modify" | "review";
}) =>
  baseRequest
    .request<UserReturnData<any>>({
      method: "POST",
      url: `/user/addCredit`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });
export const addUserLabelCredit = (data: { id: string; labelNum: number }) =>
  baseRequest
    .request<UserReturnData<any>>({
      method: "POST",
      url: `/user/addLabelCredit`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                     Get User Total Score From Database                     */
/* -------------------------------------------------------------------------- */
export interface UserScoreFromDBType {
  label: number;
  score: number;
  modify: number;
  create: number;
  review: number;
  contestScore?:number;
}

export const getUserScoreFromDB = (data: { id: string }) =>
  baseRequest
    .request<UserReturnData<UserScoreFromDBType>>({
      method: "POST",
      url: `/user/getUserScore`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                        Handle Treasure Extra Credits                       */
/* -------------------------------------------------------------------------- */
export const addUserBonusCredit = (data: { id: string }) =>
  baseRequest
    .request<UserReturnData<any>>({
      method: "POST",
      url: `/user/addBonusCredit`,
      data,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

/* -------------------------------------------------------------------------- */
/*                   Get All User Information From Database                   */
/* -------------------------------------------------------------------------- */
export interface AllUserScores {
  email: string;
  score: number;
  username: string;
  labels: number;
  review: number;
  modify: number;
  create: number;
  contestScore?:number;
}

export const getAllUsersFromDB = () =>
  baseRequest
    .request<UserReturnData<AllUserScores[]>>({
      method: "GET",
      url: `/user/getAllUsers`,
    })
    .then((res) => res.data)
    .catch((res) => {
      throw new Error(res);
    });

export const updateContestScore = (data: {id:string, contestScore:number}) =>
    baseRequest
      .request<UserReturnData<any>>({
        method: "POST",
        url: `/user/updateContestScore`,
        data
      })
      .then((res) => res.data)
      .catch((res) => {
        throw new Error(res);
      });

export const getContestScore =(data: {id:string}) =>
      baseRequest
        .request<UserReturnData<number>>({
          method:"POST",
          url: `user/getContestScore`,
          data
        })
        .then((res) => res.data)
        .catch((res) => {
          throw new Error(res);
        });

export const getAreaScore = (data: {id:string, areaName:string}) =>
        baseRequest
          .request<UserReturnData<number>>({
            method:"POST",
            url: `user/getAreaScore`,
            data
          })
          .then ((res) => res.data)
          .catch((res) =>{
            throw new Error(res);
          });
          
export const resetContestScore = (data: {id:string}) =>
          baseRequest
            .request<UserReturnData<any>>({
              method:"POST",
              url: `user/resetContestScore`,
              data
            })
            .then ((res)=>res.data)
            .catch((res)=> {
              throw new Error(res);
            });

export const updateContestStats = (data: {id:string, areaName:string, areaScoreIncrement:number}) =>
          baseRequest
            .request<UserReturnData<any>>({
              method:"POST",
              url: `user/updateContestStats`,
              data
            })
            .then ((res)=>res.data)
            .catch((res)=> {
              throw new Error(res);
            });
            
export const getNickname = (data:{id:string}) =>
           baseRequest
           .request<UserReturnData<string>>({
             method:"POST",
             url: `user/getNickname`,
             data
           })
           .then ((res)=>res.data)
           .catch((res)=> {
             throw new Error(res);
           });