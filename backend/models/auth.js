const database = require('../db/database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = {
    checkToken:  function(req, res, next) {
        let token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.username = decoded.username;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    },
    register: async function register(req, res) {
        console.log("Registering new user...");
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            const db = await database.getAuth();

            try {
                const doc = {
                    username: username,
                    password: hash,
                };

                await db.collection.insertOne(doc);

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: "The database encountered an error"
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },
    login: async function login(req, res) {
        console.log("Login user");

        const db = database.getAuth();
        const username = req.body.username;
        const password = req.body.password;

        if (!username|| !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Username or password missing",
                    detail: "Username or password missing in request"
                }
            });
        }

        try {
            // DATABASE
            const user = await db.collection.findOne({ username: username });

            if (user) {
                return auth.comparePasswords(
                    req,
                    res,
                    password,
                    user,
                );
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.client.close();
        }
    },
    comparePasswords: function(req, res, password, user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                auth.createToken(req, res, user.username);
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "Wrong password",
                        detail: "Password is incorrect."
                    }
                });
            }
        });
    },
    createToken: function (req, res, username) {
        let payload = { username: username };
        let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

        console.log(jwtToken);
        return res.json({
            data: {
                type: "success",
                message: "User logged in",
                user: payload,
                username: username,
                token: jwtToken
            }
        });
    },
    deregister: async function(req, res) {
        const username = req.body.username;

        try {
            const db = await database.getAuth();

            const filter = { username: username };

            const keyObject = await db.collection.findOne(filter);

            if (keyObject) {
                return await auth.deleteData(res, username, db);
            } else {
                let data = {
                    message: "The username does not exist.",
                    username: username,
                };

                await db.client.close();

                return data;
            }
        } catch (e) {
            let data = {
                message: "Database error: " + e.message,
                username: username
            };

            return data;
        }
    },
    deleteData: async function(res, username, db) {
        try {
            const filter = { username: username };

            await db.collection.deleteOne(filter);

            let data = {
                message: "All data has been deleted",
                username: "",
            };

            return data;
        } catch (e) {
            let data = {
                message: "Could not delete data due to: " + e.message,
                username: username
            };

            return data;
        } finally {
            await db.client.close();
        }
    },
};

module.exports = auth;
