const User = require('../models/user');

// Create a new user
async function createUser(req, res) {
  try {
    const { username, email } = req.body;
    const newUser = new User(null, username, email);
    const createdUser = await User.createUser(newUser);
    res.status(201).json({ message: 'User created successfully', user: createdUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await User.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { username, email } = req.body;
    const updatedUser = new User(userId, username, email);
    const result = await User.updateUser(userId, updatedUser);
    res.status(200).json({ message: 'User updated successfully', user: result });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    await User.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {    
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
}

async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
};
