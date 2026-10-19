import mongoose from 'mongoose';
import { isMongoConnected, getLocalDb, saveLocalDb } from '../config/db.js';
import { SEED_SETTINGS } from '../config/seedData.js';

// Mongoose Schema Definition
const settingSchema = new mongoose.Schema(
  {
    platform_name: { type: String, default: 'Personal Pinboard' },
    allow_registration: { type: Boolean, default: true },
    enable_comments: { type: Boolean, default: true },
    enable_ratings: { type: Boolean, default: true },
    require_moderation_threshold: { type: Number, default: 3 },
    maintenance_mode: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const MongooseSetting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

// Universal Adapter for Setting
export const Setting = {
  schema: settingSchema,

  async getSettings() {
    if (isMongoConnected) {
      let settings = await MongooseSetting.findOne();
      if (!settings) {
        settings = await MongooseSetting.create(SEED_SETTINGS);
      }
      return settings;
    }
    const db = getLocalDb();
    if (!db.settings) {
      db.settings = { ...SEED_SETTINGS };
      saveLocalDb();
    }
    return db.settings;
  },

  async updateSettings(data) {
    if (isMongoConnected) {
      let settings = await MongooseSetting.findOne();
      if (!settings) {
        return await MongooseSetting.create({ ...SEED_SETTINGS, ...data });
      }
      return await MongooseSetting.findByIdAndUpdate(settings._id, data, { new: true });
    }
    const db = getLocalDb();
    db.settings = {
      ...(db.settings || SEED_SETTINGS),
      ...data,
      updated_at: new Date().toISOString(),
    };
    saveLocalDb();
    return db.settings;
  },
};

export default Setting;
