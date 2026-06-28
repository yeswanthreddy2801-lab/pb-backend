import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message?: string, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendPaginated = (
  res: Response,
  data: any[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
  message?: string
) => {
  return res.status(200).json({
    success: true,
    data,
    pagination,
    message,
  });
};

export const sendError = (res: Response, error: string, details?: any, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
  });
};
