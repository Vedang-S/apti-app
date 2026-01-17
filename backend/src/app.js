import express from "express";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://apti-app.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isLocalhost = origin.startsWith("http://localhost");
    const isVercel = origin.endsWith(".vercel.app");

    if (isLocalhost || isVercel) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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
