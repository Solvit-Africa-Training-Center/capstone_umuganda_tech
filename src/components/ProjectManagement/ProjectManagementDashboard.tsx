import  { useState } from 'react';
import {
  Search,
  User,
  Calendar,
  Users,
  FileText,
  MapPin,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  Eye,
  ChevronDown,
  Bell,
  Menu,
} from 'lucide-react';
// import Sidebar from '../AiadvisorDashbord/Sidebar';

const ProjectManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectTime, setProjectTime] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [skillsRequired, setSkillsRequired] = useState(false);
  const [budgetRequired, setBudgetRequired] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);
  const [projectStatus, setProjectStatus] = useState('Upcoming');

  // Fix: Explicitly define the type for useState to allow for number or null
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('All');

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Community Service Cleanup',
      description: 'A focused clean drive of the school area.',
      date: '2024-03-15',
      time: '09:00',
      location: 'Kigali',
      status: 'Active',
      statusColor: 'bg-green-500',
      volunteers: 12,
      budget: '$2,500'
    },
    {
      id: 2,
      title: 'School Renovation Initiative',
      description: 'Renovating classrooms and facilities for a local school.',
      date: '2024-04-22',
      time: '10:00',
      location: 'Bugesera',
      status: 'Completed',
      statusColor: 'bg-gray-500',
      volunteers: 25,
      budget: '$5,000'
    },
    {
      id: 3,
      title: 'Digital Literacy Workshop',
      description: 'Teaching basic computer skills to community members.',
      date: '2024-05-10',
      time: '13:30',
      location: 'Rubavu',
      status: 'Active',
      statusColor: 'bg-green-500',
      volunteers: 8,
      budget: '$1,200'
    },
    {
      id: 4,
      title: 'Health Awareness Campaign',
      description: 'An event to raise awareness about common health issues.',
      date: '2024-06-08',
      time: '11:00',
      location: 'Rubavu',
      status: 'Pending',
      statusColor: 'bg-yellow-500',
      volunteers: 15,
      budget: '$3,000'
    },
    {
      id: 5,
      title: 'Local Area Beautification',
      description: 'Planting trees and flowers to beautify the neighborhood.',
      date: '2024-06-20',
      time: '08:30',
      location: 'Nyanza',
      status: 'Active',
      statusColor: 'bg-green-500',
      volunteers: 20,
      budget: '$4,500'
    }
  ]);

  // const sidebarItems = [
  //   { name: 'Dashboard', icon: Home },
  //   { name: 'My Projects', icon: FileText, count: projects.length },
  //   { name: 'AI Project Advisor', icon: BarChart3 },
  //   { name: 'Live Dashboard', icon: Calendar },
  //   { name: 'Reporting', icon: FileText },
  //   { name: 'Settings', icon: Settings }
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Completed':
        return 'bg-gray-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Upcoming':
      default:
        return 'bg-blue-500';
    }
  };

  const resetForm = () => {
    setProjectTitle('');
    setProjectDescription('');
    setProjectDate('');
    setProjectTime('');
    setProjectLocation('');
    setSkillsRequired(false);
    setBudgetRequired(false);
    setUploadImage(false);
    setProjectStatus('Upcoming');
    setEditingProjectId(null); // Clear editing state
  };

  const handleCreateProject = () => {
    if (!projectTitle || !projectDescription || !projectDate || !projectTime || !projectLocation) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingProjectId) {
      // Logic for editing an existing project
      const updatedProjects = projects.map(project =>
        project.id === editingProjectId
          ? {
              ...project,
              title: projectTitle,
              description: projectDescription,
              date: projectDate,
              time: projectTime,
              location: projectLocation,
              status: projectStatus,
              statusColor: getStatusColor(projectStatus),
              budget: budgetRequired ? '$5,000' : 'N/A'
            }
          : project
      );
      setProjects(updatedProjects);
      alert('Project updated successfully!');
    } else {
      // Logic for creating a new project
      const newProject = {
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
        title: projectTitle,
        description: projectDescription,
        date: projectDate,
        time: projectTime,
        location: projectLocation,
        status: projectStatus,
        statusColor: getStatusColor(projectStatus),
        volunteers: 0,
        budget: budgetRequired ? '$5,000' : 'N/A'
      };
      setProjects([...projects, newProject]);
      alert('Project created successfully!');
    }
    
    resetForm();
  };

  // Fix: Add explicit number type to the projectId parameter
  const handleEditClick = (projectId: number) => {
    const projectToEdit = projects.find(project => project.id === projectId);
    if (projectToEdit) {
      setEditingProjectId(projectId);
      setProjectTitle(projectToEdit.title);
      setProjectDescription(projectToEdit.description || '');
      setProjectDate(projectToEdit.date || '');
      setProjectTime(projectToEdit.time || '');
      setProjectLocation(projectToEdit.location || '');
      setProjectStatus(projectToEdit.status);
      setBudgetRequired(projectToEdit.budget !== 'N/A');
    }
  };

  // Fix: Add explicit number type to the projectId parameter
  const handleDeleteProject = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
    }
  };

  const filteredProjects = projects.filter(project =>
    (filterStatus === 'All' || project.status === filterStatus) &&
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* <Sidebar /> */}
      <div className='w-full'>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-2"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin-Project Management</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage and oversee community projects</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Projects or Volunteers"
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </span>
                </button>

                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="px-4 pb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Projects or Volunteers"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Overview Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Overview</h2>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </button>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Projects</h3>
                  <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <span className="text-sm text-orange-600 font-medium">+5 this week</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Upcoming Projects</h3>
                  <p className="text-3xl font-bold text-gray-900">{projects.filter(p => p.status === 'Upcoming').length}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <span className="text-sm text-red-600 font-medium">-3 from yesterday</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Volunteers Needed</h3>
                  <p className="text-3xl font-bold text-gray-900">45</p>
                </div>
              </div>
            </div>

            {/* Project Creation Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingProjectId ? 'Edit Project' : 'Project Creation'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editingProjectId ? 'Update an existing project.' : 'Create a new community project'}
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Environmental cleanup initiative"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows={4}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="A focused clean drive of the school area"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        value={projectDate}
                        onChange={(e) => setProjectDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                      <input
                        type="time"
                        value={projectTime}
                        onChange={(e) => setProjectTime(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                        placeholder="Kigali Community School"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={projectStatus}
                      onChange={(e) => setProjectStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700">Additional Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="skills"
                          checked={skillsRequired}
                          onChange={(e) => setSkillsRequired(e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="skills" className="text-sm text-gray-700 font-medium">Required Skills (Creative Seasoned)</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="budget"
                          checked={budgetRequired}
                          onChange={(e) => setBudgetRequired(e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="budget" className="text-sm text-gray-700 font-medium">Project Budget $5k</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="upload"
                          checked={uploadImage}
                          onChange={(e) => setUploadImage(e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="upload" className="text-sm text-gray-700 font-medium">Upload image</label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={handleCreateProject}
                      disabled={!projectTitle || !projectDescription || !projectDate || !projectTime || !projectLocation}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingProjectId ? 'Update Project' : 'Create Project'}
                    </button>
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-semibold transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Manage Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Manage Projects</h3>
                    <p className="text-sm text-gray-600 mt-1">Existing Projects ({filteredProjects.length})</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Title</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Volunteers</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.budget}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="mr-2 h-4 w-4 text-gray-400" />
                            {new Date(project.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                            {project.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${project.statusColor}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-gray-400" />
                            {project.volunteers}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditClick(project.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                              title="Edit Project"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                              title="View Project"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="More Options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new project.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementDashboard;