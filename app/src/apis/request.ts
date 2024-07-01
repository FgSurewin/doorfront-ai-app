import {baseRequest} from "./index";
export interface RequestData{
  requestedBy: string;
  address:string;
  type: string;
  // deadline: Date;
  deadline: number

}

export interface RequestReturnData {
  code: number;
  message: string;
  data?: any;
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

export function addLabeler(data: {requestId: string, labelerId: string}) {
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
}

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


export function getUserRequests(data: {requestId: string, labelerId: string}) {
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
}
