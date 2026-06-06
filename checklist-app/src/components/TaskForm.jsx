import React, { useState } from 'react';

const TaskForm = ({ onSave, onCancel, initialData = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      completed: initialData?.completed || false,
      createdAt: initialData?.createdAt || new Date().toISOString()
    });
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-field"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="input-field"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-row">
        <input
          type="date"
          className="input-field"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          className="input-field"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
          Save Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
