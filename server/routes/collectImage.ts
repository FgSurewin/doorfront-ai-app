import express from "express";
import { CollectImageController } from "../controllers/collectImage";
import { checkToken } from "../middlewares/user";
const route = express.Router();
const collectImageController = new CollectImageController();

route.post("/createImage", checkToken, collectImageController.createImage);
route.post("/updateImage", checkToken, collectImageController.updateImage);
route.delete("/deleteImage", checkToken, collectImageController.deleteImage);
route.get("/getAllImages", checkToken, collectImageController.getAllImages);
route.get("/getPaginatedImages", checkToken, collectImageController.getPaginatedImages);
route.get("/getUnapprovedLabels", checkToken, collectImageController.getUnapprovedLabels);
route.post(
  "/getMultiImageByIds",
  checkToken,
  collectImageController.getMultiImageByIds
);
route.post(
  "/getMultiImageByPano",
  checkToken,
  collectImageController.getMultiImageByPano
);
/* ------------------------------ Old Function ------------------------------ */
// route.post(
//   "/addHumanLabels",
//   checkToken,
//   collectImageController.addHumanLabels
// );
/* ------------------------------ New Function ------------------------------ */
route.post(
  "/addNewHumanLabels",
  checkToken,
  collectImageController.addNewHumanLabels
);

export default route;
