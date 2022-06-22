const bcrypt = require('bcrypt');
const { User } = require('../models/User');
class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      passwordHash,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      password,
    });

    return user;
  }
}

exports.module = { UserService };
