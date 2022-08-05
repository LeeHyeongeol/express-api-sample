const express = require('express');

const auth = express.Router();

const { needAuth } = require('middleware');
const { register, login, logout } = require('./auth.ctrl');

auth.post('/register', register);
auth.post('/login', login);
auth.post('/logout', needAuth, logout);

module.exports = auth;
