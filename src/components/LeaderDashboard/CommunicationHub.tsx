import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, TrendingUp, Calendar, Bell, Send, Filter, Search, Phone, Mail, Settings } from 'lucide-react';
import type { Project } from '../../types/api';

interface CommunicationHubProps {
  projects: Project[];
  isLoading?: boolean;
}

const CommunicationHub: React.FC<CommunicationHubProps> = ({ projects, isLoading }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messageType, setMessageType] = useState<'sms' | 'email' | 'notification'>('notification');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<'all' | 'project'>('all');

  // Mock communication data
  const communicationStats = {
    totalVolunteers: projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0),
    activeProjects: projects.filter(p => p.status === 'ongoing').length,
    messagesSent: 156,
    responseRate: 78
  };

  const recentMessages = [
    {
      id: 1,
      type: 'SMS',
      recipient: 'All Volunteers',
      message: 'Reminder: Tree planting event tomorrow at 8 AM',
      sent_at: '2024-01-15T10:30:00Z',
      status: 'delivered'
    },
    {
      id: 2,
      type: 'Email',
      recipient: 'Project Leaders',
      message: 'Monthly project report submission deadline',
      sent_at: '2024-01-14T15:45:00Z',
      status: 'delivered'
    },
    {
      id: 3,
      type: 'Notification',
      recipient: 'Clean Kigali Team',
      message: 'Great work on yesterday\'s cleanup activity!',
      sent_at: '2024-01-13T18:20:00Z',
      status: 'delivered'
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Mock sending logic
    console.log('Sending message:', {
      type: messageType,
      recipients,
      project: selectedProject?.id,
      message
    });
    
    alert(`${messageType.toUpperCase()} sent successfully!`);
    setMessage('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messaging Center</h1>
          <p className="text-gray-600">Send messages and announcements to your volunteers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{communicationStats.totalVolunteers}</p>
              <p className="text-sm font-medium text-blue-600">Total Volunteers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{communicationStats.activeProjects}</p>
              <p className="text-sm font-medium text-green-600">Active Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Send className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{communicationStats.messagesSent}</p>
              <p className="text-sm font-medium text-purple-600">Messages Sent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{communicationStats.responseRate}%</p>
              <p className="text-sm font-medium text-orange-600">Response Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Message Composer */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Message</h2>
          
          <div className="space-y-4">
            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
              <div className="flex gap-2">
                {(['notification', 'sms', 'email'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setMessageType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      messageType === type
                        ? 'bg-primaryColor-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'notification' && <Bell className="w-4 h-4 inline mr-1" />}
                    {type === 'sms' && <Phone className="w-4 h-4 inline mr-1" />}
                    {type === 'email' && <Mail className="w-4 h-4 inline mr-1" />}
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <select
                value={recipients}
                onChange={(e) => setRecipients(e.target.value as 'all' | 'project')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-600"
              >
                <option value="all">All Volunteers</option>
                <option value="project">Specific Project</option>
              </select>
            </div>

            {/* Project Selection */}
            {recipients === 'project' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
                <select
                  value={selectedProject?.id || ''}
                  onChange={(e) => {
                    const project = projects.find(p => p.id === Number(e.target.value));
                    setSelectedProject(project || null);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor-600"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.volunteer_count || 0} volunteers)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:border-primaryColor-600"
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/160 characters</p>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="w-full flex items-center justify-center gap-2 bg-primaryColor-600 text-white py-3 px-4 rounded-lg hover:bg-primaryColor-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              Send {messageType.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Messages</h2>
            <button className="text-primaryColor-600 hover:text-primaryColor-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      msg.type === 'SMS' ? 'bg-green-100 text-green-800' :
                      msg.type === 'Email' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {msg.type}
                    </span>
                    <span className="text-sm text-gray-600">{msg.recipient}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${
                    msg.status === 'delivered' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></span>
                </div>
                
                <p className="text-gray-800 text-sm mb-2">{msg.message}</p>
                
                <p className="text-xs text-gray-500">
                  {new Date(msg.sent_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
            <Bell className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Send Reminder</p>
              <p className="text-xs text-blue-600">Upcoming project notifications</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <Users className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Volunteer Update</p>
              <p className="text-xs text-green-600">Send project updates</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
            <Settings className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-medium text-purple-800">Message Settings</p>
              <p className="text-xs text-purple-600">Configure preferences</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;