const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register(username, password, isAdmin = false) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      username,
      password_hash,
      is_admin: isAdmin,
    });

    // Generate token
    const token = generateToken({ userId: user.id, username: user.username });

    return {
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      },
      token,
    };
  }

  async login(username, password) {
    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken({ userId: user.id, username: user.username });

    return {
      user: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
      },
      token,
    };
  }
}

module.exports = new AuthService();

