const { getMongoDB } = require("../config/mongo");

const logActivity = async ({
  userId,
  userRole,
  action,
  details = {},
}) => {
  try {
    const db = getMongoDB();

    await db.collection("activity_logs").insertOne({
      user_id: userId,
      user_role: userRole,
      action,
      details,
      created_at: new Date(),
    });
  } catch (error) {
    // Logging failures should not interrupt the main application.
    console.error("Activity logging failed:", error.message);
  }
};

module.exports = logActivity;
