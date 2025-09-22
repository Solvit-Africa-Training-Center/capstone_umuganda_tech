import React, { useState, useEffect } from 'react';
import { Users, Clock, Target, TrendingUp, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface LiveMetrics {
  checkedInCount: number;
  targetVolunteers: number;
  projectProgress: number;
  averageCheckInTime: string;
  skillsAvailable: string[];
  recentCheckIns: Array<{
    id: string;
    name: string;
    time: string;
    skills: string[];
  }>;
}

interface LiveParticipationDashboardProps {
  projectId: number;
  projectTitle: string;
  isLive?: boolean;
}

const LiveParticipationDashboard: React.FC<LiveParticipationDashboardProps> = ({ 
  projectId, 
  projectTitle, 
  isLive = false 
}) => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    checkedInCount: 0,
    targetVolunteers: 50,
    projectProgress: 0,
    averageCheckInTime: '09:15 AM',
    skillsAvailable: [],
    recentCheckIns: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        checkedInCount: Math.min(prev.checkedInCount + Math.floor(Math.random() * 3), prev.targetVolunteers),
        projectProgress: Math.min(prev.projectProgress + Math.floor(Math.random() * 5), 100),
        recentCheckIns: [
          {
            id: Date.now().toString(),
            name: `Volunteer ${Math.floor(Math.random() * 100)}`,
            time: new Date().toLocaleTimeString(),
            skills: ['Construction', 'Leadership'][Math.floor(Math.random() * 2)] ? ['Construction'] : ['Leadership']
          },
          ...prev.recentCheckIns.slice(0, 4)
        ]
      }));
    }, 3000);

    // Initial data load
    setTimeout(() => {
      setMetrics({
        checkedInCount: 23,
        targetVolunteers: 50,
        projectProgress: 35,
        averageCheckInTime: '09:15 AM',
        skillsAvailable: ['Construction', 'Leadership', 'Gardening', 'Teaching'],
        recentCheckIns: [
          { id: '1', name: 'Jean Baptiste', time: '09:12 AM', skills: ['Construction'] },
          { id: '2', name: 'Marie Claire', time: '09:10 AM', skills: ['Leadership'] },
          { id: '3', name: 'Paul Kagame', time: '09:08 AM', skills: ['Gardening'] },
        ]
      });
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  const attendancePercentage = (metrics.checkedInCount / metrics.targetVolunteers) * 100;
  const isOnTrack = attendancePercentage >= 70;

  if (!isLive) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Event Not Started</h3>
          <p className="text-gray-600">Live participation dashboard will be available when the event begins</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Live Participation Dashboard</h2>
          <p className="text-sm text-gray-600">{projectTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">LIVE</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Checked In</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{metrics.checkedInCount}</p>
          <p className="text-xs text-blue-700">of {metrics.targetVolunteers} target</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Attendance Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{Math.round(attendancePercentage)}%</p>
          <div className="flex items-center gap-1 mt-1">
            {isOnTrack ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <AlertCircle className="w-3 h-3 text-yellow-600" />
            )}
            <p className="text-xs text-green-700">
              {isOnTrack ? 'On track' : 'Below target'}
            </p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{metrics.projectProgress}%</p>
          <p className="text-xs text-purple-700">Project completion</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Avg Check-in</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{metrics.averageCheckInTime}</p>
          <p className="text-xs text-orange-700">Average time</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Volunteer Target Progress</span>
          <span className="text-sm text-gray-600">{metrics.checkedInCount}/{metrics.targetVolunteers}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isOnTrack ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Available */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Skills Available</h3>
          <div className="flex flex-wrap gap-2">
            {metrics.skillsAvailable.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primaryColor-100 text-primaryColor-800 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Recent Check-ins</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {metrics.recentCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{checkIn.name}</p>
                  <p className="text-xs text-gray-600">{checkIn.skills.join(', ')}</p>
                </div>
                <span className="text-xs text-gray-500">{checkIn.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveParticipationDashboard;