const { MongoClient } = require("mongodb");
const dsn = `mongodb://localhost:27017`;
let dbName = "trains";

if (process.env.NODE_ENV === 'test') {
    dbName = "test";
}

const collectionName = "tickets";

const database = {
    getDb: async function () {
        const client = new MongoClient(dsn);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
