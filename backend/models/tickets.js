const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        const db = await database.getDb();

        // FIND ALL TICKETS
        // const removeAllTickets = await db.collection.deleteMany({})
        const allTickets = await db.collection.find({}).toArray();
        
        console.log(allTickets)
        
        await db.client.close();

        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req, res){
        const db = await database.getDb();

        const allTickets = await db.collection.find({}).toArray();
        const numTickets = allTickets.length

        const doc = {
            id: numTickets + 1,
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        };
        
        const result = await db.collection.insertOne(doc);

        // CHECK IF RESULT IS OK - TO FIX
        
        // if (result.result.ok) {
        //     console.log(res.status(201).json({ data: result.ops }));
        // } else {
        //     console.log("Result not ok.");
        // }

        await db.client.close();

        return res.json({
            data: {
                id: numTickets,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
