import React, { useState } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const MainContent = ({ activeProject, tasks, onAddTask, onUpdateTask, onDeleteTask, onToggleTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  if (!activeProject) {
    return (
      <div className="main-content">
        <div className="empty-state">
          <ListTodo size={64} />
          <h3>No Project Selected</h3>
          <p>Select a project from the sidebar to view tasks.</p>
        </div>
      </div>
    );
  }

  const projectTasks = tasks.filter(t => t.projectId === activeProject.id);
  const sortedTasks = [...projectTasks].sort((a, b) => {
    // Sort by completion status, then by creation date
    if (a.completed === b.completed) {
       return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="main-content">
      <div className="main-header">
        <h1>{activeProject.name}</h1>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      <div className="task-list-container">
        {isAdding && (
          <TaskForm
            onSave={(task) => {
              onAddTask({ ...task, projectId: activeProject.id });
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {sortedTasks.length === 0 && !isAdding ? (
          <div className="empty-state" style={{ height: 'auto', marginTop: '64px' }}>
            <ListTodo size={48} />
            <h3>No tasks yet</h3>
            <p>Add a task to get started.</p>
          </div>
        ) : (
          <div style={{ marginTop: '16px' }}>
            {sortedTasks.map(task => (
              editingTaskId === task.id ? (
                <TaskForm
                  key={task.id}
                  initialData={task}
                  onSave={(updatedTask) => {
                    onUpdateTask(updatedTask);
                    setEditingTaskId(null);
                  }}
                  onCancel={() => setEditingTaskId(null)}
                />
              ) : (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                  onEdit={(t) => setEditingTaskId(t.id)}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
