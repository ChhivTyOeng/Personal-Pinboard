import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    full_name: { type: String, default: '' },
    avatar_url: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    pins_count: { type: Number, default: 0 },
    boards_count: { type: Number, default: 0 },
    auth_provider: { type: String, default: 'local' },
    created_at: { type: Date, default: Date.now },
    last_login: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

// Universal Adapter for User
export const User = {
  schema: userSchema,

  async find(filter = {}) {
    if (isMongoConnected) {
      return MongooseUser.find(filter);
    }
    const db = getLocalDb();
    let result = [...db.users];
    if (filter.role) {
      result = result.filter((u) => u.role === filter.role);
    }
    if (filter.status) {
      result = result.filter((u) => (u.status || 'active') === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.full_name && u.full_name.toLowerCase().includes(q))
      );
    }
    return result;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseUser.findById(id);
      } catch (e) {
        return null;
      }
    }
    const db = getLocalDb();
    return db.users.find((u) => String(u.id) === String(id) || String(u._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoConnected) {
      return MongooseUser.findOne(query);
    }
    const db = getLocalDb();
    return (
      db.users.find((u) => {
        if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return true;
        if (query.username && u.username.toLowerCase() === query.username.toLowerCase()) return true;
        if (query.id && String(u.id) === String(query.id)) return true;
        if (query._id && (String(u._id) === String(query._id) || String(u.id) === String(query._id))) return true;
        return false;
      }) || null
    );
  },

  async create(data) {
    if (isMongoConnected) {
      return MongooseUser.create(data);
    }
    const db = getLocalDb();
    const newUser = {
      id: Date.now(),
      _id: String(Date.now()),
      username: data.username,
      email: data.email.toLowerCase(),
      password: data.password.startsWith('$2') ? data.password : bcrypt.hashSync(data.password, 10),
      full_name: data.full_name || data.username,
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: data.bio || '',
      role: data.role || 'user',
      status: data.status || 'active',
      pins_count: 0,
      boards_count: 0,
      auth_provider: data.auth_provider || 'local',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveLocalDb();
    return newUser;
  },

  async findByIdAndUpdate(id, updates = {}, options = { new: true }) {
    if (isMongoConnected) {
      return MongooseUser.findByIdAndUpdate(id, updates, options);
    }
    const db = getLocalDb();
    const index = db.users.findIndex((u) => String(u.id) === String(id) || String(u._id) === String(id));
    if (index === -1) return null;

    db.users[index] = {
      ...db.users[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.users[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return MongooseUser.findByIdAndDelete(id);
    }
    const db = getLocalDb();
    const index = db.users.findIndex((u) => String(u.id) === String(id) || String(u._id) === String(id));
    if (index === -1) return null;
    const deleted = db.users.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  },

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return MongooseUser.countDocuments(filter);
    }
    const users = await this.find(filter);
    return users.length;
  },
};

export default User;
