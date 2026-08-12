import express from 'express';
import usersRouter from "./routes/user.routes";

const app = express();

app.use(express.json());

app.use("/api/users", usersRouter);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

export default app;