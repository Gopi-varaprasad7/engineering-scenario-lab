import { Router } from 'express';
import pool from '../config/db';
import bcrypt from 'bcrypt';
import { validateCreateUser } from '../validators/user.validator';
import { DatabaseError } from '../types/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,name,email,age,created_at,updated_at FROM users ORDER BY id;`,
    );
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    const validation = validateCreateUser({ name, email, age, password });

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
            INSERT INTO users (name, email, age, password_hash) VALUES  ($1, $2, $3, $4) RETURNING id, name, email, age, created_at, updated_at;`,
      [name, email, age, passwordHash],
    );
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.log('Failed to create user', error);

    const dbError = error as DatabaseError;

    if (dbError.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
