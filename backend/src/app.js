import express from "express";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://apti-app.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// user routes
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).send("SERVER IS RUNNING");
});

export { app };
