import { asyncHandler } from '../utils/async-handler.js';
import { ApiResponse } from '../utils/api-response.js';

export const HealthCheckController = asyncHandler(async (req, res, _) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { message: 'OK', Date: new Date(), uptime: process.uptime() },
        'Health check passed',
      ),
    );
});
