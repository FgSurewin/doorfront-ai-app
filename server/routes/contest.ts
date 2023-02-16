import express from "express";
import ContestController from "../controllers/contest";
const route = express.Router();
const contestController = new ContestController();

route.post("/createArea", contestController.createArea)
route.post("/updateArea",contestController.updateArea)
route.get("/getAreaOwner", contestController.getAreaOwner)
route.get("/getAreaBonus",contestController.getAreaBonus)
route.post("/clearContest", contestController.clearContest)

export default route