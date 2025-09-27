import React, { useState, useEffect } from 'react';
import {Auth} from 'aws-amplify';
import TaskForm from './TaskForm';
import TaskList from './TaskList';


const TodoApp = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Normalize possible response shapes to an array
        const tasksArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.tasks)
              ? data.tasks
              : [];
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      
      const response = await fetch(`${API_BASE_URL}/task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating task:', error);
      return false;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      
      const response = await fetch(`${API_BASE_URL}/update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      
      const response = await fetch(`${API_BASE_URL}/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const filteredTasks = (Array.isArray(tasks) ? tasks : []).filter(task => {
    const status = String(task?.Status || '').toLowerCase();
    switch (filter) {
      case 'pending':
        return status === 'pending';
      case 'completed':
        return status === 'completed';
      case 'expired':
        return status === 'expired';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TaskForm onCreateTask={createTask} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {['all', 'pending', 'completed', 'expired'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm capitalize ${
                      filter === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab} ({(Array.isArray(tasks) ? tasks : []).filter(t => {
                      if (tab === 'all') return true;
                      return String(t?.Status || '').toLowerCase() === tab;
                    }).length})
                  </button>
                ))}
              </nav>
            </div>
            
            <TaskList
              tasks={filteredTasks}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              filter={filter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;