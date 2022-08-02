// import { ModifierInterface } from "./../database/models/collectImage";
import { AppContext } from "../types";
import CollectImageModel, {
  CollectedImageInterface,
} from "../database/models/collectImage";
import {
  AddMultiImagesLabelsBody,
  AddNewHumanLabelsBody,
  GetMultiImageByPano,
  GetMultiImagesByIdsBody,
  UpdateImageBody,
} from "../types/collectedImages";

export class CollectImageService {
  async createImage(ctx: AppContext, body: CollectedImageInterface) {
    const { res } = ctx;
    const newImage = body;
    try {
      const result = await CollectImageModel.create(newImage);
      res.json({
        code: 0,
        message: "Create Image Successfully!",
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

  async updateImage(ctx: AppContext, body: UpdateImageBody) {
    const { res } = ctx;
    try {
      const { imageId, data: imageAttrs } = body;
      if (imageAttrs.url) {
        const result = await CollectImageModel.findOneAndUpdate(
          { image_id: imageId },
          { ...imageAttrs },
          {
            new: true,
            upsert: true,
            rawResult: true, // Return the raw result from the MongoDB driver
          }
        );
        if (result.ok === 1) {
          res.json({
            code: 0,
            message: "AI label image successfully",
            data: result,
          });
        } else {
          res.json({
            code: 4000,
            message: "AI Fail to label",
          });
        }
      } else {
        res.json({
          code: 4000,
          message: "Fail to get image url",
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async deleteImage(ctx: AppContext, imageId: string) {
    const { res } = ctx;
    try {
      const result = await CollectImageModel.deleteOne({ image_id: imageId });
      if (result.deletedCount > 0) {
        res.json({
          code: 0,
          message: "Delete Image Successfully!",
          data: result,
        });
      } else {
        res.json({
          code: 4000,
          message: "Fail to delete the image!",
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async getAllImages(ctx: AppContext): Promise<void> {
    const { res } = ctx;
    try {
      const result: CollectedImageInterface[] =
        await CollectImageModel.find().lean();
      if (result.length > 0) {
        res.json({
          code: 0,
          message: "Get all images successfully",
          data: result,
        });
      } else {
        res.json({
          code: 5000,
          message: "Result is NULL",
          data: null,
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async getMultiImageByIds(
    ctx: AppContext,
    body: GetMultiImagesByIdsBody
  ): Promise<void> {
    const { res } = ctx;
    const { idList } = body;
    try {
      const result: CollectedImageInterface[] = await CollectImageModel.find({
        image_id: { $in: idList },
      }).lean();
      if (result.length > 0) {
        res.json({
          code: 0,
          message: "Get images by panorama id",
          data: result,
        });
      } else {
        res.json({
          code: 5000,
          message: "Result is NULL",
          data: null,
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async getMultiImageByPano(
    ctx: AppContext,
    body: GetMultiImageByPano
  ): Promise<void> {
    const { res } = ctx;
    const { panoId } = body;
    try {
      const result: CollectedImageInterface[] = await CollectImageModel.find({
        pano: panoId,
      }).lean();
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

  /* ------------------------------ Old Function ------------------------------ */
  // async addHumanLabels(ctx: AppContext, body: AddHumanLabelsBody) {
  //   const { res } = ctx;
  //   try {
  //     const { imageId, data } = body;
  //     const result = await CollectImageModel.findOneAndUpdate(
  //       { image_id: imageId },
  //       {
  //         human_labels: data,
  //       },
  //       {
  //         new: true,
  //         upsert: true,
  //         rawResult: true, // Return the raw result from the MongoDB driver
  //       }
  //     );
  //     if (result.ok === 1) {
  //       res.json({
  //         code: 0,
  //         message: "Modify successfully",
  //         data: result,
  //       });
  //     } else {
  //       res.json({
  //         code: 4000,
  //         message: "Fail to modify",
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
  /* ------------------------------ New Function ------------------------------ */
  async addNewHumanLabels(ctx: AppContext, body: AddNewHumanLabelsBody) {
    const { res } = ctx;
    try {
      const { imageId, data } = body;
      const result = await CollectImageModel.findOneAndUpdate(
        { image_id: imageId },
        {
          $push: { human_labels: { $each: [data], $position: 0 } },
        },
        {
          new: true,
          upsert: true,
          rawResult: true, // Return the raw result from the MongoDB driver
        }
      );
      if (result.ok === 1) {
        res.json({
          code: 0,
          message: "Modify successfully",
          data: result,
        });
      } else {
        res.json({
          code: 4000,
          message: "Fail to modify",
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }

  async updateMultiImagesLabels(
    ctx: AppContext,
    body: AddMultiImagesLabelsBody
  ) {
    const { res } = ctx;
    try {
      console.log("updateMultiImagesLabels -> START");
      const imageList = body;
      const bulkOps = imageList.map((image) => {
        return {
          updateOne: {
            filter: {
              image_id: image.image_id,
            },
            // If you were using the MongoDB driver directly, you'd need to do
            // `update: { $set: { field: ... } }` but mongoose adds $set for you
            update: {
              fileName: image.fileName,
              url: image.url,
              model_labels: image.model_labels,
            },
          },
        };
      });
      const result = await CollectImageModel.bulkWrite(bulkOps);
      console.log("updateMultiImagesLabels -> ", result);
      if (result.ok === 1) {
        res.json({
          code: 0,
          message: `Modify successfully -> Documents Updated ${result.modifiedCount}`,
          data: result,
        });
      } else {
        res.json({
          code: 4000,
          message: "Fail to modify",
        });
      }
    } catch (e) {
      const error = new Error(`${e}`);
      res.json({
        code: 5000,
        message: error.message,
      });
    }
  }
}

