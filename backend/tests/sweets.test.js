const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');

describe('Sweets Endpoints', () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'regularuser',
        password: 'password123'
      });
    userToken = userResponse.body.token;

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'adminuser',
        password: 'password123',
        isAdmin: true
      });
    adminToken = adminResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet as admin', async () => {
      const sweetData = {
        name: 'Chocolate Cake',
        category: 'Cakes',
        price: 15.99,
        quantity: 10
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.name).toBe(sweetData.name);
      expect(response.body.category).toBe(sweetData.category);
      expect(response.body.price).toBe(sweetData.price);
      expect(response.body.quantity).toBe(sweetData.quantity);
    });

    it('should not create sweet as regular user', async () => {
      const sweetData = {
        name: 'Vanilla Cake',
        category: 'Cakes',
        price: 12.99,
        quantity: 5
      };

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);
    });

    it('should not create sweet without authentication', async () => {
      const sweetData = {
        name: 'Strawberry Cake',
        category: 'Cakes',
        price: 14.99,
        quantity: 8
      };

      await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);
    });

    it('should not create sweet with missing fields', async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Incomplete Sweet' })
        .expect(400);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet 1',
          category: 'Candies',
          price: 5.99,
          quantity: 20
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Sweet 2',
          category: 'Chocolates',
          price: 8.99,
          quantity: 15
        });
    });

    it('should get all sweets when authenticated', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should not get sweets without authentication', async () => {
      await request(app)
        .get('/api/sweets')
        .expect(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Test')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Candies')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=5&maxPrice=10')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweetResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Purchasable Sweet',
          category: 'Test',
          price: 10.00,
          quantity: 5
        });
      sweetId = sweetResponse.body.id;
    });

    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.message).toContain('Successfully purchased');
      expect(response.body.sweet.quantity).toBe(3);
    });

    it('should not purchase more than available quantity', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(400);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweetResponse = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Restockable Sweet',
          category: 'Test',
          price: 10.00,
          quantity: 5
        });
      sweetId = sweetResponse.body.id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 10 })
        .expect(200);

      expect(response.body.message).toContain('Successfully restocked');
      expect(response.body.sweet.quantity).toBe(15);
    });

    it('should not restock sweet as regular user', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(403);
    });
  });
});

