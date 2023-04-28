import { contestArea} from "../database/models/contest";

export type updateArea = {
    contestNumber: number;
    area: contestArea;
}

export type getAreaInfo = {
    contestNumber:number;
    areaName:string;
}


export type updateAreaOwner = {
    contestNumber: number;
    areaName: string;
    owner: string | undefined;
}