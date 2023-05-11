import express from "express";
import ContestController from "../controllers/contest";
const route = express.Router();
const contestController = new ContestController();


route.post("/createContest", contestController.createContest)
route.post("/createArea", contestController.createArea)
route.post("/updateAreaOwner",contestController.updateAreaOwner)
route.post("/getAreaOwner", contestController.getAreaOwner)
route.get("/getAreaBonus",contestController.getAreaBonus)
route.post("/clearContest", contestController.clearContest)
route.post("/updateLeader",contestController.updateLeader)
route.post("/changeContestState",contestController.changeContestState)
route.get("/getLeader",contestController.getLeader)
route.get("/getContestState",contestController.getContestState)
route.post("/getEndDate", contestController.getEndDate)
route.get("/getActiveContest",contestController.getActiveContest)
route.get("/getAllAreas",contestController.getAllAreas)
route.post("/getArea",contestController.getArea)
route.post("/setAreas",contestController.setAreas)

export default route