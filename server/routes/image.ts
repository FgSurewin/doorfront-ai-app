import express from "express";
import { ImageController } from "../controllers/image";
import { checkToken } from "../middlewares/user";
const route = express.Router();
const imageController = new ImageController();

// route.get("/test", imageController.test);
// route.get("/getAll", checkToken, imageController.getAllImages);
// route.get("/getRanList", checkToken, imageController.getRandomImageList);
// route.get("/getRandomImage", checkToken, imageController.getRandomImage);
// route.get(
//   "/getImagesByPano/:panoId",
//   checkToken,
//   imageController.getImageByPano
// );
// route.get("/getOneById/:Id", checkToken, imageController.getImageById);
// route.post("/toggle", checkToken, imageController.toggle);
// route.post("/addLabelArea", checkToken, imageController.addLabelArea);

export default route;
