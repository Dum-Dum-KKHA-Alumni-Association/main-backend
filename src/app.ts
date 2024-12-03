import * as dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app: Application = express();

app.use(express.json({ limit: "16kb" })); //accept JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(clerkMiddleware());

// Routes Declaration
app.use("/api/v1/users", userRouter);
// app.use('/api/v1/projects', projectRouter);
// app.use('/api/v1/enquiry', enquiryRouter);
// app.use('/api/v1/projectVisit', projectVisitRouter);

app.get("/", async (req, res) => {
  res.json({ message: "Server is 100% up running" });
});

export default app;
