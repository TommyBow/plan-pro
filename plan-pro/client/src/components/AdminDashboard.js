import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = ({ API_BASE_URL, token }) => {
  // State variable to store the list of users
  const [users, setUsers] = useState([]);

  // Fetch the list of users from the server
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [API_BASE_URL, token]);

  // Fetch the list of users when the component mounts or when the user list is updated
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Delete a user by their user ID
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <h3>User List</h3>
      <ul className="user-list">
        {/* Map over the list of users */}
        {users.map((user) => (
          <li key={user._id} className="user-list-item">
            <div className="user-info">
              <strong>{user.username}</strong>
              {/* Display an "Admin" badge if the user is an administrator */}
              {user.isAdmin && <span className="admin-badge">Admin</span>}
              {/* Display a delete button for non-admin users */}
              {!user.isAdmin && token && (
                <button className="delete-button" onClick={() => handleDeleteUser(user._id)}>
                  Delete User
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
