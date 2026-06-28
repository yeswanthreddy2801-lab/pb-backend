import { Request, Response } from 'express';
import * as notificationsService from '../services/notifications.service';
import { sendSuccess, sendError, sendPaginated } from '../utils/response';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const isReadStr = req.query.isRead as string;
    
    let isRead: boolean | undefined = undefined;
    if (isReadStr === 'true') isRead = true;
    if (isReadStr === 'false') isRead = false;

    const { data, count } = await notificationsService.getNotifications(userId, page, limit, isRead);
    
    return sendPaginated(res, data, {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { count } = await notificationsService.getUnreadCount(userId);
    return sendSuccess(res, { count });
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const notification = await notificationsService.markAsRead(userId, id);
    return sendSuccess(res, notification, 'Notification marked as read');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    await notificationsService.markAllAsRead(userId);
    return sendSuccess(res, null, 'All notifications marked as read');
  } catch (error: any) {
    return sendError(res, error.message);
  }
};
