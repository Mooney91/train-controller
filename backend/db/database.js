const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const { MongoClient } = require("mongodb");
// const dsnMongo = "mongodb://localhost:27017";
const dsnMongo = "mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.djy5hpi.mongodb.net/?retryWrites=true&w=majority"
let dbName = "trains";

if (process.env.NODE_ENV === 'test') {
    dbName = "test";
}

const collectionName = "tickets";

const database = {
    openDb: async function openDb() {
        // console.log(`*** openDb: ${dbName}.sqlite ***`);

        return await open({
            filename: `./db/${dbName}.sqlite`,
            driver: sqlite3.Database
        });
    },

    getDb: function () {
        // console.log(`*** getDb: ${dbName} ***`);

        const client = new MongoClient(dsnMongo);
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
