require("dotenv").config();

const mysql = require("mysql2/promise");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function convertTime(value) {
  if (!value) return value;

  const [hours, minutes, seconds] = String(value)
    .split(":")
    .map(Number);

  const date = new Date("1970-01-01T00:00:00.000Z");
  date.setUTCHours(hours, minutes, seconds || 0, 0);

  return date;
}

async function migrate() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to MySQL.");

    await prisma.$connect();
    console.log("Connected to PostgreSQL.");

    const tables = [
      "STUDENT",
      "ORGANIZER",
      "VENUE",
      "EVENT",
      "REGISTRATION",
      "FEEDBACK",
    ];

    const source = {};

    for (const table of tables) {
      const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
      source[table] = rows;
      console.log(`${table}: ${rows.length} source records`);
    }

    const destinationCounts = await prisma.$transaction(async (tx) => {
      const existing =
        await tx.student.count() +
        await tx.organizer.count() +
        await tx.venue.count() +
        await tx.event.count() +
        await tx.registration.count() +
        await tx.feedback.count();

      if (existing !== 0) {
        throw new Error(
          "PostgreSQL already contains application records. Migration stopped."
        );
      }

      for (const row of source.STUDENT) {
        await tx.student.create({
          data: {
            studentId: row.student_id,
            name: row.name,
            email: row.email,
            password: row.password,
            department: row.department,
            yearOfStudy: row.year_of_study,
            createdAt: row.created_at,
            phone: row.phone,
          },
        });
      }

      for (const row of source.ORGANIZER) {
        await tx.organizer.create({
          data: {
            organizerId: row.organizer_id,
            name: row.name,
            email: row.email,
            password: row.password,
            department: row.department,
            createdAt: row.created_at,
          },
        });
      }

      for (const row of source.VENUE) {
        await tx.venue.create({
          data: {
            venueId: row.venue_id,
            venueName: row.venue_name,
            location: row.location,
            capacity: row.capacity,
            availabilityStatus: row.availability_status,
          },
        });
      }

      for (const row of source.EVENT) {
        await tx.event.create({
          data: {
            eventId: row.event_id,
            title: row.title,
            description: row.description,
            eventDate: row.event_date,
            startTime: convertTime(row.start_time),
            endTime: convertTime(row.end_time),
            organizerId: row.organizer_id,
            venueId: row.venue_id,
            maxParticipants: row.max_participants,
            status: row.status,
            createdAt: row.created_at,
          },
        });
      }

      for (const row of source.REGISTRATION) {
        await tx.registration.create({
          data: {
            registrationId: row.registration_id,
            studentId: row.student_id,
            eventId: row.event_id,
            registrationDate: row.registration_date,
            status: row.status,
          },
        });
      }

      for (const row of source.FEEDBACK) {
        await tx.feedback.create({
          data: {
            feedbackId: row.feedback_id,
            studentId: row.student_id,
            eventId: row.event_id,
            rating: row.rating,
            comments: row.comments,
            feedbackDate: row.feedback_date,
          },
        });
      }

      return {
        STUDENT: await tx.student.count(),
        ORGANIZER: await tx.organizer.count(),
        VENUE: await tx.venue.count(),
        EVENT: await tx.event.count(),
        REGISTRATION: await tx.registration.count(),
        FEEDBACK: await tx.feedback.count(),
      };
    });

    console.log("\nMigration completed successfully!");
    console.table(destinationCounts);

  } catch (error) {
    console.error("\nMigration failed:", error.message);
    console.error("PostgreSQL transaction was rolled back if it had started.");
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
    await prisma.$disconnect();
  }
}

migrate();
