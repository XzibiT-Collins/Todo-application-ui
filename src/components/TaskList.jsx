import React from 'react';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask, filter }) => {
  const handleStatusChange = async (taskId, newStatus) => {
    await onUpdateTask(taskId, { status: newStatus });
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDeleteTask(taskId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    console.log('Formatting date:', dateString);
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">
          {filter === 'all' 
            ? "You don't have any tasks yet. Create your first task!"
            : `No ${filter} tasks found.`}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.TaskId} className="todo-card bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-gray-900">{task.Description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Date Created: {new Date(task.DateCreated * 1000).toLocaleString()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.Status)}`}>
                    {task.Status}
                  </span>
                  {task.Deadline && (
                    <span className="text-xs text-gray-400">
                      Expires: {new Date(task.Deadline * 1000).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                {task.Status === 'Pending' && (
                  <button
                    onClick={() => handleStatusChange(task.TaskId, 'Completed')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
                  >
                    Complete
                  </button>
                )}
                
                {task.Status !== 'Expired' && (
                  <button
                    onClick={() => handleDelete(task.TaskId)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
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

export default TaskList;