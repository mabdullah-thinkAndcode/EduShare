const sql = require("mssql");
require("dotenv").config();

const config = {
  server: process.env.DB_SERVER || "localhost",
  port: parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_NAME || "EduShare1",
  user: process.env.DB_USER || "edushare_user",
  password: process.env.DB_PASSWORD || "Eduahare@2024!",
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ Database connected successfully");
    }
    return pool;
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err;
  }
}

async function query(queryString, params = {}) {
  try {
    const connection = await getConnection();
    const request = connection.request();

    // Add parameters to request
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }

    const result = await request.query(queryString);
    return result;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
}

module.exports = {
  sql,
  getConnection,
  query,
};
