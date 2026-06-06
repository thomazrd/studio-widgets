import React, { useState } from 'react';
import { Folder, Plus, Trash2 } from 'lucide-react';

const Sidebar = ({ projects, activeProjectId, onSelectProject, onAddProject, onDeleteProject }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject({
        id: crypto.randomUUID(),
        name: newProjectName.trim(),
        createdAt: new Date().toISOString()
      });
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        Projects
      </div>
      <div className="sidebar-content">
        {projects.map(project => (
          <div
            key={project.id}
            className={`project-item ${activeProjectId === project.id ? 'active' : ''}`}
            onClick={() => onSelectProject(project.id)}
          >
            <Folder size={16} style={{ marginRight: '12px' }} />
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {project.name}
            </span>
            {activeProjectId === project.id && projects.length > 1 && (
              <button
                className="icon-btn"
                style={{ color: 'inherit', opacity: 0.7 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}

        {isAdding && (
          <form onSubmit={handleAddSubmit} style={{ padding: '8px 16px' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
              onBlur={() => {
                if (!newProjectName.trim()) setIsAdding(false);
              }}
              style={{ width: '100%', padding: '6px 8px' }}
            />
          </form>
        )}
      </div>
      <button className="add-project-btn" onClick={() => setIsAdding(true)}>
        <Plus size={16} /> New Project
      </button>
    </div>
  );
};

export default Sidebar;
