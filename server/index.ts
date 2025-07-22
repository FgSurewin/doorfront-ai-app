// import express from "express";
// import bodyParser from "body-parser";
// import imageRoute from "./routes/image";
// import userRoute from "./routes/user";
// import contestRoute from "./routes/contest"
// import mailerRoute from "./routes/mailer"
// import collectImageRoute from "./routes/collectImage";
// import locationRoute from "./routes/location";
// import requestRoute from "./routes/request";
// import mongoose from "mongoose";
// import nunjucks from "nunjucks";
// import morgan from "morgan";
// // import cors from "cors";
// import { config, databaseLink } from "./database";

// (async function () {
//   const app = express();
//   const PORT = process.env.PORT || 8080;
//   // Read static files
//   app.use(express.static("./server/public"));

//   // Template engine
//   nunjucks.configure("server/views", {
//     autoescape: true,
//     express: app,
//   });

//   // Initialize Middleware
//   // app.use(cors());
//   app.use(morgan("dev"));
//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: false }));

//   // Initialize Routes
//   app.use("/api/image", imageRoute);
//   app.use("/api/user", userRoute);
//   app.use("/api/collectImage", collectImageRoute);
//   app.use("/api/location", locationRoute);
//   app.use("/api/contest",contestRoute)
//   app.use("/api/mailer",mailerRoute)
//   app.use("/api/request", requestRoute)

//   // MongoDB Connection
//   try {
//     await mongoose.connect(config.link!, config.options);
//     console.log("Connect to the MongoDB successfully!");
//     console.log("Connected to database:", mongoose.connection.name); 
//     console.log("DB LINK -> ", databaseLink);
//   } catch (error) {
//     console.log(new Error(`${error}`));
//   }

//   // Render HTML
//   app.use(async (req, res, next) => {
//     await next();
//     res.render("index.html");
//   });

//   app.listen(PORT, () =>
//     console.log(`Server is running on http://localhost:${PORT}`)
//   );
// })();


import express from "express";
import { Request } from 'express';
import bodyParser from "body-parser";
import imageRoute from "./routes/image";
import userRoute from "./routes/user";
import contestRoute from "./routes/contest";
import mailerRoute from "./routes/mailer";
import collectImageRoute from "./routes/collectImage";
import locationRoute from "./routes/location";
import requestRoute from "./routes/request";
import mongoose from "mongoose";
import nunjucks from "nunjucks";
import morgan from "morgan";
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';
import { config, databaseLink } from "./database";
import configRoute from './routes/config'

(async function () {
  const app = express();
  const PORT = process.env.PORT || 8080;

  // Read static files
  app.use(express.static("build"));
  app.use('/api', configRoute);
  // Template engine
  nunjucks.configure("server/views", {
    autoescape: true,
    express: app,
  });

  // Initialize Middleware
  const allowedOrigins = [
  "http://localhost:3000", 
  "https://doorfront.org", 
];
  // Add CORS middleware here
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }));

  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Initialize Routes
  app.use("/api/image", imageRoute);
  app.use("/api/user", userRoute);
  app.use("/api/collectImage", collectImageRoute);
  app.use("/api/location", locationRoute);
  app.use("/api/contest", contestRoute);
  app.use("/api/mailer", mailerRoute);
  app.use("/api/request", requestRoute);

  // MongoDB Connection
  try {
    await mongoose.connect(config.link!, config.options);
    console.log("Connect to the MongoDB successfully!");
    console.log("Connected to database:", mongoose.connection.name);
    console.log("DB LINK -> ", databaseLink);
  } catch (error) {
    console.log(new Error(`${error}`));
  }

  // Serve index.html for all other requests (Single Page App fallback)
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "build" });
  });

  app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
})();
