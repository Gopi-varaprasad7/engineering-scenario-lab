import cors from 'cors';
import 'dotenv/config';
import pool from './config/db';
import app from './app';

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
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
  } catch (error) {
      console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer()
