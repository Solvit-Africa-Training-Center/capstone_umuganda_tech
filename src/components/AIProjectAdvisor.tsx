import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Users, MapPin, Calendar, Lightbulb, BarChart3 } from 'lucide-react';

interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number;
  requiredVolunteers: number;
  suggestedLocation: string;
  reasoning: string;
  pastSuccessRate: number;
}

const AIProjectAdvisor: React.FC = () => {
  const [suggestions, setSuggestions] = useState<ProjectSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ProjectSuggestion | null>(null);

  useEffect(() => {
    // Simulate AI analysis - replace with actual API call
    setTimeout(() => {
      setSuggestions([
        {
          id: '1',
          title: 'Community Garden Initiative',
          description: 'Establish vegetable gardens in underutilized community spaces',
          priority: 'high',
          estimatedImpact: 85,
          requiredVolunteers: 25,
          suggestedLocation: 'Nyarugenge Sector',
          reasoning: 'Based on food security data and available land analysis',
          pastSuccessRate: 92
        },
        {
          id: '2',
          title: 'Digital Literacy Training',
          description: 'Provide basic computer and internet skills training',
          priority: 'high',
          estimatedImpact: 78,
          requiredVolunteers: 15,
          suggestedLocation: 'Kicukiro Sector',
          reasoning: 'High demand identified through community feedback',
          pastSuccessRate: 87
        },
        {
          id: '3',
          title: 'Road Maintenance Project',
          description: 'Repair and maintain community access roads',
          priority: 'medium',
          estimatedImpact: 70,
          requiredVolunteers: 40,
          suggestedLocation: 'Gasabo Sector',
          reasoning: 'Infrastructure assessment shows critical need',
          pastSuccessRate: 95
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SuggestionCard: React.FC<{ suggestion: ProjectSuggestion }> = ({ suggestion }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{suggestion.title}</h3>
          <p className="text-gray-600 mb-3">{suggestion.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(suggestion.priority)}`}>
          {suggestion.priority} priority
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 mr-2" />
          Impact: {suggestion.estimatedImpact}%
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {suggestion.requiredVolunteers} volunteers
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {suggestion.suggestedLocation}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          {suggestion.pastSuccessRate}% success rate
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">AI Reasoning</p>
            <p className="text-sm text-blue-700">{suggestion.reasoning}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedSuggestion(suggestion)}
          className="flex-1 bg-primaryColor-600 hover:bg-primaryColor-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          View Details
        </button>
        <button className="flex-1 border border-primaryColor-600 text-primaryColor-600 hover:bg-primaryColor-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          Create Project
        </button>
      </div>
    </div>
  );

  const DetailModal: React.FC = () => {
    if (!selectedSuggestion) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedSuggestion.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedSuggestion.priority)}`}>
                  {selectedSuggestion.priority} priority
                </span>
              </div>
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Project Description</h3>
                <p className="text-gray-600">{selectedSuggestion.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-primaryColor-600" />
                    <span className="font-medium text-gray-800">Estimated Impact</span>
                  </div>
                  <p className="text-2xl font-bold text-primaryColor-600">{selectedSuggestion.estimatedImpact}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-800">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{selectedSuggestion.pastSuccessRate}%</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis & Reasoning</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800">{selectedSuggestion.reasoning}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primaryColor-600 hover:bg-primaryColor-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Create This Project
                </button>
                <button 
                  onClick={() => setSelectedSuggestion(null)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">AI Project Advisor</h2>
          <p className="text-sm text-gray-600">Smart recommendations based on community data and past success</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing community data and generating recommendations...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      )}

      <DetailModal />
    </div>
  );
};

export default AIProjectAdvisor;