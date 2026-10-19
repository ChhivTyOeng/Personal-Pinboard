import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const pinSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image_url: { type: String, required: true },
    destination_url: { type: String, default: '' },
    user_id: { type: mongoose.Schema.Types.Mixed, required: true },
    user: {
      id: mongoose.Schema.Types.Mixed,
      username: String,
      full_name: String,
      avatar_url: String,
      email: String,
    },
    board_id: { type: mongoose.Schema.Types.Mixed, default: null },
    board_name: { type: String, default: '' },
    category_id: { type: mongoose.Schema.Types.Mixed, default: null },
    category: {
      id: mongoose.Schema.Types.Mixed,
      name: String,
      slug: String,
    },
    tags: [{ type: String }],
    type: {
      type: String,
      enum: ['image', 'link', 'note', 'idea', 'video'],
      default: 'image',
    },
    is_private: { type: Boolean, default: false },
    is_hidden: { type: Boolean, default: false },
    likes_count: { type: Number, default: 0 },
    liked_by: [{ type: mongoose.Schema.Types.Mixed }],
    views_count: { type: Number, default: 0 },
    rating_avg: { type: Number, default: 5.0 },
    ratings_count: { type: Number, default: 0 },
    ratings: [
      {
        user_id: mongoose.Schema.Types.Mixed,
        score: Number,
        created_at: { type: Date, default: Date.now },
      },
    ],
    comments_count: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongoosePin = mongoose.models.Pin || mongoose.model('Pin', pinSchema);

// Universal Adapter for Pin
export const Pin = {
  schema: pinSchema,

  async find(params = {}) {
    if (isMongoConnected) {
      const mongoQuery = {};
      if (params.search) {
        mongoQuery.$or = [
          { title: { $regex: params.search, $options: 'i' } },
          { description: { $regex: params.search, $options: 'i' } },
          { tags: { $in: [new RegExp(params.search, 'i')] } },
        ];
      }
      if (params.categoryId) mongoQuery.category_id = params.categoryId;
      if (params.boardId) mongoQuery.board_id = params.boardId;
      if (params.userId) mongoQuery.user_id = params.userId;
      if (params.type && params.type !== 'all') mongoQuery.type = params.type;
      if (params.privacy === 'private') mongoQuery.is_private = true;
      else if (params.privacy === 'public') mongoQuery.is_private = false;
      if (!params.includeHidden) mongoQuery.is_hidden = { $ne: true };

      let query = MongoosePin.find(mongoQuery);
      if (params.sort === 'popular') query = query.sort({ likes_count: -1 });
      else if (params.sort === 'views') query = query.sort({ views_count: -1 });
      else query = query.sort({ created_at: -1 });

      return await query.exec();
    }

    const db = getLocalDb();
    let result = [...db.pins];

    if (!params.includeHidden) {
      result = result.filter((p) => !p.is_hidden);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (params.type && params.type !== 'all') {
      result = result.filter((p) => (p.type || 'image').toLowerCase() === params.type.toLowerCase());
    }
    if (params.privacy === 'private') {
      result = result.filter((p) => p.is_private);
    } else if (params.privacy === 'public') {
      result = result.filter((p) => !p.is_private);
    }
    if (params.categoryId) {
      result = result.filter((p) => String(p.category_id) === String(params.categoryId));
    }
    if (params.boardId || params.board) {
      const bId = String(params.boardId || params.board);
      result = result.filter((p) => String(p.board_id) === bId);
    }
    if (params.tag) {
      const tagLower = params.tag.toLowerCase();
      result = result.filter((p) => p.tags && p.tags.some((t) => t.toLowerCase() === tagLower));
    }
    if (params.userId) {
      result = result.filter((p) => String(p.user_id) === String(params.userId));
    }
    if (params.likedByUserId) {
      result = result.filter((p) => p.liked_by && p.liked_by.some((uid) => String(uid) === String(params.likedByUserId)));
    }

    // Sort
    if (params.sort === 'popular') {
      result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    } else if (params.sort === 'views') {
      result.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
    } else {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongoosePin.findById(id);
      } catch (e) {
        return null;
      }
    }
    const db = getLocalDb();
    return db.pins.find((p) => String(p.id) === String(id) || String(p._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoConnected) {
      return MongoosePin.findOne(query);
    }
    const pins = await this.find(query);
    return pins[0] || null;
  },

  async create(data) {
    if (isMongoConnected) {
      return MongoosePin.create(data);
    }
    const db = getLocalDb();
    const newId = Date.now();
    const newPin = {
      id: newId,
      _id: String(newId),
      title: data.title,
      description: data.description || '',
      image_url: data.image_url,
      destination_url: data.destination_url || '',
      user_id: data.user_id,
      user: data.user || null,
      board_id: data.board_id ? Number(data.board_id) : null,
      board_name: data.board_name || '',
      category_id: data.category_id ? Number(data.category_id) : null,
      category: data.category || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      type: data.type || 'image',
      is_private: Boolean(data.is_private),
      is_hidden: Boolean(data.is_hidden),
      likes_count: 0,
      liked_by: [],
      views_count: 0,
      rating_avg: 5.0,
      rating_count: 0,
      ratings_count: 0,
      ratings: [],
      comments_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.pins.unshift(newPin);
    saveLocalDb();
    return newPin;
  },

  async findByIdAndUpdate(id, updates = {}, options = { new: true }) {
    if (isMongoConnected) {
      return MongoosePin.findByIdAndUpdate(id, updates, options);
    }
    const db = getLocalDb();
    const index = db.pins.findIndex((p) => String(p.id) === String(id) || String(p._id) === String(id));
    if (index === -1) return null;

    db.pins[index] = {
      ...db.pins[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.pins[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return MongoosePin.findByIdAndDelete(id);
    }
    const db = getLocalDb();
    const index = db.pins.findIndex((p) => String(p.id) === String(id) || String(p._id) === String(id));
    if (index === -1) return null;
    const deleted = db.pins.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  },

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return MongoosePin.countDocuments(filter);
    }
    const pins = await this.find(filter);
    return pins.length;
  },
};

export default Pin;
