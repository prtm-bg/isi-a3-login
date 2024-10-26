import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Modal from 'react-modal';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    image: null,
    image_base64: ''
  });
  const [actionType, setActionType] = useState('');
  const [imageError, setImageError] = useState('');

  const fetchUsers = async () => {
    const token = Cookies.get('access_token');
    const response = await axios.get('http://152.67.176.72:8081/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(response.data["users_data"]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (500KB = 500 * 1024 bytes)
      if (file.size > 500 * 1024) {
        setImageError('Image size must be less than 500KB');
        e.target.value = '';
        return;
      }
      setImageError('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setNewUser(prev => ({
          ...prev,
          image: file,
          image_base64: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (user, action) => {
    setActionType(action);
    setNewUser(user ? { 
      username: user.username, 
      email: user.email, 
      password: '', 
      confirmPassword: '',
      image: null,
      image_base64: user.image_base64 || ''
    } : { 
      username: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      image: null,
      image_base64: ''
    });
    setModalIsOpen(true);
    setImageError('');
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setImageError('');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = Cookies.get('access_token');
    
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://152.67.176.72:8081/register', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        image_base64: newUser.image_base64
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = Cookies.get('access_token');
    try {
      await axios.post('http://152.67.176.72:8081/update', {
        username: newUser.username,
        email: newUser.email,
        image_base64: newUser.image_base64
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (username) => {
    const token = Cookies.get('access_token');
    try {
      const response = await axios.delete(`http://152.67.176.72:8081/delete_user?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        alert("User deleted successfully.");
      }
      fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("You cannot delete yourself.");
      } else {
        console.error("An error occurred while deleting the user:", error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">User Management</h1>
      <button onClick={() => openModal(null, 'add')} className="bg-blue-500 text-white p-2 mb-4">
        Add User
      </button>

      <table className="min-w-full bg-transparent border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.username}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <button onClick={() => openModal(user, 'view')} className="text-blue-500">View</button>
                <button onClick={() => openModal(user, 'update')} className="text-green-500 ml-2">Update</button>
                <button onClick={() => handleDeleteUser(user.username)} className="text-red-500 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        },
        content: {
          position: 'absolute',
          top: '2em',
          left: '20em',
          right: '20em',
          bottom: '2em',
          border: '1px solid #ccc',
          background: '#000',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '20px',
          outline: 'none',
          paddingBlock: '4em',
          paddingInline: '4em'
        }
      }} isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2 className="text-2xl mb-4">
          {actionType === 'add' ? 'Add User' : actionType === 'update' ? 'Update User' : 'View User'}
        </h2>
        <form onSubmit={actionType === 'add' ? handleAddUser : handleUpdateUser} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="p-2 border rounded"
              required
              readOnly={actionType === 'view' || actionType === 'update'}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-2 border rounded"
              required
              readOnly={actionType === 'view'}
            />
            {actionType === 'add' && (
              <>
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="p-2 border rounded"
                  required
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white">Profile Image (max 500KB)</label>
            {actionType !== 'view' && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-2 border rounded"
              />
            )}
            {imageError && <p className="text-red-500">{imageError}</p>}
            {newUser.image_base64 && (
              <div className="mt-2">
                <p className="mb-2">Preview:</p>
                <img
                  src={newUser.image_base64}
                  alt="Preview"
                  className="max-w-xs max-h-48 object-contain"
                />
              </div>
            )}
          </div>

          {actionType !== 'view' && (
            <button 
              type="submit" 
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
              disabled={!!imageError}
            >
              {actionType === 'add' ? 'Add User' : 'Update User'}
            </button>
          )}
        </form>
        <button 
          onClick={closeModal} 
          className="mt-4 text-red-500 hover:text-red-600 transition-colors"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default UserTable;