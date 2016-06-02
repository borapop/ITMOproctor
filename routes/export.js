var express = require('express');
var router = express.Router();
var db = require('../db');
var profileRouter = require('./profile');
router.get('/users', profileRouter.isAdministrator, function(req, res, next) {
    var args = {
        data: req.query
    };
    
    db.profile.search(args, function(err, data, count) {
        if (!err && data) {
            
            var file = '';
            for (var i = 0; i < data.length; i ++) {
                file += data[i].lastname + ';'
                     + data[i].firstname + ';'
                     + data[i].middlename + ';'
                     + data[i].birthday + ';'
                     + data[i].gender + ';'
                     + data[i].email + ';'
                     + data[i].role + ';'
                     + data[i].active + '\n';
            }
            var date = new Date();
            var filename = 'ITMO-Proctor-users-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.csv');
            res.setHeader('Content-type', 'text/csv; charset=UTF-8');
            console.log(file);
            res.write(file);
            res.end();
        }
    });
});

router.get('/exams', profileRouter.isAdministrator, function(req, res, next) {
    var args = {
        data: req.query
    };
    
    db.exam.search(args, function(err, data, count) {
        if (!err && data) {
            console.log(data);
            var file = '';
            for (var i = 0; i < data.length; i ++) {
                file +=data[i].subject + ';'
                     + data[i].student.lastname + ';'
                     + data[i].student.firstname + ';'
                     + data[i].student.middlename + ';'
                     + data[i].rightDate + ';'
                     + data[i].leftDate + '\n';
            }
            var date = new Date();
            var filename = 'ITMO-Proctor-users-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.csv');
            res.setHeader('Content-type', 'text/csv; charset=UTF-8');
            console.log(file);
            res.write(file);
            res.end();
        }
    });
    
    
});


router.get('/schedules', profileRouter.isAdministrator, function(req, res, next) {
    var args = {
        data: req.query
    };
    
    db.exam.search(args, function(err, data, count) {
        if (!err && data) {
            console.log(data);
            var file = '';
            for (var i = 0; i < data.length; i ++) {
                file +=data[i].subject + ';'
                     + data[i].student.lastname + ';'
                     + data[i].student.firstname + ';'
                     + data[i].student.middlename + ';'
                     + data[i].rightDate + ';'
                     + data[i].leftDate + '\n';
            }
            var date = new Date();
            var filename = 'ITMO-Proctor-users-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.csv');
            res.setHeader('Content-type', 'text/csv; charset=UTF-8');
            console.log(file);
            res.write(file);
            res.end();
        }
    });
    
    
});

module.exports = router;

/*     _id: 57501edf05f38f82106b2968,
    rightDate: Sun May 01 2016 21:00:00 GMT+0000 (UTC),
    leftDate: Mon Feb 01 2016 21:00:00 GMT+0000 (UTC),
    duration: 30,
    subject: 'Тестовый экзамен 2',
    student: 
     { _id: 57501db942e72b2911406f68,
       middlename: 'Иванович',
       firstname: 'Александр',
       lastname: 'Иванов',
       username: 'student1' },
    examId: '2' },
       
       */