import mariadb from 'mariadb';
import { config } from './config.mjs';

const pool = mariadb.createPool(config.db);

async function setupDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS queue (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        guildId VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        retryCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    if (conn) conn.end();
  }
}

setupDatabase();