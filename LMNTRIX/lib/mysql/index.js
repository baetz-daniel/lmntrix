'use strict';

const mysql = require('mysql');
const config = require('../../configs/.db.config.json');
const pool = mysql.createPool(config);

pool.on('error', function (err, client) {
    console.error('idle client error', err);
});

module.exports = pool;