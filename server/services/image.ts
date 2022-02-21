import { AppContext, ImageField } from "../types";
import ImageModel, {
  ImageInterface,
  LabelInterface,
} from "../database/models/image";

export class ImageService {
  // async getAllImages(ctx: AppContext): Promise<void> {
  //   const { res } = ctx;
  //   try {
  //     const result: ImageInterface[] = await ImageModel.find();
  //     res.json({
  //       code: 0,
  //       message: "Get all images",
  //       data: result,
  //     });
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }
  // async getImageByPano(ctx: AppContext, panoId: string): Promise<void> {
  //   const { res } = ctx;
  //   try {
  //     const result: ImageInterface[] = await ImageModel.find({ pano: panoId });
  //     if (result.length > 0) {
  //       res.json({
  //         code: 0,
  //         message: "Get images by panorama id",
  //         data: result,
  //       });
  //     } else {
  //       res.json({
  //         code: 5000,
  //         message: "Result is NULL",
  //         data: null,
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }
  // async getImageById(ctx: AppContext, id: string): Promise<void> {
  //   const { res } = ctx;
  //   try {
  //     const result: ImageInterface | null = await ImageModel.findOne({
  //       _id: id,
  //     });
  //     if (result) {
  //       await this.trigger(true, result._id);
  //       res.json({
  //         code: 0,
  //         message: "Get one image by _id",
  //         data: result,
  //       });
  //     } else {
  //       res.json({
  //         code: 2000,
  //         message: "Result is NULL",
  //         data: result,
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }
  // async getRandomImageList(ctx: AppContext): Promise<void> {
  //   const { res } = ctx;
  //   try {
  //     const collections: ImageInterface[] = await ImageModel.find({
  //       isLabeled: false,
  //       count: { $lt: 3 },
  //     });
  //     if (collections.length === 0) {
  //       res.json({
  //         code: 4000,
  //         message: "All images has been labeled!",
  //         data: null,
  //       });
  //     } else {
  //       const random = Math.floor(Math.random() * collections.length);
  //       const pano: string = collections[random].pano;
  //       const result: ImageInterface[] = await ImageModel.find({ pano });
  //       res.json({
  //         code: 0,
  //         message: "Get images randomly",
  //         data: result,
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }
  // async getRandomImage(ctx: AppContext): Promise<void> {
  //   const { res } = ctx;
  //   try {
  //     const collections: ImageInterface[] = await ImageModel.find({
  //       isLabeled: false,
  //       count: { $lt: 3 },
  //     });
  //     if (collections.length === 0) {
  //       res.json({
  //         code: 4000,
  //         message: "All images has been labeled!",
  //         data: null,
  //       });
  //     } else {
  //       const random = Math.floor(Math.random() * collections.length);
  //       const result = collections[random];
  //       res.json({
  //         code: 0,
  //         message: "Get one random image ",
  //         data: result,
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }
  // async trigger(labeled: boolean, id: string): Promise<boolean> {
  //   let result: boolean = false;
  //   try {
  //     await ImageModel.updateOne({ _id: id }, { isLabeled: labeled });
  //     result = true;
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //   }
  //   return result;
  // }
  // async toggle(ctx: AppContext, labeled: boolean, id: string): Promise<void> {
  //   const { res } = ctx;
  //   const result: boolean = await this.trigger(labeled, id);
  //   if (result) {
  //     res.json({
  //       code: 0,
  //       message: "Toggle Successfully",
  //     });
  //   } else {
  //     res.json({
  //       code: 5000,
  //       message: "Toggle Failed - Invalid ID",
  //     });
  //   }
  // }
  // async addLabelArea(
  //   ctx: AppContext,
  //   labels: LabelInterface[],
  //   id: string,
  //   field: ImageField,
  //   count: number
  // ): Promise<void> {
  //   const { res } = ctx;
  //   try {
  //     const { ok } = await ImageModel.updateOne(
  //       { _id: id },
  //       { [field]: labels, labeled_area: labels, count }
  //     );
  //     const result = await ImageModel.findOne({ _id: id });
  //     if (ok === 1) {
  //       res.json({
  //         code: 0,
  //         message: "Add Successfully",
  //         data: result,
  //       });
  //     } else {
  //       res.json({
  //         code: 4000,
  //         message: "Field name is invalid",
  //       });
  //     }
  //   } catch (e) {
  //     const error = new Error(`${e}`);
  //     res.json({
  //       code: 5000,
  //       message: error.message,
  //     });
  //   }
  // }
}
