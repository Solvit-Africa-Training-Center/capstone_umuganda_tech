import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { createProject } from '../../features/projects/projectSlice';

const ProjectManagementDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const projectsState = useSelector((state: RootState) => state.projects);

  // ✅ avoid destructuring until projectsState is defined
  const projects = projectsState?.items ?? [];
  const loading = projectsState?.loading ?? false;
  const error = projectsState?.error ?? null;

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectTime, setProjectTime] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectStatus, setProjectStatus] = useState('Upcoming');

  const handleCreateProject = () => {
    if (!projectTitle || !projectDescription || !projectDate || !projectTime || !projectLocation) {
      alert('Please fill out all required fields.');
      return;
    }

    const newProject = {
      title: projectTitle,
      description: projectDescription,
      date: projectDate,
      time: projectTime,
      location: projectLocation,
      status: projectStatus,
    };

    dispatch(createProject(newProject));

    setProjectTitle('');
    setProjectDescription('');
    setProjectDate('');
    setProjectTime('');
    setProjectLocation('');
    setProjectStatus('Upcoming');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-full">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <h1 className="text-2xl font-bold px-6 py-4">Admin-Project Management</h1>
        </header>

        <div className="p-6">
          {loading && <p className="text-blue-500">Saving project...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create Project</h2>

            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Title"
              className="border p-2 w-full mb-3 rounded"
            />

            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Description"
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="date"
              value={projectDate}
              onChange={(e) => setProjectDate(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="time"
              value={projectTime}
              onChange={(e) => setProjectTime(e.target.value)}
              className="border p-2 w-full mb-3 rounded"
            />

            <input
              type="text"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              placeholder="Location"
              className="border p-2 w-full mb-3 rounded"
            />

            <button
              onClick={handleCreateProject}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Create Project
            </button>
          </div>

          <h2 className="text-xl font-bold mb-4">Projects</h2>
          <ul>
            {projects.map((p, i) => (
              <li key={i} className="mb-2 border-b pb-2">
                <span className="font-semibold">{p.title}</span> - {p.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagementDashboard;
