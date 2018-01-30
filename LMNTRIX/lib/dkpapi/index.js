'use strict';

const pool = require('../mysql');

function GetMembersInfo(orderby, mode, callback) {
    orderby = orderby || 'name'
    mode = mode || 'ASC';

    if (mode !== 'ASC' && mode !== 'DESC') {
        mode = 'ASC';
    }

    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('SELECT `name`, `dkp`, `role`, `timestamp` FROM `member` ORDER BY ?? ' + mode + ';', [orderby], function (error, results, fields) {
            connection.release();
            callback(error, results);
            if (error) { throw error; }
        });
    });
}

function GetMemberInfo(name, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('SELECT `name`, `dkp`, `role` FROM `member` WHERE `name` = ? LIMIT 1;', [name], function (error, results, fields) {
            connection.release();
            callback(error, results[0]);
            if (error) { throw error; }
        });
    });
}

function GetDkpLogFromMember(name, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('SELECT d.`uuid`, d.`timestamp`, d.`kind`, d.`information`, d.`value`, d.`editor` FROM `dkplog` d JOIN `member` m ON (d.`member_uuid` = m.`uuid`) WHERE m.`name` = ? ORDER BY  d.`timestamp`;', [name], function (error, results, fields) {
            connection.release();
            callback(error, results);
            if (error) { throw error; }
        });
    });
}

function GetDkpLog(uuid, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('SELECT `timestamp`, `kind`, `information`, `value`, `editor` FROM `dkplog` WHERE `uuid` = ? LIMIT 1;', [uuid], function (error, results, fields) {
            connection.release();
            callback(error, results[0]);
            if (error) { throw error; }
        });
    });
}

function SetDkp(name, value, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('UPDATE `member` SET `dkp` =  `dkp` + ? WHERE `name` = ? LIMIT 1;', [value, name], function (error, results, fields) {
            connection.release();
            callback(error);
            if (error) { throw error; }
        });
    });
}


function AddDKPLog(name, kind, information, value, editor, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('INSERT INTO `dkplog` (`uuid`, `member_uuid`, `timestamp`, `kind`, `information`, `value`, `editor`) VALUES (NULL, (SELECT `uuid` FROM `member` WHERE `name` = ? LIMIT 1), CURRENT_TIMESTAMP, ?, ?, ?, ?);', [name, kind, information, value, editor], function (error, results, fields) {
            connection.release();
            if (error) { throw error; }
            switch (kind) {
                case '-dkp_item':
                case '-dkp': value = -value;
                    break;
                case '+dkp': value = value;
                    break;
            }
            SetDkp(name, value, function (error) {
                callback(error);
            });
        });
    });
}

function DeleteDKPLog(name, uuid, callback) {
    GetDkpLog(uuid, function (error, dkplog) {
        if (error) {
            callback(error);
            return;
        }
        let value = 0;
        switch (dkplog.kind) {
            case '-dkp_item':
            case '-dkp': value = dkplog.value;
                break;
            case '+dkp': value = -dkplog.value;
                break;
        }
        SetDkp(name, value, function (error) {
            if (error) {
                callback(error);
                return;
            }
            pool.getConnection(function (err, connection) {
                if (err) { throw err; }
                connection.query('DELETE d FROM `dkplog` d JOIN `member` m ON (d.`member_uuid` = m.`uuid`) WHERE m.`name` = ? AND d.`uuid` = ?;', [name, uuid], function (error, results, fields) {
                    connection.release();
                    callback(error);
                    if (error) { throw error; }
                });
            });
        });

    });
}

function AddMember(name, roles, dkp, callback) {

    let role = '';
    if (typeof (roles) === 'undefined') {
        role = "ALL";
    }
    else {
        if (roles.length === 4) {
            role = "ALL";
        }
        else {
            role = roles.join('|');
        }
    }
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('INSERT INTO `member` (`uuid`, `name`, `role`, `dkp`, `timestamp`) VALUES (NULL, ?, ?, 0, CURRENT_TIMESTAMP);', [name, role], function (error, results, fields) {
            connection.release();
            callback(error);
            if (error) { throw error; }

            let dkpValue = parseInt(dkp);
            if (dkpValue !== 0) {
                AddDKPLog(name, '+dkp', 'start dkp', dkp, 'lmntrix', function (error) {
                    if (error) { throw error; }
                });
            }
        });
    });
}

function DeleteMember(name, callback) {
    pool.getConnection(function (err, connection) {
        if (err) { throw err; }
        connection.query('DELETE FROM `member` WHERE `name` = ?;', [name], function (error, results, fields) {
            connection.release();
            callback(error);
            if (error) { throw error; }
        });
    });
}

module.exports = {
    'GetMembersInfo': GetMembersInfo,
    'GetMemberInfo': GetMemberInfo,
    'GetDkpLogFromMember': GetDkpLogFromMember,
    'AddDKPLog': AddDKPLog,
    'DeleteDKPLog': DeleteDKPLog,
    'AddMember': AddMember,
    'DeleteMember': DeleteMember,
};