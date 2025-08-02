import express from "express";

import cors from "cors";
import { WHITELIST } from "./constants/constants.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: function (origin, callback) {
      if (WHITELIST.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

//define routes

import heathCheckRoute from "./routes/heathCheck.route.js";
import userRoute from "./routes/user.route.js";
app.use(heathCheckRoute);
app.use("/api/v1/users", userRoute);
app.use(errorHandler);
export { app };
