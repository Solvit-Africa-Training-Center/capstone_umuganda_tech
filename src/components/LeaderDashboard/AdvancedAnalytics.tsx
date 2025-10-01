import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MapPin, Clock, Award, Calendar, Target } from 'lucide-react';
import { projectsAPI } from '../../api/projects';
import { attendanceAPI } from '../../api/attendance';
import { communityAPI } from '../../api/community';
import type { Project, Attendance } from '../../types/api';

interface AdvancedAnalyticsProps {
  projects: Project[];
  isLoading?: boolean;
}

interface AnalyticsData {
  projectPerformance: {
    completionRate: number;
    avgVolunteersPerProject: number;
    avgProjectDuration: number;
    mostPopularSector: string;
    totalProjects: number;
  };
  volunteerAnalytics: {
    totalUniqueVolunteers: number;
    totalAttendances: number;
    avgAttendanceRate: number;
    activeProjects: number;
  };
  geographicData: {
    sectorDistribution: { sector: string; count: number }[];
    locationDistribution: { location: string; count: number }[];
    topPerformingSectors: { sector: string; completionRate: number }[];
  };
  timeAnalytics: {
    monthlyTrends: { month: string; projects: number; completedProjects: number }[];
    recentActivity: { date: string; type: string; count: number }[];
  };
  communityEngagement: {
    totalPosts: number;
    totalComments: number;
    avgEngagementRate: number;
  };
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ projects, isLoading }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');

  useEffect(() => {
    if (projects.length > 0) {
      calculateAnalytics();
    }
  }, [projects, selectedTimeRange]);

  const calculateAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      // Fetch additional data from APIs
      const [attendanceData, communityPosts, dashboardStats] = await Promise.all([
        attendanceAPI.listAttendances().catch(() => []),
        communityAPI.getPosts().catch(() => []),
        projectsAPI.getDashboardStats().catch(() => null)
      ]);

      // Calculate project performance metrics
      const completedProjects = projects.filter(p => p.status === 'completed');
      const ongoingProjects = projects.filter(p => p.status === 'ongoing');
      const completionRate = projects.length > 0 ? (completedProjects.length / projects.length) * 100 : 0;
      const avgVolunteersPerProject = projects.length > 0 ? 
        projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0) / projects.length : 0;

      // Calculate average project duration from completed projects
      const avgDuration = completedProjects.length > 0 ? 
        completedProjects.reduce((sum, project) => {
          const start = new Date(project.created_at || project.datetime);
          const end = new Date(); // Assuming current date as completion
          const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          return sum + duration;
        }, 0) / completedProjects.length : 0;

      // Calculate sector distribution
      const sectorCounts = projects.reduce((acc, project) => {
        const sector = project.sector || 'Unknown';
        acc[sector] = (acc[sector] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sectorDistribution = Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, count }))
        .sort((a, b) => b.count - a.count);

      // Calculate location distribution
      const locationCounts = projects.reduce((acc, project) => {
        const location = project.location || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const locationDistribution = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 locations

      const mostPopularSector = sectorDistribution[0]?.sector || 'N/A';

      // Calculate top performing sectors by completion rate
      const sectorCompletion = projects.reduce((acc, project) => {
        const sector = project.sector || 'Unknown';
        if (!acc[sector]) {
          acc[sector] = { total: 0, completed: 0 };
        }
        acc[sector].total++;
        if (project.status === 'completed') {
          acc[sector].completed++;
        }
        return acc;
      }, {} as Record<string, { total: number; completed: number }>);

      const topPerformingSectors = Object.entries(sectorCompletion)
        .map(([sector, data]) => ({
          sector,
          completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0
        }))
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 5);

      // Calculate monthly trends from actual project data
      const monthlyData = projects.reduce((acc, project) => {
        const date = new Date(project.created_at || project.datetime);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = { projects: 0, completedProjects: 0 };
        }
        acc[monthKey].projects++;
        if (project.status === 'completed') {
          acc[monthKey].completedProjects++;
        }
        return acc;
      }, {} as Record<string, { projects: number; completedProjects: number }>);

      const monthlyTrends = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .slice(-6); // Last 6 months

      // Calculate attendance rate from real attendance data
      const totalAttendances = attendanceData.length;
      const completedAttendances = attendanceData.filter((a: any) => a.check_out_time).length;
      const attendanceRate = totalAttendances > 0 ? (completedAttendances / totalAttendances) * 100 : 0;

      // Calculate community engagement
      const totalPosts = Array.isArray(communityPosts) ? communityPosts.length : 0;
      const totalComments = Array.isArray(communityPosts) ? 
        communityPosts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0) : 0;
      const totalUpvotes = Array.isArray(communityPosts) ? 
        communityPosts.reduce((sum: number, post: any) => sum + (post.upvotes_count || 0), 0) : 0;
      const avgEngagementRate = totalPosts > 0 ? ((totalComments + totalUpvotes) / totalPosts) : 0;

      setAnalyticsData({
        projectPerformance: {
          completionRate: Math.round(completionRate),
          avgVolunteersPerProject: Math.round(avgVolunteersPerProject),
          avgProjectDuration: Math.round(avgDuration),
          mostPopularSector,
          totalProjects: projects.length
        },
        volunteerAnalytics: {
          totalUniqueVolunteers: projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0),
          totalAttendances,
          avgAttendanceRate: Math.round(attendanceRate),
          activeProjects: ongoingProjects.length
        },
        geographicData: {
          sectorDistribution,
          locationDistribution,
          topPerformingSectors
        },
        timeAnalytics: {
          monthlyTrends,
          recentActivity: [
            { date: 'Today', type: 'Projects Created', count: projects.filter(p => {
              const today = new Date();
              const projectDate = new Date(p.created_at || p.datetime);
              return projectDate.toDateString() === today.toDateString();
            }).length },
            { date: 'This Week', type: 'Attendances', count: attendanceData.filter((a: any) => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(a.check_in_time) > weekAgo;
            }).length },
            { date: 'This Month', type: 'Completed Projects', count: completedProjects.filter(p => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return new Date(p.created_at || p.datetime) > monthAgo;
            }).length }
          ]
        },
        communityEngagement: {
          totalPosts,
          totalComments,
          avgEngagementRate: Math.round(avgEngagementRate * 10) / 10
        }
      });
    } catch (error) {
      console.error('Failed to calculate analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (isLoading || loadingAnalytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analytics data available</p>
        <p className="text-sm text-gray-500">Create projects to see analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Advanced Analytics</h1>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.projectPerformance.completionRate}%</p>
              <p className="text-sm font-medium text-green-600">Completion Rate</p>
              <p className="text-xs text-gray-500">{analyticsData.projectPerformance.totalProjects} total projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.volunteerAnalytics.totalUniqueVolunteers}</p>
              <p className="text-sm font-medium text-blue-600">Total Volunteers</p>
              <p className="text-xs text-gray-500">{analyticsData.volunteerAnalytics.activeProjects} active projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.projectPerformance.avgProjectDuration}d</p>
              <p className="text-sm font-medium text-purple-600">Avg Duration</p>
              <p className="text-xs text-gray-500">project lifecycle</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.volunteerAnalytics.avgAttendanceRate}%</p>
              <p className="text-sm font-medium text-orange-600">Attendance Rate</p>
              <p className="text-xs text-gray-500">{analyticsData.volunteerAnalytics.totalAttendances} total check-ins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.communityEngagement.avgEngagementRate}</p>
              <p className="text-sm font-medium text-indigo-600">Engagement Rate</p>
              <p className="text-xs text-gray-500">{analyticsData.communityEngagement.totalPosts} community posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-xl font-semibold text-gray-800">Geographic Distribution</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Projects by Sector</h3>
              {analyticsData.geographicData.sectorDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.sector}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primaryColor-600 h-2 rounded-full" 
                        style={{ width: `${(item.count / Math.max(...analyticsData.geographicData.sectorDistribution.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Top Performing Sectors</h3>
              {analyticsData.geographicData.topPerformingSectors.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.sector}</span>
                  <span className="text-sm font-medium text-green-600">{Math.round(item.completionRate)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-xl font-semibold text-gray-800">Monthly Trends</h2>
          </div>
          
          <div className="space-y-4">
            {analyticsData.timeAnalytics.monthlyTrends.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {analyticsData.timeAnalytics.monthlyTrends.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2">
                      <div className="h-20 bg-gray-100 rounded flex items-end justify-center p-1">
                        <div 
                          className="bg-primaryColor-600 rounded w-full"
                          style={{ 
                            height: `${Math.max((month.projects / Math.max(...analyticsData.timeAnalytics.monthlyTrends.map(m => m.projects))) * 100, 5)}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{month.month}</p>
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-gray-800">{month.projects}</p>
                      <p className="text-gray-500">projects</p>
                      <p className="text-green-600">{month.completedProjects} done</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No monthly data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Community Engagement */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-xl font-semibold text-gray-800">Community Engagement</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.communityEngagement.totalPosts}</p>
                <p className="text-sm text-blue-800">Total Posts</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{analyticsData.communityEngagement.totalComments}</p>
                <p className="text-sm text-green-800">Comments</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{analyticsData.communityEngagement.avgEngagementRate}</p>
                <p className="text-sm text-purple-800">Avg Engagement</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Engagement Insights</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Posts per Project</span>
                  <span className="text-sm font-medium text-gray-800">
                    {analyticsData.projectPerformance.totalProjects > 0 ? 
                      (analyticsData.communityEngagement.totalPosts / analyticsData.projectPerformance.totalProjects).toFixed(1) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Comments per Post</span>
                  <span className="text-sm font-medium text-gray-800">
                    {analyticsData.communityEngagement.totalPosts > 0 ? 
                      (analyticsData.communityEngagement.totalComments / analyticsData.communityEngagement.totalPosts).toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-xl font-semibold text-gray-800">Location Analytics</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Top Locations</h3>
              {analyticsData.geographicData.locationDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.location}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / Math.max(...analyticsData.geographicData.locationDistribution.map(l => l.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Activity</h3>
              {analyticsData.timeAnalytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm text-gray-700">{activity.type}</span>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <span className="text-sm font-medium text-primaryColor-600">{activity.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primaryColor-600" />
            <h2 className="text-xl font-semibold text-gray-800">Project Performance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-800">Most Popular Sector</p>
                    <p className="text-lg font-bold text-green-900">{analyticsData.projectPerformance.mostPopularSector}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-600">Project Status Distribution</h3>
                {['completed', 'ongoing', 'planned', 'cancelled'].map(status => {
                  const count = projects.filter(p => p.status === status).length;
                  const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'ongoing' ? 'bg-blue-500' :
                              status === 'planned' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;