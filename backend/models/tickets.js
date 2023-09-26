const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res) {
        let allTickets = [];

        if (process.env.DB === 'mongo') {
            const db = database.getDb();
            const options = {
                sort: { id: "desc" },
                projection: { _id: 0 }
            };

            allTickets = await db.collection.find({}, options).toArray();
            // console.log(allTickets);

            await db.client.close();
        } else {
            const db = await database.openDb();

            allTickets = await db.all(`SELECT *, ROWID as id FROM tickets ORDER BY ROWID DESC`);

            await db.close();
        }

        return res.status(200).json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req, res) {
        let newId = 0;

        if (process.env.DB === 'mongo') {
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
        } else {
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
        }


        return res.status(201).json({
            data: {
                id: newId,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
