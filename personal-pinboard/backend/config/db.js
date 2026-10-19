import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_BOARDS,
  SEED_PINS,
  SEED_COMMENTS,
  SEED_REPORTS,
  SEED_SETTINGS,
  SEED_AUDIT_LOGS,
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'pinboard_db.json');

export let isMongoConnected = false;

// Local JSON persistent storage cache
let localDatabase = null;

// Initialize local data directory and seed file
export const initLocalDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    localDatabase = {
      users: [...SEED_USERS],
      categories: [...SEED_CATEGORIES],
      boards: [...SEED_BOARDS],
      pins: [...SEED_PINS],
      comments: [...SEED_COMMENTS],
      reports: [...SEED_REPORTS],
      settings: { ...SEED_SETTINGS },
      auditLogs: [...SEED_AUDIT_LOGS],
    };
    saveLocalDb();
    console.log('[DB] Local database initialized with complete seed data.');
  } else {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      localDatabase = JSON.parse(content);
      console.log('[DB] Local persistent database loaded successfully.');
    } catch (e) {
      console.error('[DB] Error loading local database file, re-initializing seed data.', e);
      localDatabase = {
        users: [...SEED_USERS],
        categories: [...SEED_CATEGORIES],
        boards: [...SEED_BOARDS],
        pins: [...SEED_PINS],
        comments: [...SEED_COMMENTS],
        reports: [...SEED_REPORTS],
        settings: { ...SEED_SETTINGS },
        auditLogs: [...SEED_AUDIT_LOGS],
      };
      saveLocalDb();
    }
  }
};

export const getLocalDb = () => {
  if (!localDatabase) {
    initLocalDb();
  }
  return localDatabase;
};

export const saveLocalDb = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(localDatabase, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to save local database:', err);
  }
};

// Main connectDB function
export const connectDB = async () => {
  initLocalDb();

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personal_pinboard';

  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoUri}`);
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(' [DB] MongoDB Connected Successfully!');
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️  [DB] MongoDB not running or unreachable (${err.message}).`);
    console.log('⚡ [DB] Operating seamlessly with local persistent JSON database engine.');
  }
};

export default connectDB;
