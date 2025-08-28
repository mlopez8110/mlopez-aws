import mysql from 'mysql2/promise';

export class RdsAppointmentRepository {
  private pool: mysql.Pool;

  constructor() {
    const host = process.env.RDS_HOST;
    const user = process.env.RDS_USER;
    const password = process.env.RDS_PASSWORD;
    const database = process.env.RDS_DATABASE;
    if (!host || !user || !database) {
      throw new Error('RDS credenciales no establecidas');
    }
    this.pool = mysql.createPool({
      host, user, password, database, waitForConnections: true, connectionLimit: 5
    });
  }

  async saveToRDS(payload: any) {

    const {
      appointmentId, insuredId, scheduleId, countryISO,
      centerId = null, specialtyId = null, medicId = null, date = null, createdAt = new Date().toISOString()
    } = payload;
    const sql = `INSERT INTO rds_mysql (appointment_id, insuredId, scheduleId, centerId, specialtyId, medicId, date, countryISO, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [appointmentId, insuredId, scheduleId, centerId, specialtyId, medicId, date, countryISO, createdAt];
    const conn = await this.pool.getConnection();
    try {
      await conn.execute(sql, params);
    } finally {
      conn.release();
    }
  }
}
