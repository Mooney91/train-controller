const database = require('../db/database.js');

const trains = {
    fetchAllDelayedTrains: async function fetchAllDelayedTrains() {
        // CHANGED FROM SQL (openDb) TO MONGODB (getDb)
        let db;

        try {
            db = await database.getDb();

            const filter = { code: code };
            const keyObject = await db.collection.findOne(filter);

            if (keyObject) {
                return res.json({ data: keyObject });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    }
};

module.exports = trains;
