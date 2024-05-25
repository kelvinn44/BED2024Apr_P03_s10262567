const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, username, email) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  static async createUser(newUser) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Insert the new user into the Users table
      const insertQuery = `INSERT INTO Users (username, email) 
                           OUTPUT INSERTED.id, INSERTED.username, INSERTED.email
                           VALUES (@username, @email)`;

      const request = connection.request();
      request.input('username', sql.VarChar, newUser.username);
      request.input('email', sql.VarChar, newUser.email);

      const result = await request.query(insertQuery);

      // Extract the inserted user's data from the result
      const insertedUser = result.recordset[0];
      return new User(insertedUser.id, insertedUser.username, insertedUser.email);
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async getAllUsers() {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Select all users from the Users table
      const selectQuery = `SELECT * FROM Users`;
      const request = connection.request();
      const result = await request.query(selectQuery);

      // Map the result to an array of User objects
      return result.recordset.map(row => new User(row.id, row.username, row.email));
    } catch (err) {
      console.error("Error retrieving users:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async getUserById(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Select user by ID from the Users table
      const selectQuery = `SELECT * FROM Users WHERE id = @id`;
      const request = connection.request();
      request.input('id', sql.Int, id);
      const result = await request.query(selectQuery);

      // Return the user object or null if not found
      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new User(row.id, row.username, row.email);
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error retrieving user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async updateUser(id, updatedUser) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Update user information in the Users table
      const updateQuery = `UPDATE Users
                           SET username = @username, email = @email
                           WHERE id = @id`;
      const request = connection.request();
      request.input('id', sql.Int, id);
      request.input('username', sql.VarChar, updatedUser.username);
      request.input('email', sql.VarChar, updatedUser.email);

      await request.query(updateQuery);

      // Optionally return updated user information
      return await User.getUserById(id);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async deleteUser(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Delete user from the Users table
      const deleteQuery = `DELETE FROM Users WHERE id = @id`;
      const request = connection.request();
      request.input('id', sql.Int, id);

      await request.query(deleteQuery);

      return { message: "User deleted successfully" };
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM Users
        WHERE username LIKE '%${searchTerm}%'
          OR email LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);
      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }

  static async getUsersWithBooks() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.id
        LEFT JOIN Books b ON ub.book_id = b.id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their books
      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            id: userId,
            username: row.username,
            email: row.email,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }
}

module.exports = User;
