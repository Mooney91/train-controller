const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const { MongoClient } = require("mongodb");
//const dsnMongo = "mongodb://localhost:27017";
//const dsnMongo = "mongodb+srv://jsramverk:KXzO5CuPQA@mycluster.fmupkp8.mongodb.net/" +
//                 "?retryWrites=true&w=majority";
const dsnMongo = "mongodb+srv://trainController:jsramverkTrains2023@cluster0.djy5hpi.mongodb.net/" +
                 "?retryWrites=true&w=majority";
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
        console.log(`*** getDb: Database: ${dbName} DSN: ${dsnMongo} ***`);

        const client = new MongoClient(dsnMongo, { monitorCommands: true });

        client.on("commandFailed", (event) => {
            console.log(`Received commandFailed: ${JSON.stringify(event, null, 2)}`);
        });

        try {
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
