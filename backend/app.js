require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const fetchTrainPositions = require('./models/trains.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const position = require('./routes/position.js');
const auth = require('./routes/auth.js');
const ticketModel = require('./models/tickets.js');
const authModel = require('./models/auth.js');
// const { OrderedBulkOperation } = require('mongodb');

const app = express();
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Skip logging and socket when testing
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs

    const corsOrigin = {
        cors: {
            origin: "https://www.student.bth.se",
            // origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT"]
        }
    };

    if (process.env.CORS_ORIGIN === 'local') {
        corsOrigin.cors.origin = "http://localhost:5173";
        corsOrigin.cors.methods = ["GET", "POST", "PUT"];
    }

    // use 'var' to avoid block scope
    var io = require("socket.io")(httpServer, corsOrigin);
}

// const port = 1337;
const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!'
    });
});

app.get("/token", (req, res) => authModel.createToken(req, res));

app.use("/delayed", delayed);
app.use("/delayed/single", delayed);
app.use("/delayed/otn", delayed);
app.use("/tickets", (req, res, next) => authModel.checkToken(req, res, next), tickets);
// app.use("/tickets", tickets);
app.use("/codes", codes);
app.use("/position", position);
app.use("/auth", auth);

const server = httpServer.listen(port, async () => {
    console.log(`Train controller app listening on port ${port}`);
});

// Skip when testing
if (process.env.NODE_ENV !== 'test') {
    fetchTrainPositions(io);


    // LOCK TICKETS WHEN THEY ARE BEING USED
    io.sockets.on('connection', async function(socket) {
        // SEND NEW TICKET DATA TO FRONTEND

        let result = await ticketModel.getTickets();

        socket.emit("tickets", result);

        socket.on("changeStatus", async function(data, callback) {
            console.log("My data is:" + data);
            try {
                await ticketModel.changeStatus(data);
                let result = await ticketModel.getTickets();

                io.emit("tickets", result);

                // IS socket.on("changeStatus") FINISHED?
                if (callback) {
                    callback({ success: true });
                }
            } catch (error) {
                // ERROR SENT IF IT GOES WRONG
                if (callback) {
                    callback({ success: false, error: error.message });
                }
            }
        });
    });
}
// Export is used to start server when testing with chai-http
module.exports = server;

