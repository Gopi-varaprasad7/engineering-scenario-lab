import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './config/db';
import usersRouter from "./routes/user.routes"

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

pool
  .query('SELECT NOW()')
  .then((res) => {
    console.log('Database connected', res.rows[0]);
  })
  .catch((error) => {
    console.log('Database connection failed', error);
  });
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use("/api/users", usersRouter)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
