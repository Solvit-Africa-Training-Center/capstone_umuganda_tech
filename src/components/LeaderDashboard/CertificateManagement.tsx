import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Download, Users, Calendar, FileText, Plus, Eye, Search } from 'lucide-react';
import { certificatesAPI } from '../../api/certificates';
import { projectsAPI } from '../../api/projects';
import type { Certificate, Project } from '../../types/api';

interface CertificateManagementProps {
  projects: Project[];
  isLoading?: boolean;
}

const CertificateManagement: React.FC<CertificateManagementProps> = ({ projects, isLoading }) => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [generatingCertificates, setGeneratingCertificates] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoadingCertificates(true);
      const data = await certificatesAPI.getLeaderCertificates();
      setCertificates(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Leader certificates endpoint not available');
        setCertificates([]);
      } else {
        console.error('Failed to fetch certificates:', error);
      }
    } finally {
      setLoadingCertificates(false);
    }
  };

  const handleGenerateCertificate = async (projectId: number) => {
    setGeneratingCertificates(prev => new Set(prev).add(projectId));
    
    try {
      const result = await certificatesAPI.bulkGenerateCertificates(projectId);
      setCertificates(prev => [...prev, ...result.certificates]);
    } catch (error) {
      console.error('Failed to generate certificates:', error);
    } finally {
      setGeneratingCertificates(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const handleDownloadCertificate = async (certificateId: number, projectTitle: string) => {
    try {
      const blob = await certificatesAPI.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${projectTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  const completedProjects = projects.filter(p => p.status === 'completed');
  const projectsWithCertificates = certificates.reduce((acc, cert) => {
    acc[cert.project] = (acc[cert.project] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const filteredCertificates = certificates.filter(cert => 
    cert.project_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    searchQuery === ''
  );

  const filteredProjects = selectedProject 
    ? filteredCertificates.filter(cert => cert.project === selectedProject)
    : filteredCertificates;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Certificate Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
              <p className="text-sm font-medium text-yellow-600">Total Certificates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{completedProjects.length}</p>
              <p className="text-sm font-medium text-green-600">Completed Projects</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(certificates.map(c => c.user)).size}
              </p>
              <p className="text-sm font-medium text-blue-600">Certified Volunteers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Generation */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Generate Certificates</h2>
        </div>

        {completedProjects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No completed projects</p>
            <p className="text-sm text-gray-500">Complete projects to generate certificates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedProjects.map((project) => {
              const certificateCount = projectsWithCertificates[project.id] || 0;
              const isGenerating = generatingCertificates.has(project.id);
              
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{project.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.datetime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.volunteer_count || 0} volunteers
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {certificateCount} certificates issued
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleGenerateCertificate(project.id)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Generate Certificates
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate Management */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Certificate Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor-600 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {completedProjects.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>
        </div>

        {loadingCertificates ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No certificates found</p>
            <p className="text-sm text-gray-500">Generate certificates for completed projects</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((certificate) => (
              <div
                key={certificate.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{certificate.project_title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Certificate #{certificate.id}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(certificate.issued_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(certificate.certificate_url, '_blank')}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="View Certificate"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDownloadCertificate(certificate.id, certificate.project_title)}
                    className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                    title="Download Certificate"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagement;