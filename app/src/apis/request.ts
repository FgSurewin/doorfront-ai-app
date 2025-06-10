import {baseRequest} from "./index";
import {LocationType} from "../global/explorationState";
export interface RequestData{
  requestedBy: string;
  address:string;
  type: string;
  // deadline: Date;
  deadline: number
  location: LocationType,
  _id?:string
}

export interface RequestReturnData {
  code: number;
  message: string;
  data?: RequestData[];
}
export const addRequest = (data: RequestData) =>
  baseRequest
    .request<RequestReturnData>({
      method: "POST",
      url: `/request/addRequest`,
      data
    })
    .then((response) => response.data)
    .catch((res) => {
      throw new Error(res);
    })

export const addLabeler = (data: {requestId: string, labelerId: string})=>
  baseRequest
    .request({
      method: "POST",
      url: `/request/addLabeler`,
      data
    })
    .then((response) => response.data)
    .catch((res) =>{
      throw new Error(res)
    })


export const getOpenRequests =() =>
  baseRequest
    .request<RequestReturnData>({
      method: "GET",
      url: `/request/getOpenRequests`
    })
    .then((response) => response.data)
    .catch((res) =>{
      throw new Error(res)
    })


export const getUserRequests = (data: {requestId: string, labelerId: string}) =>
  baseRequest
    .request({
      method: "GET",
      url: `/request/getUserRequests`,
      data
    })
    .then((response) => response.data)
    .catch((res) =>{
      throw new Error(res)
    })

