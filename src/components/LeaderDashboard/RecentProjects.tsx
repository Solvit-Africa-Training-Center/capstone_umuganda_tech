import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Calendar, Users, QrCode } from "lucide-react";
import { projectsAPI, type Project } from "../../api";
// import type { Project } from "../types/api";
// import { projectsAPI } from "../api/projects";   // ✅ Make sure this API has a getMyProjects() method

interface RecentProjectsProps {
  /** Optional list of projects.
   * If not provided, the component fetches leader projects automatically.
   */
  projects?: Project[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  const navigate = useNavigate();
  const [fetchedProjects, setFetchedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // If no projects are passed, fetch them
  useEffect(() => {
    if (!projects) {
      setLoading(true);
      projectsAPI
        .getMyProjects()
        .then((res) => setFetchedProjects(res))
        .catch((err) => console.error("Failed to fetch recent projects:", err))
        .finally(() => setLoading(false));
    }
  }, [projects]);

  // Use the prop if given, otherwise the fetched list
  const recentProjects = (projects || fetchedProjects).slice(0, 3);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
        <button
          onClick={() => navigate("/my-projects")}
          className="text-primaryColor-900 hover:text-accent-900 text-sm font-medium"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : recentProjects.length === 0 ? (
        <div className="text-center py-8">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No projects yet</p>
          <button
            onClick={() => navigate("/create-project")}
            className="bg-primaryColor-900 text-white px-6 py-2 rounded-lg hover:bg-accent-900 transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{project.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.datetime).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.volunteer_count || 0}/{project.required_volunteers}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    project.status === "planned"
                      ? "bg-blue-100 text-blue-800"
                      : project.status === "ongoing"
                      ? "bg-green-100 text-green-800"
                      : project.status === "completed"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {project.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${project.id}/attendance`);
                  }}
                  className="p-2 text-gray-600 hover:text-primaryColor-900 transition-colors"
                  title="View Attendance"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentProjects;
