import { AppContext } from "../types";
import LocationModel, { LocationModelType } from "../database/models/location";

export class LocationService {
  async getRandomLocation(ctx: AppContext) {
    const { res } = ctx;
    try {
      const locationList: LocationModelType[] =
        await LocationModel.find().lean();
      const result =
        locationList[Math.floor((Math.random() * 10) % locationList.length)];
      res.json({
        code: 0,
        message: "Get images by panorama id",
        data: result,
      });
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }
}
