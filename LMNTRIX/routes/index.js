'use strict';
const express = require('express');
const router = express.Router();

const api = require('../lib/dkpapi');

router.all('/', function (req, res) {
    if (req.session.userinfo.isAdmin) {
        res.redirect('/admin');
        return;
    }
    res.redirect('/dkp/name/ASC');
});

router.all('/dkp', function (req, res) {
    if (req.session.userinfo.isAdmin) {
        res.redirect('/admin');
        return;
    }
    res.redirect('/dkp/name/ASC');
});

router.all('/dkp/:orderby/:mode', function (req, res) {
    if (req.session.userinfo.isAdmin) {
        res.redirect('/admin/dkp/' + req.params.orderby + '/' + req.params.mode);
        return;
    }
    api.GetMembersInfo(req.params.orderby, req.params.mode, function (error, membersinfo) {
        res.render('dkp', {
            'showLogin': true,
            'error': req.error,
            'membersinfo': membersinfo,
            'orderby': req.params.orderby,
            'mode': req.params.mode
        });
    });
});


router.all('/dkplog/:member', function (req, res) {
    if (req.session.userinfo.isAdmin) {
        res.redirect('/admin/dkplog/' + req.params.member);
        return;
    }
    api.GetMemberInfo(req.params.member, function (error, memberinfo) {
        if (error) {
            res.redirect('/dkp/name/ASC');
            return;
        }
        api.GetDkpLogFromMember(memberinfo.name, function (error, dkploginfo) {
            res.render('dkplog', {
                'showLogin': true,
                'error': req.error,
                'memberinfo': memberinfo,
                'dkploginfo': dkploginfo
            });
        });
    });
});


module.exports = router;