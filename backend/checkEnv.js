require("dotenv").config();

for (const key of ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"]) {
    const value = process.env[key];

    console.log(
        key + ": " +
        (value ? (key === "DB_PASSWORD" ? "SET" : value) : "MISSING/EMPTY")
    );
}
