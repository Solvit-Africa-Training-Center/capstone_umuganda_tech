import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { notificationsAPI } from '../api/notifications';
import type { Notification } from '../types/api';
import type { RootState } from '../store';

export const useNotifications = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLeader = user?.role?.toLowerCase() === 'leader';

  // Fetch notifications
  const fetchNotifications = useCallback(async (params?: { page_size?: number; unread_only?: boolean }) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const data = params?.unread_only 
        ? await notificationsAPI.getUnreadNotifications()
        : await notificationsAPI.getNotifications({ page_size: params?.page_size || 20 });
      
      const notificationsList = Array.isArray(data) ? data : (data?.results || []);
      setNotifications(notificationsList);
      setUnreadCount(notificationsList.filter(n => !n.is_read).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Get unread count only
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const { count } = await notificationsAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      setError('Failed to mark as read');
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      setError('Failed to mark all as read');
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.is_read ? Math.max(0, prev - 1) : prev;
      });
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setError('Failed to delete notification');
    }
  }, [notifications]);

  // Delete multiple notifications
  const deleteMultiple = useCallback(async (ids: number[]) => {
    try {
      const deletePromises = ids.map(id => notificationsAPI.deleteNotification(id));
      await Promise.all(deletePromises);
      
      const deletedUnreadCount = notifications.filter(n => ids.includes(n.id) && !n.is_read).length;
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
      setUnreadCount(prev => Math.max(0, prev - deletedUnreadCount));
    } catch (err) {
      console.error('Failed to delete notifications:', err);
      setError('Failed to delete notifications');
    }
  }, [notifications]);

  // Create notification (for leaders)
  const createNotification = useCallback(async (data: {
    user: number;
    title: string;
    message: string;
    notification_type: string;
    project?: number;
  }) => {
    if (!isLeader) return;

    try {
      const newNotification = await notificationsAPI.createNotification(data);
      return newNotification;
    } catch (err) {
      console.error('Failed to create notification:', err);
      setError('Failed to create notification');
      throw err;
    }
  }, [isLeader]);

  // Filter notifications by type
  const getFilteredNotifications = useCallback((filter: 'all' | 'unread' | 'project' | 'system' | 'achievement') => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.is_read);
      case 'project':
        return notifications.filter(n => 
          n.notification_type?.includes('project') || 
          n.title?.toLowerCase().includes('project') ||
          n.message?.toLowerCase().includes('volunteer') ||
          n.message?.toLowerCase().includes('registration')
        );
      case 'system':
        return notifications.filter(n => 
          n.notification_type?.includes('system') || 
          n.title?.toLowerCase().includes('system') ||
          n.title?.toLowerCase().includes('update')
        );
      case 'achievement':
        return notifications.filter(n => 
          n.notification_type?.includes('achievement') || 
          n.title?.toLowerCase().includes('badge') ||
          n.title?.toLowerCase().includes('certificate')
        );
      default:
        return notifications;
    }
  }, [notifications]);

  // Get notification priority
  const getNotificationPriority = useCallback((notification: Notification): 'high' | 'medium' | 'normal' => {
    const title = notification.title?.toLowerCase() || '';
    const message = notification.message?.toLowerCase() || '';
    
    if (title.includes('urgent') || message.includes('urgent') || title.includes('deadline')) {
      return 'high';
    }
    if (title.includes('new') || message.includes('joined') || message.includes('registered')) {
      return 'medium';
    }
    return 'normal';
  }, []);

  // Auto-refresh notifications
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      
      // Poll for new notifications every 2 minutes
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 120000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    isLeader,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultiple,
    createNotification,
    getFilteredNotifications,
    getNotificationPriority,
    clearError: () => setError(null)
  };
};