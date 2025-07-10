// import { ModifierInterface } from "./../database/models/collectImage";
import { AppContext, FilteringContext } from "../types";
import CollectImageModel, {
  CollectedImageInterface,
} from "../database/models/collectImage";
import {
  AddHumanLabelsBody,
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

  async getFilteredImages(ctx: FilteringContext): Promise<void> {
  const { res, query } = ctx;

  // Use limit and skip from query, with safe parsing and defaults
  const limitNumber = Math.min(parseInt(query.limit as string, 10) || 16, 100); // max 100
  const skip = parseInt(query.skip as string, 10) || 0;

  // Build filter object based on query params
  const filter: Record<string, any> = {};

  if (query.searchType === "creator" && query.searchQuery) {
    filter.creator = { $regex: new RegExp(query.searchQuery, "i") };
  }

  if (query.searchType === "labledBy" && query.searchQuery) {
    filter["human_labels.name"] = { $regex: new RegExp(query.searchQuery, "i") };
  }

  if (query.searchType === "address" && query.addressFilter) {
    filter.address = { $regex: new RegExp(query.addressFilter, "i") };
  }

  try {
    const [images, total] = await Promise.all([
      CollectImageModel.find(filter)
        .sort({ createdAt: -1 })  // add sorting for consistent pagination
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      CollectImageModel.countDocuments(filter),
    ]);

    res.status(200).json({
      code: 0,
      message: `Fetched ${images.length} filtered images successfully`,
      data: images,
      pagination: {
        total,
        limit: limitNumber,
        skip,
        hasMore: skip + images.length < total,
      },
    });
  } catch (e) {
    console.error("Error fetching filtered images:", e);
    res.status(500).json({
      code: 5000,
      message: "Internal server error while filtering",
      error: e instanceof Error ? e.message : String(e),
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

  async getPaginatedImages(ctx: AppContext): Promise<void> {
    const { req, res } = ctx;

    // Parse and limit pagination params safely
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100); // max 100 items per page
    const skip = parseInt(req.query.skip as string) || 0;

    try {
      // Fetch images and total count concurrently for efficiency
      const [images, total] = await Promise.all([
        CollectImageModel.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        CollectImageModel.countDocuments(),
      ]);

      res.status(200).json({
        code: 0,
        message: `Fetched ${images.length} images successfully`,
        data: images,
        pagination: {
          total, // total number of images in DB
          limit, // current page limit
          skip, // current offset
          hasMore: skip + images.length < total, // true if more data available
        },
      });
    } catch (e) {
      console.error("Error fetching images:", e);

      res.status(500).json({
        code: 5000,
        message: "Internal server error",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  async getUnapprovedLabels(ctx: AppContext) {
    const { req, res } = ctx;

    const nickname = req.query.nickname as string;
    const minLabels = parseInt(req.query.minLabels as string) || 3;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const skip = parseInt(req.query.skip as string) || 0;
    const chunkSize = 100;

    try {
      if (!nickname) {
        return res.status(400).json({
          code: 4001,
          message: "Missing required 'nickname' or 'name' parameter",
        });
      }

      const filtered: any[] = [];
      let offset = skip;
      let totalChecked = 0;
      let hasMore = true;

      while (filtered.length < limit && hasMore) {
        const images = await CollectImageModel.find()
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(chunkSize)
          .lean();

        totalChecked += images.length;
        offset += chunkSize;

        if (images.length === 0) {
          hasMore = false;
          break;
        }

        for (const image of images) {
          const labeledBy = image.human_labels.map((h) =>
            (h.name || "").trim().toLowerCase()
          );

          if (labeledBy.includes(nickname.trim().toLowerCase())) {
            continue; // skip already labeled
          }

          // skip if too few labels or sample image or no labels
          if (
            image.human_labels.length <= minLabels ||
            image.image_id === "GuildTourSample" ||
            image.human_labels.length === 0
          ) {
            continue;
          }

          // check incomplete door label (in first labeler only, as in frontend)
          let incompleteDoor = false;
          if (image.human_labels.length > 0) {
            const labels = image.human_labels[0].labels || [];
            for (const label of labels) {
              if (label.label === "door" && label.subtype === "") {
                incompleteDoor = true;
                break;
              }
            }
          }

          // skip if too many labels and no incomplete door
          const maxModifier = 5; // or whatever your logic uses
          if (image.human_labels.length >= maxModifier && !incompleteDoor) {
            continue;
          }

          filtered.push(image);
          if (filtered.length >= limit) {
            hasMore = true;
            break;
          }
        }
      }

      res.status(200).json({
        code: 0,
        message: `Filtered ${filtered.length} images`,
        data: filtered,
        pagination: {
          skip,
          limit,
          hasMore,
          totalChecked,
          returned: filtered.length,
        },
      });
    } catch (e) {
      console.error("Error filtering paginated images:", e);
      res.status(500).json({
        code: 5000,
        message: "Internal server error",
      });
    }
  }
}
