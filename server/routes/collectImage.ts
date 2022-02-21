import express from "express";
import { CollectImageController } from "../controllers/collectImage";
import { checkToken } from "../middlewares/user";
const route = express.Router();
const collectImageController = new CollectImageController();

route.post("/createImage", checkToken, collectImageController.createImage);
route.post("/updateImage", checkToken, collectImageController.updateImage);
route.delete("/deleteImage", checkToken, collectImageController.deleteImage);
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
route.post(
  "/addHumanLabels",
  checkToken,
  collectImageController.addHumanLabels
);
// route.get(
//   "/getImagesByPano/:panoId",
//   checkToken,
//   collectImageController.getImageByPano
// );
// route.get("/getOneById/:Id", checkToken, collectImageController.getImageById);
// route.post("/toggle", checkToken, collectImageController.toggle);
// route.post("/addCount", checkToken, collectImageController.addCount);
// route.post("/clearCount", checkToken, collectImageController.clearCount);
// route.post("/addModifier", checkToken, collectImageController.addModifier);
// route.post(
//   "/addMarkers",
//   checkToken,
//   collectImageController.addStreetViewMarkers
// );

export default route;
