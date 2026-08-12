import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../app';
import pool from '../config/db';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', [
      'testuser123@gmail.com',
    ]);
  });
  it('should create a new user', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'Test',
      email: 'testuser123@gmail.com',
      age: 25,
      password: 'Password123!',
    });

    console.log('STATUS:', response.status);
    console.log('BODY:', response.body);
    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe('User created successfully');

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('Test User');
    expect(response.body.data.email).toBe('testuser123@gmail.com');
    expect(response.body.data.age).toBe(25);

    expect(response.body.data).not.toHaveProperty('password');

    expect(response.body.data).not.toHaveProperty('password_hash');
  });
});
