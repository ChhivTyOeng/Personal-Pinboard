import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';

// Mongoose Schema Definition
const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performed_by: {
      id: mongoose.Schema.Types.Mixed,
      username: String,
      full_name: String,
      email: String,
    },
    target_type: { type: String, default: '' },
    target_id: { type: mongoose.Schema.Types.Mixed, default: '' },
    details: { type: mongoose.Schema.Types.Mixed, default: '' },
    ip_address: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at' } }
);

const MongooseAuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

// Universal Adapter for AuditLog
export const AuditLog = {
  schema: auditLogSchema,

  async find(filter = {}) {
    if (isMongoConnected) {
      return MongooseAuditLog.find(filter).sort({ created_at: -1 }).limit(100);
    }
    const db = getLocalDb();
    let result = [...(db.auditLogs || [])];
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return result.slice(0, 100);
  },

  async create(data) {
    if (isMongoConnected) {
      return MongooseAuditLog.create(data);
    }
    const db = getLocalDb();
    if (!db.auditLogs) db.auditLogs = [];
    const newId = Date.now();
    const newLog = {
      id: newId,
      _id: String(newId),
      action: data.action,
      performed_by: data.performed_by || null,
      target_type: data.target_type || '',
      target_id: data.target_id || '',
      details: data.details || '',
      ip_address: data.ip_address || '',
      created_at: new Date().toISOString(),
    };
    db.auditLogs.unshift(newLog);
    // Keep max 200 logs
    if (db.auditLogs.length > 200) {
      db.auditLogs = db.auditLogs.slice(0, 200);
    }
    saveLocalDb();
    return newLog;
  },

  async clearAll() {
    if (isMongoConnected) {
      return MongooseAuditLog.deleteMany({});
    }
    const db = getLocalDb();
    db.auditLogs = [];
    saveLocalDb();
    return { success: true };
  },
};

export default AuditLog;
