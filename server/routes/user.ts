import express from "express";
import { UserController } from "../controllers/user";
const route = express.Router();
const userController = new UserController();

// route.get("/test", imageController.test);

route.post("/addUser", userController.addUser);
route.post("/login", userController.login);
route.post("/getUnLabelImageList", userController.getUnLabelImageList);
route.post("/addLabelImage", userController.addLabelImage);
route.post("/deleteLabelImage", userController.deleteLabelImage);
route.post("/addUnLabelImage", userController.addUnLabelImage);
route.post("/deleteUnLabelImage", userController.deleteUnLabelImage);

route.post("/addCredit", userController.addCredit);
route.post("/addLabelCredit", userController.addLabelCredit);
route.post("/getUserScore", userController.getUserScore);
route.post("/addBonusCredit", userController.addBonusCredit);
route.get("/getAllUsers", userController.getAllUsers);

// route.post("/addImages", userController.updateImage);
// route.post("/addCreateCredit", userController.addCreateCredit);
// route.post("/addReviewCredit", userController.addReviewCredit);
// route.post("/addValidateCredit", userController.addValidateCredit);
// route.post("/addNumberByType", userController.addNumberByType);

export default route;
