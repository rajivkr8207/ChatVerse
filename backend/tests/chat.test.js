import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';
import UserModel from '../src/models/user.model.js';
import ChatModel from '../src/models/chat.model.js';
import config from '../src/config/config.js';
import jwt from 'jsonwebtoken';

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

describe('Chat API', () => {
    let token;
    let userId;

    beforeEach(async () => {
        // Create a user and generate a token
        const user = await UserModel.create({
            fullName: 'Chat User',
            username: 'chatuser',
            email: 'chat@example.com',
            password: 'Password123'
        });
        userId = user._id;
        token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('POST /api/chat/new', () => {
        it('should create a new chat', async () => {
            const res = await request(app)
                .post('/api/chat/new')
                .set('Cookie', [`chatverse_access_token=${token}`]);
                
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.chat.user.toString()).toBe(userId.toString());
        });
        
        it('should fail without authentication', async () => {
            const res = await request(app)
                .post('/api/chat/new');
                
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/chat/', () => {
        it('should fetch all chats for user', async () => {
            // Seed a chat
            await ChatModel.create({ user: userId, title: 'My test chat' });
            
            const res = await request(app)
                .get('/api/chat/')
                .set('Cookie', [`chatverse_access_token=${token}`]);
                
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data.chats)).toBe(true);
            expect(res.body.data.chats.length).toBe(1);
        });
    });
    
    describe('DELETE /api/chat/:chatid', () => {
        it('should delete a chat by id', async () => {
            const chat = await ChatModel.create({ user: userId, title: 'Delete me' });
            
            const res = await request(app)
                .delete(`/api/chat/${chat._id}`)
                .set('Cookie', [`chatverse_access_token=${token}`]);
                
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBe("Chat deleted successfully");
            
            const findChat = await ChatModel.findById(chat._id);
            expect(findChat).toBeNull();
        });
    });
});
