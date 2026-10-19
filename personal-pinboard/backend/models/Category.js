import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image_url: { type: String, default: '' },
    pins_count: { type: Number, default: 0 },
    type: { type: String, default: 'personal' },
    members: [
      {
        id: mongoose.Schema.Types.Mixed,
        name: String,
        email: String,
        avatar_url: String,
        role: { type: String, default: 'viewer' },
      },
    ],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongooseCategory = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Universal Adapter for Category
export const Category = {
  schema: categorySchema,

  async find(filter = {}) {
    if (isMongoConnected) {
      return MongooseCategory.find(filter).sort({ id: 1 });
    }
    const db = getLocalDb();
    let result = [...db.categories];
    if (filter.slug) {
      result = result.filter((c) => c.slug === filter.slug);
    }
    return result;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseCategory.findById(id);
      } catch (e) {
        return null;
      }
    }
    const db = getLocalDb();
    return db.categories.find((c) => String(c.id) === String(id) || String(c._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoConnected) {
      return MongooseCategory.findOne(query);
    }
    const db = getLocalDb();
    return (
      db.categories.find((c) => {
        if (query.slug && c.slug === query.slug) return true;
        if (query.id && String(c.id) === String(query.id)) return true;
        if (query._id && (String(c._id) === String(query._id) || String(c.id) === String(query._id))) return true;
        return false;
      }) || null
    );
  },

  async create(data) {
    if (isMongoConnected) {
      return MongooseCategory.create(data);
    }
    const db = getLocalDb();
    const newId = Date.now();
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCategory = {
      id: newId,
      _id: String(newId),
      name: data.name,
      slug,
      description: data.description || '',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      pins_count: 0,
      type: data.type || 'personal',
      members: data.members || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.categories.push(newCategory);
    saveLocalDb();
    return newCategory;
  },

  async findByIdAndUpdate(id, updates = {}, options = { new: true }) {
    if (isMongoConnected) {
      return MongooseCategory.findByIdAndUpdate(id, updates, options);
    }
    const db = getLocalDb();
    const index = db.categories.findIndex((c) => String(c.id) === String(id) || String(c._id) === String(id));
    if (index === -1) return null;

    db.categories[index] = {
      ...db.categories[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.categories[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return MongooseCategory.findByIdAndDelete(id);
    }
    const db = getLocalDb();
    const index = db.categories.findIndex((c) => String(c.id) === String(id) || String(c._id) === String(id));
    if (index === -1) return null;
    const deleted = db.categories.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  },

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return MongooseCategory.countDocuments(filter);
    }
    const categories = await this.find(filter);
    return categories.length;
  },
};

export default Category;
