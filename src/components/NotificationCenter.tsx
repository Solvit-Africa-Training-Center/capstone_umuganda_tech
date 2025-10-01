import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, X, Users, Calendar, Award, AlertCircle, Info, CheckCircle, Filter, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { notificationsAPI } from '../api/notifications';
import type { Notification } from '../types/api';
import type { RootState } from '../store';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'project' | 'system'>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<Set<number>>(new Set());

  const isLeader = user?.role?.toLowerCase() === 'leader';

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds when open
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen, filter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = filter === 'unread' 
        ? await notificationsAPI.getUnreadNotifications()
        : await notificationsAPI.getNotifications({ page_size: 50 });
      
      const notificationsList = Array.isArray(data) ? data : (data?.results || []);
      
      // Filter notifications based on selected filter
      let filteredNotifications = notificationsList;
      if (filter === 'project') {
        filteredNotifications = notificationsList.filter(n => 
          n.notification_type?.includes('project') || 
          n.title?.toLowerCase().includes('project') ||
          n.message?.toLowerCase().includes('volunteer') ||
          n.message?.toLowerCase().includes('registration')
        );
      } else if (filter === 'system') {
        filteredNotifications = notificationsList.filter(n => 
          n.notification_type?.includes('system') || 
          n.title?.toLowerCase().includes('system') ||
          n.title?.toLowerCase().includes('update')
        );
      }
      
      setNotifications(filteredNotifications);
      setUnreadCount(filteredNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteSelected = async () => {
    try {
      const deletePromises = Array.from(selectedNotifications).map(id => 
        notificationsAPI.deleteNotification(id)
      );
      await Promise.all(deletePromises);
      
      setNotifications(prev => 
        prev.filter(n => !selectedNotifications.has(n.id))
      );
      setSelectedNotifications(new Set());
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getNotificationIcon = (notification: Notification) => {
    const type = notification.notification_type?.toLowerCase() || '';
    const title = notification.title?.toLowerCase() || '';
    const message = notification.message?.toLowerCase() || '';

    if (type.includes('project') || title.includes('project') || message.includes('volunteer')) {
      return <Users className="w-4 h-4 text-blue-500" />;
    }
    if (type.includes('system') || title.includes('system')) {
      return <Info className="w-4 h-4 text-gray-500" />;
    }
    if (type.includes('achievement') || title.includes('badge') || title.includes('certificate')) {
      return <Award className="w-4 h-4 text-yellow-500" />;
    }
    if (type.includes('deadline') || title.includes('deadline') || title.includes('reminder')) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
    if (type.includes('success') || title.includes('completed') || title.includes('approved')) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Bell className="w-4 h-4 text-primaryColor-600" />;
  };

  const getNotificationPriority = (notification: Notification) => {
    const title = notification.title?.toLowerCase() || '';
    const message = notification.message?.toLowerCase() || '';
    
    if (title.includes('urgent') || message.includes('urgent') || title.includes('deadline')) {
      return 'high';
    }
    if (title.includes('new') || message.includes('joined') || message.includes('registered')) {
      return 'medium';
    }
    return 'normal';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-4 top-16 w-96 bg-white rounded-xl shadow-2xl max-h-[80vh] flex flex-col z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              {isLeader ? 'Leader Notifications' : 'Notifications'}
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {selectedNotifications.size > 0 && (
              <button
                onClick={deleteSelected}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-primaryColor-600 hover:text-primaryColor-800 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full transition-colors ${
                filter === 'all' ? 'bg-primaryColor-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full transition-colors ${
                filter === 'unread' ? 'bg-primaryColor-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('project')}
              className={`px-3 py-1 rounded-full transition-colors ${
                filter === 'project' ? 'bg-primaryColor-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isLeader ? 'Projects' : 'Activities'}
            </button>
            <button
              onClick={() => setFilter('system')}
              className={`px-3 py-1 rounded-full transition-colors ${
                filter === 'system' ? 'bg-primaryColor-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              System
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-primaryColor-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {isLeader 
                  ? "You'll see project updates, volunteer registrations, and system notifications here"
                  : "You'll see activity updates, project notifications, and achievements here"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const priority = getNotificationPriority(notification);
                const isSelected = selectedNotifications.has(notification.id);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                      !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    } ${
                      priority === 'high' ? 'border-l-4 border-l-red-500' : 
                      priority === 'medium' ? 'border-l-4 border-l-yellow-500' : ''
                    } ${
                      isSelected ? 'bg-primaryColor-50' : ''
                    }`}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Selection checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(notification.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 rounded border-gray-300 text-primaryColor-600 focus:ring-primaryColor-500"
                      />
                      
                      {/* Icon */}
                      <div className="mt-1">
                        {getNotificationIcon(notification)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <p className="text-xs text-gray-500">
                                {formatTime(notification.created_at)}
                              </p>
                              {priority === 'high' && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                  Urgent
                                </span>
                              )}
                              {priority === 'medium' && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                  Important
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="ml-2 p-1 text-gray-400 hover:text-primaryColor-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50 text-center">
            <p className="text-xs text-gray-500">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''} • 
              {unreadCount} unread
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;