import React from 'react';
import { Check, Trash2, Edit2, Calendar, AlertCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff3b30';
      case 'medium': return '#ff9500';
      case 'low': return '#34c759';
      default: return '#8e8e93';
    }
  };

  const renderDueDate = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    const isOverdue = isPast(date) && !isToday(date) && !task.completed;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isOverdue ? '#ff3b30' : 'inherit' }}>
        <Calendar size={12} />
        <span>{format(date, 'MMM d, yyyy')}</span>
      </div>
    );
  };

  return (
    <div className="task-item">
      <div
        className={`task-checkbox ${task.completed ? 'completed' : ''}`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <Check size={14} color="white" />}
      </div>

      <div className="task-content">
        <div className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </div>
        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}
        <div className="task-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(task.priority) }}>
            <AlertCircle size={12} />
            <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
          </div>
          {renderDueDate()}
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
          <Edit2 size={16} />
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(task.id)} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
