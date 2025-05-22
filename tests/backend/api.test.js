const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongoose-memory-server');
const app = require('../../server');  // Import the Express app

let mongoServer;

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(uri, mongooseOpts);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe('Complexity API Endpoints', () => {
  // Test for analyzing code
  test('POST /api/complexity/analyze should analyze code complexity', async () => {
    const response = await request(app)
      .post('/api/complexity/analyze')
      .send({
        code: `
        #include <iostream>

        int main() {
            int n = 10;
            for (int i = 0; i < n; i++) {
                std::cout << i << std::endl;
            }
            return 0;
        }
        `
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('timeComplexity');
    expect(response.body).toHaveProperty('spaceComplexity');
    expect(response.body.timeComplexity).toEqual('O(n)');

    // Check that it was stored in the database
    const historyResponse = await request(app).get('/api/complexity/history');
    expect(historyResponse.statusCode).toBe(200);
    expect(historyResponse.body.length).toBeGreaterThan(0);
    expect(historyResponse.body[0]).toHaveProperty('timeComplexity', 'O(n)');
  });

  // Test error handling - empty code
  test('POST /api/complexity/analyze should return error for empty code', async () => {
    const response = await request(app)
      .post('/api/complexity/analyze')
      .send({ code: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Code is required');
  });

  // Test history endpoint
  test('GET /api/complexity/history should return analysis history', async () => {
    // First make sure we have at least one record
    await request(app)
      .post('/api/complexity/analyze')
      .send({
        code: `
        #include <iostream>

        int main() {
            std::cout << "Hello, World!" << std::endl;
            return 0;
        }
        `
      });

    const response = await request(app).get('/api/complexity/history');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('code');
      expect(response.body[0]).toHaveProperty('timeComplexity');
      expect(response.body[0]).toHaveProperty('spaceComplexity');
      expect(response.body[0]).toHaveProperty('createdAt');
    }
  });
});
