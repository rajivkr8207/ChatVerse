import express from 'express';
import {
    getDashboard,
    getUsers,
    getUserDetails,
    getEditUser,
    postEditUser,
    banUser,
    unbanUser,
    verifyUser,
    deleteUser,
    getAnalytics,
} from '../controllers/admin.controller.js';

const AdminRouter = express.Router();

// ─── Dashboard ──────────────────────────────────────────────────────────────
AdminRouter.get('/',           getDashboard);

// ─── Users ──────────────────────────────────────────────────────────────────
AdminRouter.get('/users',                    getUsers);
AdminRouter.get('/users/:id',                getUserDetails);
AdminRouter.get('/users/:id/edit',           getEditUser);
AdminRouter.post('/users/:id/edit',          postEditUser);
AdminRouter.post('/users/:id/ban',           banUser);
AdminRouter.post('/users/:id/unban',         unbanUser);
AdminRouter.post('/users/:id/verify',        verifyUser);
AdminRouter.post('/users/:id/delete',        deleteUser);

// ─── Analytics ──────────────────────────────────────────────────────────────
AdminRouter.get('/analytics', getAnalytics);
AdminRouter.get('/reports',   getAnalytics);   // alias

// ─── Catch-all for admin 404s ────────────────────────────────────────────────
AdminRouter.use((req, res) => {
    res.status(404).render('error/404', { message: `Admin route not found: ${req.originalUrl}` });
});

export default AdminRouter;
