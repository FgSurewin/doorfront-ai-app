import express from "express";
import { LocationController } from "./../controllers/location";

const locationController = new LocationController();
const route = express.Router();

route.get("/getRandomLocation", locationController.getRandomLocation);

export default route;
