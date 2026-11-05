require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 3306),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("MySQL connection successful!");
        console.log("Connected database:", process.env.DB_NAME);

        const [tables] = await connection.query("SHOW TABLES");

        console.log("\nTables in database:");
        console.table(tables);
    } catch (error) {
        console.log("MySQL connection failed!");
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
    } finally {
        if (connection) await connection.end();
    }
})();
