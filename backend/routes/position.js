const express = require('express');
const router = express.Router();

const position = require("../models/position.js");

router.get('/', (req, res) => position.getTrainPosition(req, res));

module.exports = router;
