import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck, Clock, Users, Calendar, AlertTriangle, Info } from 'lucide-react';
import { useRealTimeNotifications } from '../../hooks/useRealTimeNotifications';
import { useAuth } from '../../hooks/useAuth';
import type { Notification } from '../../types/api';

interface RealTimeNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    isConnected, 
    markAsRead, 
    markAllAsRead 
  } = useRealTimeNotifications(user?.id);
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_registration':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'attendance_checkin':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'project_deadline':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case 'system_announcement':
        return <Info className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    
    switch (type) {
      case 'new_registration':
        return 'bg-blue-50 border-blue-200';
      case 'attendance_checkin':
        return 'bg-green-50 border-green-200';
      case 'project_deadline':
        return 'bg-orange-50 border-orange-200';
      case 'system_announcement':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primaryColor-600" />
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live updates active' : 'Connection lost'}
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'all' 
                  ? 'bg-primaryColor-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === 'unread' 
                  ? 'bg-primaryColor-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mt-3 flex items-center gap-2 text-sm text-primaryColor-600 hover:text-primaryColor-800 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </p>
              <p className="text-sm text-gray-500">
                {filter === 'unread' 
                  ? 'All caught up! Check back later for updates.'
                  : 'New notifications will appear here when they arrive.'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                    getNotificationBgColor(notification.type, notification.is_read)
                  } ${!notification.is_read ? 'border-l-4' : ''}`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${
                          notification.is_read ? 'text-gray-600' : 'text-gray-800'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primaryColor-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        notification.is_read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        {notification.is_read && (
                          <span className="text-xs text-gray-400 ml-auto">Read</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Real-time updates enabled</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNotifications;