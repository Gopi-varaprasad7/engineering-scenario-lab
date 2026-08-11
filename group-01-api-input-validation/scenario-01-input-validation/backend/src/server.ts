import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
