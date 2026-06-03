import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';
import UserModel from '../src/models/user.model.js';

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

describe('Auth API', () => {
    const validUser = {
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe(validUser.email);
            
            // Check if user is actually created in DB
            const user = await UserModel.findOne({ email: validUser.email });
            expect(user).toBeTruthy();
        });

        it('should fail if email is already registered', async () => {
            await request(app).post('/api/auth/register').send(validUser);
            
            const res = await request(app)
                .post('/api/auth/register')
                .send(validUser);
                
            expect(res.statusCode).toEqual(400);
        });
        
        it('should fail if required fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@example.com' });
                
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Seed a user before testing login
            await request(app).post('/api/auth/register').send(validUser);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: validUser.email,
                    password: validUser.password
                });
                
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            // Assuming the token is returned in a cookie or body, or both
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: validUser.email,
                    password: 'wrongpassword'
                });
                
            expect(res.statusCode).toEqual(400); // Usually 401 or 400
            expect(res.body.success).toBe(false);
        });
        
        it('should fail with unregistered email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    identifier: 'notfound@example.com',
                    password: 'Password123'
                });
                
            expect(res.statusCode).toEqual(400); // Or 404/401
            expect(res.body.success).toBe(false);
        });
    });
});
