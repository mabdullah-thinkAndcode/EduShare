const sql = require("mssql");
const bcrypt = require("bcryptjs"); // bcryptjs

// MSSQL config
const config = {
  user: "edushare_user",
  password: "Edushare@2024!",
  server: "localhost",
  database: "Edushare1",
  options: {
    encrypt: false,
    trustServerCertificate: true, // if needed locally
  },
};

async function hashAllPasswords() {
  try {
    const pool = await sql.connect(config);

    // 1️⃣ Get all users
    const result = await pool
      .request()
      .query("SELECT user_id, password FROM users");
    const users = result.recordset;

    console.log(`Total users: ${users.length}`);

    // 2️⃣ Hash each password
    for (const user of users) {
      const plainPassword = user.password;

      // Skip if already hashed
      if (plainPassword.startsWith("$2")) continue;

      const hashed = await bcrypt.hash(plainPassword, 10);

      // 3️⃣ Update user
      await pool
        .request()
        .input("user_id", sql.Int, user.user_id)
        .input("password", sql.VarChar, hashed)
        .query(
          "UPDATE users SET password = @password WHERE user_id = @user_id"
        );

      console.log(`Hashed password for user ID: ${user.user_id}`);
    }

    console.log("✅ All passwords hashed successfully!");
    pool.close();
  } catch (err) {
    console.error(err);
  }
}

hashAllPasswords();
