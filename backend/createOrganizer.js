require("dotenv").config();
const db = require("./src/config/db");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  let conn;
  try {
    const ask = (q) => new Promise(resolve => rl.question(q, resolve));

    const name = await ask("Organizer name: ");
    const email = (await ask("Organizer email: ")).trim().toLowerCase();
    const department = await ask("Department: ");
    const password = await ask("Password (minimum 8 characters): ");

    if (!name.trim() || !email || !department.trim() || password.length < 8) {
      throw new Error("Invalid details. Complete all fields and use at least 8 password characters.");
    }

    conn = await db.getConnection();

    const [existing] = await conn.query(
      "SELECT organizer_id FROM ORGANIZER WHERE email = ?", [email]
    );

    if (existing.length) throw new Error("This email already exists.");

    const hash = await bcrypt.hash(password, 12);

    const [result] = await conn.query(
      "INSERT INTO ORGANIZER (name,email,phone,password,department) VALUES (?,?,NULL,?,?)",
      [name.trim(), email, hash, department.trim()]
    );

    console.log("\nOrganizer created successfully!");
    console.log("Organizer ID:", result.insertId);
    console.log("Email:", email);
  } catch (e) {
    console.error("\nERROR:", e.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    if (conn) conn.release();
    await db.end();
  }
})();
