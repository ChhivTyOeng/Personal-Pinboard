import { isPostgresConnected, pool, getLocalDb, saveLocalDb } from '../config/db.js';

export const AuditLog = {
  async find(filter = {}) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
      return res.rows.map((row) => ({
        ...row,
        performed_by: typeof row.performed_by === 'string' ? JSON.parse(row.performed_by) : row.performed_by,
      }));
    }

    const db = getLocalDb();
    let result = [...(db.auditLogs || [])];
    result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return result.slice(0, 100);
  },

  async create(data) {
    if (isPostgresConnected && pool) {
      const sql = `
        INSERT INTO audit_logs (action, performed_by, target_type, target_id, details, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;
      const params = [
        data.action,
        JSON.stringify(data.performed_by || {}),
        data.target_type || '',
        String(data.target_id || ''),
        typeof data.details === 'object' ? JSON.stringify(data.details) : String(data.details || ''),
        data.ip_address || '',
      ];
      const res = await pool.query(sql, params);
      const row = res.rows[0];
      return {
        ...row,
        performed_by: data.performed_by,
      };
    }

    const db = getLocalDb();
    if (!db.auditLogs) db.auditLogs = [];
    const newId = Date.now();
    const newLog = {
      id: newId,
      action: data.action,
      performed_by: data.performed_by || null,
      target_type: data.target_type || '',
      target_id: data.target_id || '',
      details: data.details || '',
      ip_address: data.ip_address || '',
      created_at: new Date().toISOString(),
    };
    db.auditLogs.unshift(newLog);
    if (db.auditLogs.length > 200) {
      db.auditLogs = db.auditLogs.slice(0, 200);
    }
    saveLocalDb();
    return newLog;
  },

  async clearAll() {
    if (isPostgresConnected && pool) {
      await pool.query('DELETE FROM audit_logs');
      return { success: true };
    }

    const db = getLocalDb();
    db.auditLogs = [];
    saveLocalDb();
    return { success: true };
  },
};

export default AuditLog;
