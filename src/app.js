import express from "express";
import cors from "cors";
import { ACCESS_TOKEN_SECRET, WHITELIST } from "./constants/constants.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import rateLimit from "express-rate-limit";
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

app.use(cookieParser(ACCESS_TOKEN_SECRET));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: (req, _res) => (req.user ? 100 : 10),
  standardHeaders: "draft-8",
  legacyHeaders: true,
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
  message: "True many requests from this IP, please try again after 15 minutes.",
  keyGenerator: (req) => req.ip,
});

app.use("/api/v1", limiter);

//define routes

import heathCheckRoute from "./routes/heathCheck.route.js";
import userRoute from "./routes/user.route.js";
import categoryRoute from "./routes/category.route.js";
import subcategoryRoute from "./routes/subcategory.route.js";

app.use("/api/v1", heathCheckRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1", categoryRoute);
app.use("/api/v1", subcategoryRoute);
app.use(errorHandler);

export { app };
