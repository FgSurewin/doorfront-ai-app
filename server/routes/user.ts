import express from "express";
import { UserController } from "../controllers/user";
const route = express.Router();
const userController = new UserController();

// route.get("/test", imageController.test);

route.post("/addUser", userController.addUser);
route.post("/login", userController.login);
route.post("/reset", userController.reset);
route.post("/getUnLabelImageList", userController.getUnLabelImageList);

/* ------------------------ New Action List Functions ----------------------- */
route.post("/saveImageToDiffList", userController.saveImageToDiffList);
route.post("/deleteImageFromList", userController.deleteImageFromList);

/* -------------------------------------------------------------------------- */
// route.post("/addLabelImage", userController.addLabelImage);
// route.post("/deleteLabelImage", userController.deleteLabelImage);
// route.post("/addUnLabelImage", userController.addUnLabelImage);
// route.post("/deleteUnLabelImage", userController.deleteUnLabelImage);
/* -------------------------------------------------------------------------- */

route.post("/addCredit", userController.addCredit);
route.post("/addLabelCredit", userController.addLabelCredit);
route.post("/getUserScore", userController.getUserScore);
route.post("/addBonusCredit", userController.addBonusCredit);
route.get("/getAllUsers", userController.getAllUsers);

route.post("/getContestScore",userController.getContestScore);
route.post("/updateContestScore", userController.updateContestScore)
route.post("/updateContestStats",userController.updateContestStats)
route.post("/resetContestScore",userController.resetContestScore)
route.post("/getAreaScore",userController.getAreaScore)
route.post("/getNickname",userController.getNickname)
route.post("/getReferrer",userController.getReferrer)
route.post("/getReferralCode",userController.getReferralCode)
route.post("/getAllReferredUsers",userController.getAllReferredUsers)
route.post("/updateReferredUserBonus",userController.updateReferredUserBonus)
route.post("/getAllContestUsersInfo",userController.getAllContestUsersInfo)
route.get("/getUserAccessLevel/:userId", userController.getUserAccessLevel);
route.post("/searchUserByNameOrEmail", userController.searchUserByNameOrEmail);
route.post("/grantAdminRight", userController.grantAdminRight);
route.post("/revokeAdminRight", userController.revokeAdminRight);
route.post("/fetchAllAdmins", userController.fetchAllAdmins);
route.post("/addCertifiedHours", userController.addCertifiedHours);


// route.post("/addImages", userController.updateImage);
// route.post("/addCreateCredit", userController.addCreateCredit);
// route.post("/addReviewCredit", userController.addReviewCredit);
// route.post("/addValidateCredit", userController.addValidateCredit);
// route.post("/addNumberByType", userController.addNumberByType);

export default route;
