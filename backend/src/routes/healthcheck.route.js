import express from 'express';
import { HealthCheckController } from '../controllers/health.controller.js';

const HealthRouter = express.Router();

HealthRouter.get('/', HealthCheckController);

export default HealthRouter;
