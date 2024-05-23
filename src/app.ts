import express from "express";

import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";

// api's routes imports
import userRoute from "./routes/user.js";
import { helloWorld } from "./utils/hello-world.js";

config({
  path: "./.env",
});

const uri = process.env.MONGODB_URI || "";
const port = process.env.PORT || 4000;

connectDB(uri);
const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: true,
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// using route
app.use(helloWorld);
app.use("/api/user", userRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`listening on ${process.env.APP_BASE_URL}`);
});
