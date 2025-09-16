import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, Download, Sparkles } from 'lucide-react';

// Define the type for a single recommended project
interface RecommendedProject {
  title: string;
  priority: string;
  priorityColor: string;
  description: string;
  accuracy: string;
  duration: string;
  budget: string;
  keyImpacts: string[];
  department: string;
  projectType: string;
}

// Define the type for a user-created analysis
interface Analysis {
  community: string;
  challenges: string;
  recommendation: RecommendedProject;
}

const AIProjectAdvisor = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('All Projects');
  const [priorityFilter, setPriorityFilter] = useState<string>('High to Low');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All Departments');
  
  const [isCreatingAnalysis, setIsCreatingAnalysis] = useState<boolean>(false);
  const [communityData, setCommunityData] = useState({
    community: '',
    challenges: '',
  });

  const [allRecommendedProjects, setAllRecommendedProjects] = useState<RecommendedProject[]>([
    {
      title: 'Community Feedback Sentiment Analysis',
      priority: 'High Priority',
      priorityColor: 'bg-red-500',
      description: 'AI-powered analysis of community feedback to identify key areas for improvement and measure satisfaction with current initiatives.',
      accuracy: '92%',
      duration: '2 weeks',
      budget: '$12,500',
      keyImpacts: [
        'Improved community engagement strategies',
        'Data driven policy adjustments',
        'Identification of underserved areas',
      ],
      department: 'Community Affairs',
      projectType: 'Data Analysis'
    },
    {
      title: 'Sustainable Infrastructure Planning',
      priority: 'Medium Priority',
      priorityColor: 'bg-yellow-500',
      description: 'Development of AI models to optimize resource-efficient projects for sustainability, cost-efficiency, and community benefit.',
      accuracy: '87%',
      duration: '8 weeks',
      budget: '$24,000',
      keyImpacts: [
        'Reduced environmental impact',
        'Long-term cost savings',
        'Improved resource allocation',
      ],
      department: 'Urban Planning',
      projectType: 'Infrastructure'
    },
    {
      title: 'Public Safety Optimization',
      priority: 'High Priority',
      priorityColor: 'bg-red-500',
      description: 'AI analysis of public safety data to optimize resource allocation and improve emergency times in critical areas.',
      accuracy: '92%',
      duration: '2 weeks',
      budget: '$12,500',
      keyImpacts: [
        'Faster emergency response times',
        'Optimize resource deployment',
        'Crime prevention through predictive analysis',
      ],
      department: 'Public Safety',
      projectType: 'Public Services'
    },
    {
      title: 'Waste Management Efficiency',
      priority: 'Low Priority',
      priorityColor: 'bg-green-500',
      description: 'AI drive optimization of waste collection routes and schedules to reduce fuel consumption and improve recycling rates.',
      accuracy: '23%',
      duration: '4 weeks',
      budget: '$9,200',
      keyImpacts: [
        'Reduced operational costs',
        'Lower carbon emissions',
        'Increased recycling participation',
      ],
      department: 'Sanitation',
      projectType: 'Infrastructure'
    },
  ]);

  const [filteredProjects, setFilteredProjects] = useState<RecommendedProject[]>([]);

  const [myAnalyses, setMyAnalyses] = useState<Analysis[]>([]);

  useEffect(() => {
    let updatedProjects = [...allRecommendedProjects];

    // Filter by project type
    if (projectFilter !== 'All Projects') {
      updatedProjects = updatedProjects.filter(project => 
        project.projectType === projectFilter
      );
    }

    // Filter by priority (High to Low, Medium to High, Low to High)
    const priorityOrder: { [key: string]: number } = {
      'High Priority': 3,
      'Medium Priority': 2,
      'Low Priority': 1,
      'AI Suggested': 0
    };

    if (priorityFilter === 'High to Low') {
      updatedProjects.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (priorityFilter === 'Low to High') {
      updatedProjects.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
    
    // Filter by department
    if (departmentFilter !== 'All Departments') {
      updatedProjects = updatedProjects.filter(project => 
        project.department === departmentFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      updatedProjects = updatedProjects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(updatedProjects);
  }, [searchTerm, projectFilter, priorityFilter, departmentFilter, allRecommendedProjects]);

  const handleNewAnalysisClick = () => {
    setIsCreatingAnalysis(true);
  };

  const handleAnalyze = () => {
    const newRecommendation: RecommendedProject = analyzeCommunityData(communityData);

    const newAnalysis: Analysis = {
      community: communityData.community,
      challenges: communityData.challenges,
      recommendation: newRecommendation
    };

    setMyAnalyses([newAnalysis, ...myAnalyses]);
    setAllRecommendedProjects([newRecommendation, ...allRecommendedProjects]);

    setIsCreatingAnalysis(false);
    setCommunityData({ community: '', challenges: '' });
  };

  const analyzeCommunityData = (data: { community: string; challenges: string }): RecommendedProject => {
    const sentimentScore = Math.floor(Math.random() * 30) + 70; 
    const durationInWeeks = Math.floor(Math.random() * 6) + 2; 
    const budget = Math.floor(Math.random() * 15) + 5; 

    const projectOptions: RecommendedProject[] = [
      { title: 'Waste Management Optimization', description: 'Using AI to improve waste collection routes.', priority: 'AI Suggested', priorityColor: 'bg-blue-500', accuracy: '80%', duration: '6 weeks', budget: '$10,000', keyImpacts: ['Reduced costs', 'Improved efficiency'], department: 'Sanitation', projectType: 'Infrastructure' },
      { title: 'Local Infrastructure Assessment', description: 'Analyzing public data to identify and prioritize infrastructure repairs.', priority: 'AI Suggested', priorityColor: 'bg-blue-500', accuracy: '85%', duration: '4 weeks', budget: '$15,000', keyImpacts: ['Faster repairs', 'Increased safety'], department: 'Urban Planning', projectType: 'Infrastructure' },
      { title: 'Youth Skill Development Program', description: 'Advising on educational initiatives based on community needs.', priority: 'AI Suggested', priorityColor: 'bg-blue-500', accuracy: '75%', duration: '8 weeks', budget: '$20,000', keyImpacts: ['Increased employment', 'Community growth'], department: 'Community Affairs', projectType: 'Social Services' },
      { title: 'Community Health Initiative', description: 'Recommending health projects based on local health data.', priority: 'AI Suggested', priorityColor: 'bg-blue-500', accuracy: '90%', duration: '3 weeks', budget: '$5,000', keyImpacts: ['Improved public health', 'Lower healthcare costs'], department: 'Public Health', projectType: 'Health' },
      { title: 'Community Feedback Loop', description: 'A platform to collect and analyze feedback from community members.', priority: 'AI Suggested', priorityColor: 'bg-blue-500', accuracy: '88%', duration: '2 weeks', budget: '$8,000', keyImpacts: ['Better policy decisions', 'Higher satisfaction'], department: 'Community Affairs', projectType: 'Data Analysis' },
    ];

    const randomProject = projectOptions[Math.floor(Math.random() * projectOptions.length)];

    return {
      title: randomProject.title,
      priority: 'AI Suggested',
      priorityColor: 'bg-blue-500',
      description: randomProject.description,
      accuracy: `${sentimentScore}%`,
      duration: `${durationInWeeks} weeks`,
      budget: `$${budget},000`,
      keyImpacts: [
        'Data-driven project selection',
        'Optimized resource allocation',
        'Increased community impact'
      ],
      department: 'AI Generated',
      projectType: 'AI Suggested'
    };
  };

  const renderRecommendedProjects = () => {
    if (filteredProjects.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-6">
          No projects found matching your criteria.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        {filteredProjects.map((project, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${project.priorityColor}`}>
                {project.priority}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{project.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="block font-bold text-gray-800">{project.accuracy}</span>
                <span className="text-gray-500">Accuracy</span>
              </div>
              <div>
                <span className="block font-bold text-gray-800">{project.duration}</span>
                <span className="text-gray-500">Duration</span>
              </div>
              <div className="col-span-2">
                <span className="block font-bold text-gray-800">{project.budget}</span>
                <span className="text-gray-500">Budget</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Impact Areas:</h4>
              <ul className="space-y-1">
                {project.keyImpacts.map((impact, impactIndex) => (
                  <li key={impactIndex} className="flex items-center text-sm text-gray-600">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    {impact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                <span className="mr-2">Details</span>
              </button>
              <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                <span className="mr-2">Start Project</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMyAnalyses = () => {
    if (myAnalyses.length === 0) {
      return <p className="text-center text-gray-500 mt-4">You have not created any new analyses yet.</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {myAnalyses.map((analysis, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{analysis.community}</h3>
            <p className="text-gray-500 text-sm mb-4 italic">"{analysis.challenges}"</p>
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-700">AI Recommended: {analysis.recommendation.title}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Duration: {analysis.recommendation.duration}</span>
              <span>Budget: {analysis.recommendation.budget}</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                View Details
              </button>
              <button className="flex-1 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                Start Project
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">AI Project Advisor</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-colors"
            onClick={handleNewAnalysisClick}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Analysis
          </button>
        </div>
      </header>

      {isCreatingAnalysis ? (
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Analysis</h2>
          <p className="text-sm text-gray-600 mb-6">Provide details about the community to get AI-powered project recommendations.</p>
          <div className="space-y-6">
            <div>
              <label htmlFor="community" className="block text-sm font-semibold text-gray-700 mb-2">Community Name</label>
              <input 
                type="text" 
                id="community"
                value={communityData.community}
                onChange={(e) => setCommunityData({ ...communityData, community: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="e.g., Downtown Neighborhood"
              />
            </div>
            <div>
              <label htmlFor="challenges" className="block text-sm font-semibold text-gray-700 mb-2">Community Challenges/Needs</label>
              <textarea 
                id="challenges"
                value={communityData.challenges}
                onChange={(e) => setCommunityData({ ...communityData, challenges: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none"
                placeholder="Describe the key challenges or goals, e.g., 'We need to improve public transportation and reduce waste.'"
              ></textarea>
            </div>
            <div className="flex space-x-4">
              <button 
                className="flex-1 flex items-center justify-center px-4 py-3 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                onClick={handleAnalyze}
                disabled={!communityData.community || !communityData.challenges}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Recommendations
              </button>
              <button 
                className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsCreatingAnalysis(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Filters and Search Section */}
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-8">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
              <div className="relative w-full sm:w-auto">
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-8"
                >
                  <option>All Projects</option>
                  <option>AI Suggested</option>
                  <option>Infrastructure</option>
                  <option>Public Services</option>
                  <option>Data Analysis</option>
                  <option>Social Services</option>
                  <option>Health</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative w-full sm:w-auto">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-8"
                >
                  <option>High to Low</option>
                  <option>Low to High</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative w-full sm:w-auto">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-8"
                >
                  <option>All Departments</option>
                  <option>Community Affairs</option>
                  <option>Urban Planning</option>
                  <option>Public Safety</option>
                  <option>Sanitation</option>
                  <option>Public Health</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="relative w-full lg:w-auto lg:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Analytics Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-sm mb-2">Activity Impact Score</div>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-gray-900">85%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-sm mb-2">Project Completion Rate</div>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-gray-900">78%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-500 text-sm mb-2">Project Completion Rate</div>
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-gray-900">92%</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* My Analyses Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Analyses</h2>
            {renderMyAnalyses()}
          </div>
          
          {/* Recommended Projects Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recommended Projects</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">AI Suggested</span>
            </div>
            {renderRecommendedProjects()}
          </div>
        </>
      )}
    </div>
  );
};

export default AIProjectAdvisor;