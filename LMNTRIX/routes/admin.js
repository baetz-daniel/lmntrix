'use strict';

const express = require('express');
const router = express.Router();

const api = require('../lib/dkpapi');


router.all('/', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    res.redirect('/admin/dkp/name/ASC');
});


router.all('/dkp', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    res.redirect('/admin/dkp/name/ASC');
});

router.all('/dkp/:orderby/:mode', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.GetMembersInfo(req.params.orderby, req.params.mode, function (error, result) {
        res.render('admindkp', {
            'showLogin': false,
            'error': req.error,
            'userinfo': req.session.userinfo,
            'membersinfo': result,
            'orderby': req.params.orderby,
            'mode': req.params.mode
        });
    });
});

router.all('/dkplog/:member', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.GetMemberInfo(req.params.member, function (error, memberinfo) {
        api.GetDkpLogFromMember(memberinfo.name, function (error, dkploginfo) {
            res.render('admindkplog', {
                'showLogin': false,
                'error': req.error,
                'userinfo': req.session.userinfo,
                'memberinfo': memberinfo,
                'dkploginfo': dkploginfo
            });
        });
    });
});

router.post('/dkplog/:member/add', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.AddDKPLog(req.params.member, req.body.kind, req.body.information, req.body.value, req.body.editor, function (error) {
        res.redirect('/admin/dkplog/' + req.params.member);
    });
});

router.all('/dkplog/:member/delete/:log_uuid', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.DeleteDKPLog(req.params.member, req.params.log_uuid, function (error) {
        res.redirect('/admin/dkplog/' + req.params.member);
    });
});

router.all('/member', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    res.redirect('/admin/member/name/ASC');
});

router.all('/member/:orderby/:mode', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.GetMembersInfo(req.params.orderby, req.params.mode, function (error, membersinfo) {
        res.render('adminmembercontrol', {
            'showLogin': false,
            'error': req.error,
            'userinfo': req.session.userinfo,
            'membersinfo': membersinfo,
            'orderby': req.params.orderby,
            'mode': req.params.mode
        });
    });
});

router.all('/member/:orderby/:mode/delete/:member', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.DeleteMember(req.params.member, function (error) {
        res.redirect('/admin/member/' + req.params.orderby + '/' + req.params.mode);
    });
});

router.all('/member/:orderby/:mode/add', function (req, res, next) {
    if (!req.session.userinfo.isAdmin) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    api.AddMember(req.body.name, req.body.role, req.body.dkp, function (error) {
        res.redirect('/admin/member/' + req.params.orderby + '/' + req.params.mode);
    });
});

module.exports = router;