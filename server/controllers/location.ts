import { Request, Response, NextFunction } from "express";
import { LocationService } from "../services/location";

const locationService = new LocationService();

export class LocationController {
  async getRandomLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await locationService.getRandomLocation({ req, res, next });
  }
}
