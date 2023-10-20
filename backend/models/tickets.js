const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res) {
        let allTickets = [];

        if (process.env.DB === 'sqlite') {
            const db = await database.openDb();

            allTickets = await db.all(`SELECT *, ROWID as id FROM tickets ORDER BY ROWID DESC`);

            await db.close();
        } else {
            const db = database.getDb();
            const options = {
                sort: { id: "desc" },
                // projection: { _id: 0 }
            };

            allTickets = await db.collection.find({}, options).toArray();

            await db.client.close();
        }

        if (res !== undefined) {
            return res.status(200).json({
                data: allTickets
            });
        } else {
            return allTickets;
        }
    },

    createTicket: async function createTicket(req, res) {
        let newId = 0;

        if (process.env.DB === 'sqlite') {
            const db = await database.openDb();

            const result = await db.run(
                'INSERT INTO tickets (code, trainnumber, traindate) VALUES (?, ?, ?)',
                [ req.body.code, req.body.trainnumber, req.body.traindate],
                async (err) => {
                    if (err) {
                        await db.close();
                        console.log("Failed to insert new ticket in database.\n", err.message);

                        return res.status(500).json({
                            data: {}
                        });
                    }
                }
            );

            await db.close();
            newId = result.lastID;
        } else {
            const db = database.getDb();
            const numTickets = await db.collection.countDocuments({}, { hint: "_id_" });

            newId = numTickets + 1;
            const doc = {
                id: newId,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate
            };

            const result = await db.collection.insertOne(doc);

            await db.client.close();

            if (!result.acknowledged) {
                console.log("Failed to insert new ticket in database.");

                return res.status(500).json({
                    data: {}
                });
            }
        }

        return res.status(201).json({
            data: {
                id: newId,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    },

    updateTicket: async function updateTicket(req, res) {
        const db = database.getDb();
        const ObjectId = require('mongodb').ObjectId;
        const filter = { _id: new ObjectId(req.body._id) };
        const updateDocument = {
            $set: {
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        };

        // UPDATE DOCUMENT
        const result = await db.collection.updateOne(
            filter,
            updateDocument,
        );

        // ERROR HANDLING
        if (!result.acknowledged) {
            console.log("Failed to update ticket in database.");

            return res.status(500).json({
                data: {}
            });
        }

        return res.status(201).json({
            data: {
                // id: req.body.id,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });

    },

    changeStatus: async function changeStatus(data) {
        const db = database.getDb();
        const ObjectId = require('mongodb').ObjectId;
        const filter = { _id: new ObjectId(data) };
        const document = await db.collection.findOne(filter, { _id: 0, locked: 1 });
        console.log(document);

        let status;

        if (document) {
            status = !document.locked;
        } else {
            status = true;
        }
        
        const updateDocument = {
            $set: {
                locked: status,
            }
        };

         // UPDATE DOCUMENT
         const result = await db.collection.updateOne(
            filter,
            updateDocument,
        );
    }
};

module.exports = tickets;
