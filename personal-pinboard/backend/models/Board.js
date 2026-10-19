import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    cover_image_url: { type: String, default: '' },
    preview_images: [{ type: String }],
    user_id: { type: mongoose.Schema.Types.Mixed, required: true },
    is_private: { type: Boolean, default: false },
    pins_count: { type: Number, default: 0 },
    pin_ids: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongooseBoard = mongoose.models.Board || mongoose.model('Board', boardSchema);

// Universal Adapter for Board
export const Board = {
  schema: boardSchema,

  async find(filter = {}) {
    if (isMongoConnected) {
      return MongooseBoard.find(filter).sort({ created_at: -1 });
    }
    const db = getLocalDb();
    let result = [...db.boards];
    if (filter.user_id) {
      result = result.filter((b) => String(b.user_id) === String(filter.user_id));
    }
    if (filter.is_private !== undefined) {
      result = result.filter((b) => Boolean(b.is_private) === Boolean(filter.is_private));
    }
    return result;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseBoard.findById(id);
      } catch (e) {
        return null;
      }
    }
    const db = getLocalDb();
    return db.boards.find((b) => String(b.id) === String(id) || String(b._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoConnected) {
      return MongooseBoard.findOne(query);
    }
    const boards = await this.find(query);
    return boards[0] || null;
  },

  async create(data) {
    if (isMongoConnected) {
      return MongooseBoard.create(data);
    }
    const db = getLocalDb();
    const newId = Date.now();
    const newBoard = {
      id: newId,
      _id: String(newId),
      name: data.name,
      description: data.description || '',
      cover_image_url: data.cover_image_url || data.cover_image || '',
      preview_images: data.preview_images || [],
      user_id: data.user_id,
      is_private: Boolean(data.is_private || data.is_secret),
      pins_count: 0,
      pin_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.boards.unshift(newBoard);
    saveLocalDb();
    return newBoard;
  },

  async findByIdAndUpdate(id, updates = {}, options = { new: true }) {
    if (isMongoConnected) {
      return MongooseBoard.findByIdAndUpdate(id, updates, options);
    }
    const db = getLocalDb();
    const index = db.boards.findIndex((b) => String(b.id) === String(id) || String(b._id) === String(id));
    if (index === -1) return null;

    db.boards[index] = {
      ...db.boards[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.boards[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return MongooseBoard.findByIdAndDelete(id);
    }
    const db = getLocalDb();
    const index = db.boards.findIndex((b) => String(b.id) === String(id) || String(b._id) === String(id));
    if (index === -1) return null;
    const deleted = db.boards.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  },

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return MongooseBoard.countDocuments(filter);
    }
    const boards = await this.find(filter);
    return boards.length;
  },
};

export default Board;
