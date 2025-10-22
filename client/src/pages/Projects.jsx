import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import projectAPI from '../api/projectAPI';
import useAuthStore from '../store/useAuthStore';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.getProjects(token);
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(id, token);
        setProjects(projects.filter(project => project._id !== id));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user?.role === 'admin' && (
          <Link
            to="/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Project
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {project.issues?.length || 0} issues
              </span>
              <div className="space-x-2">
                <Link
                  to={`/projects/${project._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;