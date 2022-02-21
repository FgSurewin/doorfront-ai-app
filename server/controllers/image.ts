import { Request, Response, NextFunction } from "express";
import { TEST_CONTEXT } from "../database";
import ImageModel, { ImageInterface } from "../database/models/image";
import { ImageService } from "../services/image";
import { ImageBody, ImageParams } from "../types";
import { getField } from "../utils/image";

const imageService = new ImageService();
export class ImageController {
  // async getAllImages(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   await imageService.getAllImages({ req, res, next });
  // }
  // async getImageByPano(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { panoId }: ImageParams = req.params;
  //   if (panoId) await imageService.getImageByPano({ req, res, next }, panoId);
  //   else
  //     res.json({
  //       code: 6000,
  //       message: "params is invalid.",
  //     });
  // }
  // async getImageById(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { Id }: ImageParams = req.params;
  //   if (Id) await imageService.getImageById({ req, res, next }, Id);
  //   else
  //     res.json({
  //       code: 6000,
  //       message: "params is invalid.",
  //     });
  // }
  // async getRandomImageList(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   await imageService.getRandomImageList({ req, res, next });
  // }
  // async getRandomImage(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   await imageService.getRandomImageList({ req, res, next });
  // }
  // async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   const { labeled, id }: ImageBody = req.body;
  //   if (id) {
  //     await imageService.toggle({ req, res, next }, labeled!, id);
  //   } else
  //     res.json({
  //       code: 6000,
  //       message: "Post body is invalid.",
  //     });
  // }
  // async addLabelArea(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { labelArea, id }: ImageBody = req.body;
  //   const result: ImageInterface | null = await ImageModel.findById({
  //     _id: id,
  //   });
  //   if (result) {
  //     if (labelArea && id && result.count < 3) {
  //       const newCount = result.count + 1;
  //       const newField = getField(newCount);
  //       await imageService.addLabelArea(
  //         { req, res, next },
  //         labelArea,
  //         id,
  //         newField,
  //         newCount
  //       );
  //     } else {
  //       res.json({
  //         code: 6000,
  //         message: "Post body is invalid OR count is larger than 3.",
  //       });
  //     }
  //   } else {
  //     res.json({
  //       code: "6000",
  //       message: "Image ID is invalid.",
  //     });
  //   }
  // }
  // async test(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   res.json({
  //     message: TEST_CONTEXT,
  //   });
  // }
}
