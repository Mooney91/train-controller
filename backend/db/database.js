const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const { MongoClient } = require("mongodb");

let dsnMongo = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}` +
               `@${process.env.ATLAS_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;

if (process.env.MONGO_DEPLOY === 'local') {
    dsnMongo = "mongodb://localhost:27017";
}

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
        // console.log(`*** getDb: Database: ${dbName} DSN: ${dsnMongo} ***`);

        try {
            const client = new MongoClient(dsnMongo, { monitorCommands: true });

            client.on("commandFailed", (event) => {
                console.log(`Received commandFailed: ${JSON.stringify(event, null, 2)}`);
            });

            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            return {
                db: db,
                collection: collection,
                client: client,
            };
        } catch (err) {
            console.log(`Error connecting to MongoDB database: ${dbName} with DSN: ${dsnMongo}`);
            console.log(err);
        }
    }
};

module.exports = database;
