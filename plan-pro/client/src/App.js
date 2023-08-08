import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import googleIcon from './images/google.JPG';
import facebookIcon from './images/facebook.JPG';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const App = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Store the list of tasks
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Store the user authentication token
  const [username, setUsername] = useState(''); // Store the username for registration and login
  const [password, setPassword] = useState(''); // Store the password for registration and login
  const [registrationStatus, setRegistrationStatus] = useState(null); // Track the registration status (success or error)
  const [editingTask, setEditingTask] = useState(null); // Store the task being edited
  const [editMode, setEditMode] = useState(false); // Track whether the app is in edit mode or not
  const [isAdmin, setIsAdmin] = useState(false); // Initialize isAdmin state


  const API_BASE_URL = 'http://localhost:5000/api'; // Base URL for the API

  // Fetch tasks from the server
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [token]);

  // Add a new task to the server
  const handleAddTask = async (newTask) => {
    try {
      await axios.post(`${API_BASE_URL}/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Register a new user
  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`,
        { username, password, isAdmin: isAdmin },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      setRegistrationStatus('success');
      setIsAdmin(isAdmin); // Update isAdmin
    } catch (error) {
      console.error('Error registering user:', error);
      setRegistrationStatus('error');
    }
  };
//Login a user that has been registerd
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setToken(response.data.token);
      setIsAdmin(response.data.isAdmin); // Set the isAdmin flag
      setRegistrationStatus(null);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };


  // Log out the user
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditMode(true);
  };

  // Handle changes in the edit form fields
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Save the edited task
  const handleSaveEdit = async () => {
    try {
      if (!editingTask || !editingTask._id) {
        console.error('Invalid task data for editing');
        return;
      }

      const { _id, title, description } = editingTask;

      await axios.put(
        `${API_BASE_URL}/tasks/${_id}`,
        {
          title,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      setEditMode(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Fetch tasks from the server when the component mounts or the token changes
  useEffect(() => {
    fetchTasks();
  }, [token, fetchTasks]);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-title">Plan Pro</div>
        {token && (
          <>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
      <div className="container">
        {/* Show registration status messages */}
        {registrationStatus === 'success' && (
          <p className="success-message">Registration successful! Please login to continue.</p>
        )}
        {registrationStatus === 'error' && (
          <p className="error-message">Error registering user. Please try again.</p>
        )}
        {/* Show different content based on whether the user is logged in */}
        {token ? (
          <>
            {/* Render components for logged-in users */}
            <TaskForm onAddTask={handleAddTask} />
            <TaskList tasks={tasks} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
            {isAdmin && (
              <AdminDashboard API_BASE_URL={API_BASE_URL} token={token} />
            )}
          </>
        ) : (
          <div className="login-form">
            <div className="login-card">
              <h2 style={{ textAlign: 'center' }}>Login or Register:</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  className="login-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Checkbox for admin registration */}
                <label>
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={() => setIsAdmin(!isAdmin)}
                  />
                  Register as Admin
                </label>

                <button className="login-button" style={{ marginBottom: '10px' }} onClick={handleLogin}>Login</button>
                <button className="register-button" onClick={handleRegister}>Register</button>
                <p className='login-P'>or login in with:</p>

                {/* Google and Facebook login buttons */}
                <div className="social-login-buttons">
                  <a href="http://localhost:5000/api/auth/google" className="google-login-button">
                    <img
                      src={googleIcon} 
                      alt="Google Icon"
                      style={{ width: 'auto', height: '50px' }}
                    />
                  </a>
                  <a href="http://localhost:5000/api/auth/facebook" className="facebook-login-button">
                    <img
                      src={facebookIcon} 
                      alt="Facebook Icon"
                      style={{ width: 'auto', height: '50px' }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Show the edit modal when in edit mode */}
        {editMode && editingTask && (
          <div className="edit-modal">
            <h2>Edit Note</h2>
            <label htmlFor="edit-title">Note Title:</label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={editingTask.title}
              onChange={handleEditFormChange}
            />
            <label htmlFor="edit-description">Description:</label>
            <textarea
              id="edit-description"
              name="description"
              value={editingTask.description}
              onChange={handleEditFormChange}
            />
            <button className="save-button" onClick={handleSaveEdit}>Save</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
