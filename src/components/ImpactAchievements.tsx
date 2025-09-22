import React, { useState, useEffect } from 'react';
import { Award, Calendar, Users, MapPin, TrendingUp, Star, Trophy, Target } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: string;
  participants: number;
  location: string;
  category: 'environment' | 'education' | 'infrastructure' | 'health' | 'social';
  imageUrl?: string;
}

interface ImpactStats {
  totalProjects: number;
  totalHours: number;
  totalParticipants: number;
  communitiesServed: number;
  environmentalImpact: string;
  socialImpact: string;
}

const ImpactAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [impactStats, setImpactStats] = useState<ImpactStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setImpactStats({
        totalProjects: 127,
        totalHours: 2540,
        totalParticipants: 3200,
        communitiesServed: 15,
        environmentalImpact: '500 trees planted, 2 tons waste recycled',
        socialImpact: '1200 people trained, 50 infrastructure projects'
      });

      setAchievements([
        {
          id: '1',
          title: 'Community Garden Success',
          description: 'Established 5 community gardens providing fresh vegetables to 200+ families',
          date: '2024-12-15',
          impact: '200 families benefited',
          participants: 45,
          location: 'Nyarugenge Sector',
          category: 'environment',
          imageUrl: '/api/placeholder/300/200'
        },
        {
          id: '2',
          title: 'Digital Literacy Program',
          description: 'Trained 150 community members in basic computer skills and internet usage',
          date: '2024-11-20',
          impact: '150 people trained',
          participants: 25,
          location: 'Kicukiro Sector',
          category: 'education'
        },
        {
          id: '3',
          title: 'Road Infrastructure Improvement',
          description: 'Repaired 2km of community access roads improving transportation',
          date: '2024-10-10',
          impact: '2km roads repaired',
          participants: 80,
          location: 'Gasabo Sector',
          category: 'infrastructure'
        },
        {
          id: '4',
          title: 'Health Awareness Campaign',
          description: 'Conducted health screenings and awareness sessions for 300+ residents',
          date: '2024-09-05',
          impact: '300+ health screenings',
          participants: 30,
          location: 'Multiple Sectors',
          category: 'health'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Star },
    { id: 'environment', name: 'Environment', icon: Target },
    { id: 'education', name: 'Education', icon: Award },
    { id: 'infrastructure', name: 'Infrastructure', icon: TrendingUp },
    { id: 'health', name: 'Health', icon: Trophy },
    { id: 'social', name: 'Social', icon: Users }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environment': return 'bg-green-100 text-green-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'infrastructure': return 'bg-orange-100 text-orange-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {achievement.imageUrl && (
        <div className="h-48 bg-gray-200 relative">
          <img 
            src={achievement.imageUrl} 
            alt={achievement.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(achievement.category)}`}>
              {achievement.category}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{achievement.title}</h3>
          {!achievement.imageUrl && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(achievement.category)}`}>
              {achievement.category}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{achievement.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(achievement.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            {achievement.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            {achievement.participants} participants
          </div>
        </div>
        
        <div className="bg-primaryColor-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primaryColor-600" />
            <span className="text-sm font-medium text-primaryColor-800">Impact: {achievement.impact}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Impact & Achievements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating our collective achievements and the positive impact we've made in our communities
          </p>
        </div>

        {/* Impact Statistics */}
        {impactStats && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Collective Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{impactStats.totalProjects}</p>
                <p className="text-sm text-gray-600">Projects Completed</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{impactStats.totalParticipants.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Participants</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{impactStats.totalHours.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Volunteer Hours</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{impactStats.communitiesServed}</p>
                <p className="text-sm text-gray-600">Communities Served</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Environmental Impact</h3>
                <p className="text-green-700">{impactStats.environmentalImpact}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Social Impact</h3>
                <p className="text-blue-700">{impactStats.socialImpact}</p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primaryColor-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryColor-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        )}

        {/* Achievements Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No achievements found</h3>
                <p className="text-gray-600">No achievements in this category yet. Keep participating to make an impact!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImpactAchievements;