import { contestInterface } from "../database/models/contest";

export type updateArea = {
    contestNumber: Number;
    areaName: string;
    data: Partial<contestInterface>;
}