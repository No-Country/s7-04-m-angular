import { query, sanitize } from 'express-validator';
import { errorHandler } from './errorHandler.validator';

const getAllUsersV = [
    query('page').isInt().optional().withMessage('page must be an integer').toInt(),
    query('limit').isInt().optional().withMessage('limit must be an integer').toInt(),

    errorHandler
  ];

export { getAllUsersV };