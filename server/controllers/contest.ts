import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import contest, {contestArea,contestInterface} from '../database/models/contest'
import { ContestService } from "../services/contest";
import { updateArea } from "../types/contest";

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
    async createArea (req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: contestArea = req.body;
        await contestService.createArea({req,res,next}, body);
    }

    async updateArea(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: updateArea = req.body;
        await contestService.updateArea({req,res,next}, body);
    }

    async getAreaOwner(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: updateArea = req.body;
        await contestService.getAreaOwner({req,res,next}, body);
    }
    async getAreaBonus(req:Request,res:Response,next:NextFunction): Promise<void> {
        const body: updateArea = req.body;
        await contestService.getAreaBonus({req,res,next}, body);
    }
    async clearContest(req:Request,res:Response,next:NextFunction): Promise<void> {
        await contestService.clearContest({req,res,next});
    }




}