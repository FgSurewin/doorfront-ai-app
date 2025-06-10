import { baseRequest } from ".";

export interface contestReturnData<T> {
    code:number,
    message:string,
    data?:T
}

export interface contestArea{
    areaName:string;
    ownershipBonus: number;
    currentOwner?:string;
}
export interface newContest{
    contestNumber: number;
    areas: contestArea[];
    endDate: string;
    leader?: string;
    active: boolean;
}
export interface newArea{
    contestNumber:number;
    area:contestArea
}

export const getActiveContest = ()=>
    baseRequest
        .request<contestReturnData<number>>({
            method:"GET",
            url: `/contest/getActiveContest`,
        })
        .then((res) =>res.data)
        .catch((res) => {
            throw new Error(res);
        });

export const getLeader = (contestNumber:number) =>
    baseRequest
        .request<contestReturnData<string>>({
            method:"GET",
            url: `/contest/getLeader`,
            data:contestNumber
        })
        .then((res) =>res.data)
        .catch((res) => {
            throw new Error(res);
        });
        
export const updateLeader = (data: {contestNumber:number, leader:string}) =>
        baseRequest
            .request<contestReturnData<any>>({
                method:"POST",
                url: `/contest/updateLeader`,
                data
            })
            .then((res) =>res.data)
            .catch((res) => {
                throw new Error(res);
            });

export const getEndDate = (data:{contestNumber:number}) =>
baseRequest
    .request<contestReturnData<string>>({
        method:"POST",
        url: `/contest/getEndDate`,
        data
    })
    .then((res) =>res.data)
    .catch((res) => {
        throw new Error(res);
    });

export const getAreaOwner = (data:{contestNumber:number,areaName:string}) =>
    baseRequest
        .request<contestReturnData<string>>({
            method:"POST",
            url: `/contest/getAreaOwner`,
            data
        })
        .then((res) =>res.data)
        .catch((res) => {
            throw new Error(res);
        });
export const getArea = (data:{contestNumber:number,areaName:string}) =>
    baseRequest
        .request<contestReturnData<contestArea>>({
            method:"POST",
            url: `/contest/getArea`,
            data
        })
        .then((res) =>res.data)
        .catch((res) => {
            throw new Error(res);
        });

export const updateAreaOwner = (data:{contestNumber:number,areaName:string,owner:string | undefined}) =>
baseRequest
    .request<contestReturnData<any>>({
        method:"POST",
        url: `/contest/updateAreaOwner`,
        data
    })
    .then((res) =>res.data)
    .catch((res) => {
        throw new Error(res);
    });

export const createArea = (data:newArea) =>
baseRequest
    .request<contestReturnData<any>>({
        method:"POST",
        url: `/contest/createArea`,
        data
    })
    .then((res) =>res.data)
    .catch((res) => {
        throw new Error(res);
    });

export const setAreas = (data:{contestNumber:number,areas:contestArea[]}) =>
baseRequest
    .request<contestReturnData<any>>({
        method:"POST",
        url: `/contest/setAreas`,
        data
    })
    .then((res) =>res.data)
    .catch((res) => {
        throw new Error(res);
    });

export const createContest = (data:newContest) =>
baseRequest
    .request<contestReturnData<any>>({
        method:"POST",
        url: `/contest/createContest`,
        data
    })
    .then((res) =>res.data)
    .catch((res) => {
        throw new Error(res);
    });

export const changeContestState = (data: {contestNumber:number, active:boolean}) =>
baseRequest
    .request<contestReturnData<any>>({
        method:"POST",
        url: `/contest/changeContestState`,
        data
    })
    .then((res) =>res.data)
    .catch((res) => {
        throw new Error(res);
    });

export const deleteContest = (data: {contestNumber:number}) =>
    baseRequest
        .request<contestReturnData<any>>({
            method:"POST",
            url: `/contest/clearContest`,
            data
        })
        .then((res) =>res.data)
        .catch((res) => {
            throw new Error(res);
        });
