import express from "express";
import bodyParser from "body-parser";
import imageRoute from "./routes/image";
import userRoute from "./routes/user";
import collectImageRoute from "./routes/collectImage";
import locationRoute from "./routes/location";
import mongoose from "mongoose";
import nunjucks from "nunjucks";
import morgan from "morgan";
// import cors from "cors";
import { config, databaseLink } from "./database";

(async function () {
  const app = express();
  const PORT = process.env.PORT || 8080;
  // Read static files
  app.use(express.static("./server/public"));

  // Template engine
  nunjucks.configure("server/views", {
    autoescape: true,
    express: app,
  });

  // Initialize Middleware
  // app.use(cors());
  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Initialize Routes
  app.use("/api/image", imageRoute);
  app.use("/api/user", userRoute);
  app.use("/api/collectImage", collectImageRoute);
  app.use("/api/location", locationRoute);

  // MongoDB Connection
  try {
    await mongoose.connect(config.link!, config.options);
    console.log("Connect to the MongoDB successfully!");
    console.log("DB LINK -> ", databaseLink);
  } catch (error) {
    console.log(new Error(`${error}`));
  }

  // Render HTML
  app.use(async (req, res, next) => {
    await next();
    res.render("index.html");
  });

  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
})();
