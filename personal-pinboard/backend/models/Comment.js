import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const commentSchema = new mongoose.Schema(
  {
    pin_id: { type: mongoose.Schema.Types.Mixed, required: true },
    user_id: { type: mongoose.Schema.Types.Mixed, required: true },
    user: {
      id: mongoose.Schema.Types.Mixed,
      username: String,
      full_name: String,
      avatar_url: String,
      email: String,
    },
    content: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongooseComment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

// Universal Adapter for Comment
export const Comment = {
  schema: commentSchema,

  async find(filter = {}) {
    if (isMongoConnected) {
      return MongooseComment.find(filter).sort({ created_at: -1 });
    }
    const db = getLocalDb();
    let result = [...db.comments];
    if (filter.pin_id) {
      result = result.filter((c) => String(c.pin_id) === String(filter.pin_id));
    }
    if (filter.user_id) {
      result = result.filter((c) => String(c.user_id) === String(filter.user_id));
    }
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return result;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseComment.findById(id);
      } catch (e) {
        return null;
      }
    }
    const db = getLocalDb();
    return db.comments.find((c) => String(c.id) === String(id) || String(c._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoConnected) {
      return MongooseComment.findOne(query);
    }
    const comments = await this.find(query);
    return comments[0] || null;
  },

  async create(data) {
    if (isMongoConnected) {
      return MongooseComment.create(data);
    }
    const db = getLocalDb();
    const newId = Date.now();
    const newComment = {
      id: newId,
      _id: String(newId),
      pin_id: data.pin_id,
      user_id: data.user_id,
      user: data.user || null,
      content: data.content || data.text || '',
      rating: data.rating ? Number(data.rating) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.comments.unshift(newComment);
    saveLocalDb();
    return newComment;
  },

  async findByIdAndUpdate(id, updates = {}, options = { new: true }) {
    if (isMongoConnected) {
      return MongooseComment.findByIdAndUpdate(id, updates, options);
    }
    const db = getLocalDb();
    const index = db.comments.findIndex((c) => String(c.id) === String(id) || String(c._id) === String(id));
    if (index === -1) return null;

    db.comments[index] = {
      ...db.comments[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.comments[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return MongooseComment.findByIdAndDelete(id);
    }
    const db = getLocalDb();
    const index = db.comments.findIndex((c) => String(c.id) === String(id) || String(c._id) === String(id));
    if (index === -1) return null;
    const deleted = db.comments.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  },

  async deleteMany(filter = {}) {
    if (isMongoConnected) {
      return MongooseComment.deleteMany(filter);
    }
    const db = getLocalDb();
    if (filter.pin_id) {
      db.comments = db.comments.filter((c) => String(c.pin_id) !== String(filter.pin_id));
      saveLocalDb();
    }
    return { acknowledged: true };
  },

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return MongooseComment.countDocuments(filter);
    }
    const comments = await this.find(filter);
    return comments.length;
  },
};

export default Comment;
