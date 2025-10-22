import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import projectAPI from "../api/projectAPI";
import useAuthStore from "../store/useAuthStore";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuthStore();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.getProjects(token);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectAPI.deleteProject(id, token);
        setProjects(projects.filter((project) => project._id !== id));
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const getRandomColor = (index) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-indigo-500 to-indigo-600",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600 text-lg">
              Manage and track your software development projects
            </p>
          </div>
          {user?.role === "admin" && (
            <Link
              to="/projects/new"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>Create Project</span>
              </span>
            </Link>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📁</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first project to get started!
            </p>
            {user?.role === "admin" && (
              <Link
                to="/projects/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">➕</span>
                Create Your First Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Header with gradient */}
                <div
                  className={`h-2 bg-gradient-to-r ${getRandomColor(index)}`}
                ></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {project.description || "No description provided"}
                      </p>
                    </div>
                    <div className="text-2xl ml-4">📋</div>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-gray-500 text-xs px-2 py-1">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">📊</span>
                        <span className="text-sm text-gray-600">
                          {project.issues?.length || 0} issues
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">👥</span>
                        <span className="text-sm text-gray-600">
                          {project.members?.length || 0} members
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      View Details →
                    </Link>

                    {user?.role === "admin" && (
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
