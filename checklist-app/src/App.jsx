import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { storage } from './storage';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedProjects = storage.getItem('projects') || [
      { id: 'inbox', name: 'Inbox', createdAt: new Date().toISOString() }
    ];
    const loadedTasks = storage.getItem('tasks') || [];

    setProjects(loadedProjects);
    setTasks(loadedTasks);
    setActiveProjectId(loadedProjects[0].id);
    setIsLoaded(true);
  }, []);

  // Save data on changes
  useEffect(() => {
    if (isLoaded) {
      storage.setItem('projects', projects);
      storage.setItem('tasks', tasks);
    }
  }, [projects, tasks, isLoaded]);

  const handleAddProject = (project) => {
    setProjects([...projects, project]);
    setActiveProjectId(project.id);
  };

  const handleDeleteProject = (projectId) => {
    const newProjects = projects.filter(p => p.id !== projectId);
    setProjects(newProjects);
    setTasks(tasks.filter(t => t.projectId !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(newProjects[0]?.id || null);
    }
  };

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  if (!isLoaded) return null;

  return (
    <div className="app-container">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
      />
      <MainContent
        activeProject={projects.find(p => p.id === activeProjectId)}
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleTask}
      />
    </div>
  );
};

export default App;
