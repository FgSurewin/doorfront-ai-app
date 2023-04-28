import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import contest, {contestInterface} from '../database/models/contest'
import { ContestService } from "../services/contest";
import { getAreaInfo, updateArea, updateAreaOwner} from "../types/contest";

/*
function createArea (req:Request,res:Response,next:NextFunction) {
    const area:contestInterface = req.body;

    const newArea = new contest({_id:new mongoose.Types.ObjectId(), area});

    return newArea
        .save()
        .then((newArea) => res.status(201).json({newArea}))
        .catch((error) => res.status(500).json({error}));
};
*/

const contestService = new ContestService();
export default class contestController {

    async createContest(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: contestInterface = req.body;
        await contestService.createContest({req,res,next}, body);
    }
    async createArea (req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: updateArea = req.body;
        await contestService.createArea({req,res,next}, body);
    }

    async updateAreaOwner(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: updateAreaOwner = req.body;
        await contestService.updateAreaOwner({req,res,next}, body);
    }

    async getAreaOwner(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: getAreaInfo= req.body;
        await contestService.getAreaOwner({req,res,next}, body);
    }
    async getArea(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: getAreaInfo= req.body;
        await contestService.getArea({req,res,next}, body);
    }
    async getAreaBonus(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: getAreaInfo = req.body;
        await contestService.getAreaBonus({req,res,next}, body);
    }
    async clearContest(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number} = req.body;
        await contestService.clearContest({req,res,next},body);
    }
    async updateLeader(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number, leader:string} = req.body;
        await contestService.updateLeader({req,res,next},body);
    }

    async getLeader(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number} = req.body;
        await contestService.getLeader({req,res,next},body);
    }
    async getContestState(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number} = req.body;
        await contestService.getContestState({req,res,next},body);
    }
    async getEndDate(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number} = req.body;
        await contestService.getEndDate({req,res,next},body);
    }
    async changeContestState(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number, active:boolean} = req.body;
        await contestService.changeContestState({req,res,next},body);
    }
    async getActiveContest(req:Request,res:Response,next:NextFunction): Promise<void> {
        await contestService.getActiveContest({req,res,next});
    }

    async getAllAreas(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: {contestNumber:number} = req.body
        await contestService.getAllAreas({req,res,next},body);
    }
    
    


}