import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const reportSchema = new mongoose.Schema(
  {
    pin_id: { type: mongoose.Schema.Types.Mixed, required: true },
    pin_title: { type: String, default: '' },
    pin_image: { type: String, default: '' },
    pin_author: { type: String, default: '' },
    reporter_id: { type: mongoose.Schema.Types.Mixed, required: true },
    reporter_username: { type: String, default: '' },
    reporter_email: { type: String, default: '' },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolution_notes: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongooseReport = mongoose.models.Report || mongoose.model('Report', reportSchema);

// Universal Adapter for Report
export const Report = {
  schema: reportSchema,

  async find(filter = {}) {
    if (isMongoConnected) {
      return MongooseReport.find(filter).sort({ created_at: -1 });
    }
    const db = getLocalDb();
    let result = [...db.reports];
    if (filter.status) {
      result = result.filter((r) => r.status === filter.status);
    }
    if (filter.pin_id) {
      result = result.filter((r) => String(r.pin_id) === String(filter.pin_id));
    }
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return result;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await MongooseReport.findById(id);
      } catch (e) {
        return null;
      }
    }
    const db = getLocalDb();
    return db.reports.find((r) => String(r.id) === String(id) || String(r._id) === String(id)) || null;
  },

  async findOne(query = {}) {
    if (isMongoConnected) {
      return MongooseReport.findOne(query);
    }
    const reports = await this.find(query);
    return reports[0] || null;
  },

  async create(data) {
    if (isMongoConnected) {
      return MongooseReport.create(data);
    }
    const db = getLocalDb();
    const newId = Date.now();
    const newReport = {
      id: newId,
      _id: String(newId),
      pin_id: data.pin_id,
      pin_title: data.pin_title || '',
      pin_image: data.pin_image || '',
      pin_author: data.pin_author || '',
      reporter_id: data.reporter_id,
      reporter_username: data.reporter_username || '',
      reporter_email: data.reporter_email || '',
      reason: data.reason,
      details: data.details || '',
      status: data.status || 'pending',
      resolution_notes: data.resolution_notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.reports.unshift(newReport);
    saveLocalDb();
    return newReport;
  },

  async findByIdAndUpdate(id, updates = {}, options = { new: true }) {
    if (isMongoConnected) {
      return MongooseReport.findByIdAndUpdate(id, updates, options);
    }
    const db = getLocalDb();
    const index = db.reports.findIndex((r) => String(r.id) === String(id) || String(r._id) === String(id));
    if (index === -1) return null;

    db.reports[index] = {
      ...db.reports[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.reports[index];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected) {
      return MongooseReport.findByIdAndDelete(id);
    }
    const db = getLocalDb();
    const index = db.reports.findIndex((r) => String(r.id) === String(id) || String(r._id) === String(id));
    if (index === -1) return null;
    const deleted = db.reports.splice(index, 1)[0];
    saveLocalDb();
    return deleted;
  },

  async countDocuments(filter = {}) {
    if (isMongoConnected) {
      return MongooseReport.countDocuments(filter);
    }
    const reports = await this.find(filter);
    return reports.length;
  },
};

export default Report;
