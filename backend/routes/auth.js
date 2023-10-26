const express = require('express');
const router = express.Router();

const auth = require("../models/auth.js");

router.get('/token', (req, res) => auth.checkToken(req, res));
router.post('/login', (req, res) => auth.login(req, res));
router.post('/register', (req, res) => auth.register(req, res));
router.post('/deregister', (req, res) => auth.deregister(req, res));

module.exports = router;
