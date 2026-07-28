// test-db.js
const { getConnection } = require("./config/db.config");

async function testConnection() {
  try {
    console.log("🔄 Testing database connection...");
    console.log("");

    const pool = await getConnection();
    console.log("✅ Database connected successfully!");
    console.log("");

    // Test 1: Get SQL Server version
    console.log("📊 Test 1: Checking SQL Server version...");
    const versionResult = await pool
      .request()
      .query("SELECT @@VERSION AS version");
    console.log(
      "   Version:",
      versionResult.recordset[0].version.split("\n")[0]
    );
    console.log("");

    // Test 2: Check if Edushare database exists
    console.log("📊 Test 2: Checking if Edushare database exists...");
    const dbCheck = await pool.request().query(`
      SELECT name FROM sys.databases WHERE name = 'Edushare1'
    `);

    if (dbCheck.recordset.length > 0) {
      console.log("   ✅ Edushare database found!");
      console.log("");

      // Test 3: List all tables
      console.log("📊 Test 3: Listing all tables in Edushare database...");
      const tableCheck = await pool.request().query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_CATALOG = 'Edushare1' AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
      `);

      if (tableCheck.recordset.length > 0) {
        console.log("   Tables found:");
        tableCheck.recordset.forEach((table) => {
          console.log("   - " + table.TABLE_NAME);
        });
        console.log("");

        // Test 4: Count records in users table
        console.log("📊 Test 4: Checking users table...");
        try {
          const userCount = await pool
            .request()
            .query("SELECT COUNT(*) as count FROM users");
          console.log("   Users in database:", userCount.recordset[0].count);
          console.log("");
        } catch (err) {
          console.log("   ⚠️  Could not read users table:", err.message);
          console.log("");
        }

        // Test 5: Count records in books table
        console.log("📊 Test 5: Checking books table...");
        try {
          const bookCount = await pool
            .request()
            .query("SELECT COUNT(*) as count FROM books");
          console.log("   Books in database:", bookCount.recordset[0].count);
          console.log("");
        } catch (err) {
          console.log("   ⚠️  Could not read books table:", err.message);
          console.log("");
        }
      } else {
        console.log("   ⚠️  No tables found in Edushare database!");
        console.log(
          "   You may need to run your database schema creation script."
        );
        console.log("");
      }
    } else {
      console.log("   ❌ Edushare database NOT found!");
      console.log(
        "   Please create the database first using SQL Server Management Studio."
      );
      console.log("");
    }

    // Test 6: Check current connection details
    console.log("📊 Test 6: Connection details...");
    const connDetails = await pool.request().query(`
  SELECT
    SUSER_SNAME() AS login_name,
    SYSTEM_USER AS sys_user,
    DB_NAME() AS database_name
`);
    console.log("   Login:", connDetails.recordset[0].login_name);
    console.log("   System User:", connDetails.recordset[0].system_user);
    console.log("   Database:", connDetails.recordset[0].database_name);
    console.log("");

    console.log("✅ All tests completed successfully!");
    console.log(
      "🎉 Your database is ready to use with the Express application."
    );
    console.log("");

    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error("");
    console.error("❌ Connection test failed!");
    console.error("");
    console.error("Error details:");
    console.error("  Message:", err.message);
    console.error("  Code:", err.code);
    console.error("");

    if (err.code === "ESOCKET") {
      console.error("💡 Troubleshooting tips:");
      console.error("  1. Make sure SQL Server service is running");
      console.error("  2. Check your DB_SERVER in .env file");
      console.error(
        "  3. Verify TCP/IP is enabled in SQL Server Configuration Manager"
      );
      console.error("  4. Try DB_SERVER=localhost or DB_SERVER=.\\SQLEXPRESS");
    } else if (err.code === "ELOGIN") {
      console.error("💡 Troubleshooting tips:");
      console.error("  1. Check if Windows Authentication is enabled");
      console.error("  2. Verify you have permission to access the database");
      console.error("  3. Try running as administrator");
    } else if (err.message.includes("Cannot open database")) {
      console.error("💡 Troubleshooting tips:");
      console.error('  1. Database "Edushare" does not exist');
      console.error("  2. Create it in SQL Server Management Studio");
      console.error("  3. Run your schema creation script");
    }

    console.error("");
    console.error("Full error object:");
    console.error(err);
    console.error("");

    process.exit(1);
  }
}

console.log("");
console.log("=".repeat(60));
console.log("        EDUSHARE - DATABASE CONNECTION TEST");
console.log("=".repeat(60));
console.log("");

testConnection();
