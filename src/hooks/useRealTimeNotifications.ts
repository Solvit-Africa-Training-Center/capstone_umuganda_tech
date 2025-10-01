import { useState, useEffect, useCallback } from 'react';
import { notificationsAPI } from '../api/notifications';
import type { Notification } from '../types/api';

interface NotificationUpdate {
  type: 'new_registration' | 'attendance_checkin' | 'project_deadline' | 'system_announcement';
  data: any;
  timestamp: string;
}

export const useRealTimeNotifications = (userId?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await notificationsAPI.getNotifications();
      setNotifications(data.results || []);
      
      // Get unread count
      const unreadData = await notificationsAPI.getUnreadCount();
      setUnreadCount(unreadData.count);
      setIsConnected(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Notifications endpoint not available');
        setNotifications([]);
        setUnreadCount(0);
      } else {
        console.error('Failed to fetch notifications:', error);
      }
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll for real-time updates
  const pollForUpdates = useCallback(() => {
    const interval = setInterval(async () => {
      try {
        // Fetch latest unread count
        const unreadData = await notificationsAPI.getUnreadCount();
        const newUnreadCount = unreadData.count;
        
        // If unread count increased, fetch new notifications
        if (newUnreadCount > unreadCount) {
          const data = await notificationsAPI.getNotifications();
          setNotifications(data.results || []);
          setUnreadCount(newUnreadCount);
          
          // Show browser notification for new notifications
          if (Notification.permission === 'granted' && newUnreadCount > unreadCount) {
            new Notification('New Notification', {
              body: `You have ${newUnreadCount - unreadCount} new notification(s)`,
              icon: '/favicon.ico'
            });
          }
        }
        
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to poll for updates:', error);
        setIsConnected(false);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [unreadCount]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    requestNotificationPermission();
    
    // Set up polling for updates
    const cleanup = pollForUpdates();

    return cleanup;
  }, [fetchNotifications, pollForUpdates, requestNotificationPermission]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};

// Helper functions for generating notification content
const getNotificationTitle = (type: string): string => {
  switch (type) {
    case 'new_registration':
      return 'New Volunteer Registration';
    case 'attendance_checkin':
      return 'Volunteer Check-in';
    case 'project_deadline':
      return 'Project Deadline Reminder';
    case 'system_announcement':
      return 'System Announcement';
    default:
      return 'New Notification';
  }
};

const getNotificationMessage = (type: string): string => {
  const volunteers = ['John Doe', 'Sarah Johnson', 'Mike Chen', 'Alice Smith', 'David Wilson'];
  const projects = ['Clean Kigali Streets', 'Tree Planting Initiative', 'Community Garden', 'School Renovation'];
  
  switch (type) {
    case 'new_registration':
      return `${volunteers[Math.floor(Math.random() * volunteers.length)]} registered for ${projects[Math.floor(Math.random() * projects.length)]}`;
    case 'attendance_checkin':
      return `${volunteers[Math.floor(Math.random() * volunteers.length)]} checked in to ${projects[Math.floor(Math.random() * projects.length)]}`;
    case 'project_deadline':
      return `${projects[Math.floor(Math.random() * projects.length)]} starts in 2 days`;
    case 'system_announcement':
      return 'Platform maintenance scheduled for this weekend';
    default:
      return 'You have a new notification';
  }
};