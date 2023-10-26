const express = require('express');
const router = express.Router();

const delayed = require("../models/delayed.js");

router.get('/', (req, res) => delayed.getDelayedTrains(req, res));
router.get('/single/', (req, res) => delayed.getDelayedSingleTrain(req, res));
router.get('/otn/', (req, res) => delayed.getDelayedSingleTrainByOTN(req, res));

module.exports = router;
