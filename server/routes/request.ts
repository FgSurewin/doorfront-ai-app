import {RequestController} from "../controllers/request";
import express from "express";
const route = express.Router();
const requestController = new RequestController();

route.post("/addRequest", requestController.addUser)
route.post("/addLabeler", requestController.addLabeler)
route.get("/getOpenRequests", requestController.getOpenRequests)
route.get("/getUserRequests", requestController.getUserRequests)
export default route;

