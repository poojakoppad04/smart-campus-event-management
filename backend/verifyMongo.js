require("dotenv").config();
const { MongoClient } = require("mongodb");

(async () => {
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        await client.connect();

        const db = client.db(process.env.MONGO_DB_NAME);
        const collection = db.collection("activity_logs");

        console.log("MongoDB connected successfully");
        console.log("Total activity records:", await collection.countDocuments());

        const records = await collection
            .find({})
            .sort({ created_at: -1 })
            .limit(5)
            .toArray();

        console.log("\nLatest activity records:");
        console.log(JSON.stringify(records, null, 2));
    } catch (error) {
        console.log("MongoDB verification failed:", error.message);
    } finally {
        await client.close();
    }
})();
