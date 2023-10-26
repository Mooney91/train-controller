/* global it describe beforeEach */

process.env.NODE_ENV = "test";
//process.env.DB = "sqlite"; // DB is set in test script in package.json
process.env.DB = "mongo";

const server = require("../app.js");
const database = require("../db/database.js");
const tickets = require("../models/tickets.js");
//const assert = require("assert"); // could be used alternatively instead of should
//const should = require("should"); // chai has its own implementation of should
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

// Mock objects, simulating request and response
const reqMock = {};
const resMock = {
    statusId: 200,
    data: {},
    status: function (id) {
        this.statusId = id;
        return this;
    },
    json: function (result) {
        this.data = result.data;
        return this;
    }
};

// Expected data from GET (getTickets)
const expectedGet = [
    {
        id: 2,
        code: "ANA004",
        trainnumber: "1724",
        traindate: "2023-09-20"
    },
    {
        id: 1,
        code: "ANA002",
        trainnumber: "1723",
        traindate: "2023-09-19"
    }];

// Expected data from POST (createTicket)
const expectedPost = {
    id: 3,
    code: "ANA003",
    trainnumber: "23250",
    traindate: "2023-09-21"
};

async function resetDbSqlite() {
    const db = await database.openDb();

    await db.run("DELETE FROM tickets", (err) => {
        if (err) {
            console.error("Could not empty test DB table tickets.\n", err.message);
        }
    });

    await db.run(`INSERT INTO tickets VALUES
        ('ANA002', '1723', '2023-09-19'),
        ('ANA004', '1724', '2023-09-20')`, (err) => {
        if (err) {
            console.error("Could not insert into test DB table tickets.\n", err.message);
        }
    });

    await db.close();
}

async function resetDbMongo() {
    const db = database.getDb();
    const docs = [
        {
            id: 1,
            code: "ANA002",
            trainnumber: "1723",
            traindate: "2023-09-19"
        },
        {
            id: 2,
            code: "ANA004",
            trainnumber: "1724",
            traindate: "2023-09-20"
        }];

    await db.collection.deleteMany();
    await db.collection.insertMany(docs);
    await db.client.close();
}

describe(`Test tickets with ${process.env.DB} database`, () => {
    beforeEach(async () => {
        if (process.env.DB === 'mongo') {
            await resetDbMongo();
            return;
        }

        await resetDbSqlite();
    });

    describe("getTicketsMock", () => {
        it("should return two objects", async () => {
            const resp = await tickets.getTickets(reqMock, resMock);

            resp.statusId.should.be.equal(200);
            resp.data.should.be.eql(expectedGet);
            // assert.deepStrictEqual(resp.data, expectedGet);
        });
    });

    describe("createTicketMock", () => {
        it("should return a data object", async () => {
            reqMock.body = {
                code: "ANA003",
                trainnumber: "23250",
                traindate: "2023-09-21"
            };

            const resp = await tickets.createTicket(reqMock, resMock);

            resp.statusId.should.be.equal(201);
            resp.data.should.be.eql(expectedPost);
            // assert.deepStrictEqual(resp.data, expectedPost);
        });
    });

    describe("GET /tickets", () => {
        it("should respond with status 200 and two objects", (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    const resObj = JSON.parse(res.text);

                    res.should.have.status(200);
                    resObj.data.should.be.eql(expectedGet);
                    done();
                });
        });
    });

    describe("POST /tickets", () => {
        it("should respond with status 201 and the sent object", (done) => {
            const ticket = {
                code: "ANA003",
                trainnumber: "23250",
                traindate: "2023-09-21"
            };

            chai.request(server)
                .post("/tickets")
                .send(ticket)
                .end((err, res) => {
                    const resObj = JSON.parse(res.text);

                    res.should.have.status(201);
                    resObj.data.should.be.eql(expectedPost);
                    done();
                });
        });
    });
});

