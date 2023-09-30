require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const fetchTrainPositions = require('./models/trains.js');
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');

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

    // use 'var' to avoid block scope
    var io = require("socket.io")(httpServer, {
        cors: {
            // origin: "http://localhost:5173",
            origin: "https://www.student.bth.se",
            methods: ["GET", "POST"]
        }
    });
}

// const port = 1337;
const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
    res.json({
        data: 'Hello World!'
    });
});

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

const server = httpServer.listen(port, () => {
    console.log(`Train controller app listening on port ${port}`);
});

// Skip train positions when testing
if (process.env.NODE_ENV !== 'test') {
    fetchTrainPositions(io);
}

// Export is used to start server when testing with chai-http
module.exports = server;

