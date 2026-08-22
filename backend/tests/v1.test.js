const request = require('supertest');
const express = require('express');


const app = express();
app.use(express.json());


jest.setTimeout(15000);


app.use('/api/v1', require('../src/routes/v1'));

describe('v1 Architecture Integration Tests (Supertest)', () => {

  // 1. Auth Endpoint Test
  describe('POST /api/v1/auth/login', () => {
    it('should respond to login attempts on v1 architecture', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });


      expect(res.statusCode).not.toEqual(404);
    });
  });

  // 2. Materials Endpoint Test
  describe('GET /api/v1/materials', () => {
    it('should exist under v1 architecture', async () => {
      const res = await request(app).get('/api/v1/materials');
      expect(res.statusCode).not.toEqual(404);
    });
  });

  // 3. Tasks Endpoint Test
  describe('GET /api/v1/tasks', () => {
    it('should exist under v1 architecture', async () => {
      const res = await request(app).get('/api/v1/tasks');
      expect(res.statusCode).not.toEqual(404);
    });
  });

});