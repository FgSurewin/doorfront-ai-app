import { Request, Response, NextFunction } from "express";
import {RequestService} from "../services/request";

const requestService = new RequestService();
export class RequestController {
  async addUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    await requestService.addRequest({req,res,next}, body);
  }

  async addLabeler (req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    await requestService.addLabeler({req,res,next}, body);
  }

  async getOpenRequests (req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    await requestService.getOpenRequests({req,res,next});
  }

  async getUserRequests (req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body;
    await requestService.getUserRequests({req,res,next}, body)
  }
}