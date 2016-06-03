var express = require('express');
var router = express.Router();
var db = require('../db');
var profileRouter = require('./profile');
var User = require('../db/models/user');
var Exam = require('../db/models/exam');
var Schedule = require('../db/models/schedule');

router.get('/users', profileRouter.isAdministrator, function(req, res, next) {
    var args = {
        data: req.query
    };
    
    db.profile.search(args, function(err, data, count) {
        if (!err && data) {
            console.log(data);
            var file = '';
            for (var i = 0; i < data.length; i ++) {
                file += data[i].username + ';'
                + data[i].lastname + ';'
                + data[i].firstname + ';'
                + data[i].middlename + ';'
                + data[i].gender + ';'
                + data[i].birthday + ';'
                + data[i].email + ';'
                + data[i].role + ';'
                + data[i].provider + '\n';
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

router.post('/users/', profileRouter.isAdministrator, function(req, res, next) {
    
    var args = {
        data: req.query
    };
    var body  = req.body;
    body = body.substring(1, body.length - 1);
    console.log(body);
    
    parseCSV(body, (parsed) => {
        console.log(parsed);
        for (var i in parsed) {
            console.log({
                firstname: parsed[i][2],
                password: parsed[i][0],
                lastname: parsed[i][1],
                middlename: parsed[i][3],
                gender: parsed[i][4],
                birthday: parsed[i][5],
                email: parsed[i][6],
                role: parsed[i][7],
                username: parsed[i][0],
                provider: parsed[i][8]
            });
            var user = new User({
                firstname: parsed[i][2],
                password: parsed[i][0],
                lastname: parsed[i][1],
                middlename: parsed[i][3],
                gender: parsed[i][4],
                birthday: parsed[i][5],
                email: parsed[i][6],
                role: parsed[i][7],
                username: parsed[i][0],
                provider: parsed[i][8]
            });
            user.save((err) => {
                if (err) {
                    console.log(err);
                    //res.send(500);
                } else {
                    //res.send(200);
                }
                
                
            });
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
                     + JSON.stringify(data[i].student) + ';'
                     + data[i].rightDate + ';'
                     + data[i].leftDate + ';'
                     + data[i].duration + '\n';
            }
            var date = new Date();
            var filename = 'ITMO-Proctor-exams-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.csv');
            res.setHeader('Content-type', 'text/csv; charset=UTF-8');
            console.log(file);
            res.write(file);
            res.end();
        }
    });
    
    
});

router.post('/exams/', profileRouter.isAdministrator, function(req, res, next) {
    var body  = req.body;
    body = body.substring(1, body.length - 1);
    //console.log(body);
    
    parseCSV(body, (parsed) => {
        
        var N = parsed.length;
        for (var i in parsed) {
            
            var exam = new Exam({
                
                subject : parsed[i][0],
                student : JSON.parse(parsed[i][1].replace(/\\/g, '')),
                rightDate : Date.parse(parsed[i][2]),
                leftDate  : Date.parse(parsed[i][3]),
                duration  : parsed[i][4]
            });
            
            exam.save((err) => {
                if (err) {
                    console.log(err);
                    
                } else if(i == N){
                    res.send(200);
                }
                
            });
        }
    });
});

router.get('/schedules', profileRouter.isAdministrator, function(req, res, next) {
    var args = {
        data: req.query
    };
    
    db.schedule.search(args, function(err, data, count) {
        if (!err && data) {
            console.log(data);
            var file = '';
            for (var i = 0; i < data.length; i ++) {
                file +=JSON.stringify(data[i].inspector) + ';'
                     + data[i].beginDate + ';'
                     + data[i].endDate + '\n';
            }
            var date = new Date();
            var filename = 'ITMO-Proctor-schedules-' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '-' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            res.setHeader('Content-disposition', 'attachment; filename=' + filename + '.csv');
            res.setHeader('Content-type', 'text/csv; charset=UTF-8');
            console.log(file);
            res.write(file);
            res.end();
        }
    });
    
    
});

router.post('/schedules/', profileRouter.isAdministrator, function(req, res, next) {
    var body  = req.body;
    body = body.substring(1, body.length - 1);
    //console.log(body);
    
    parseCSV(body, (parsed) => {
        
        var N = parsed.length;
        for (var i in parsed) {
            
            var schedule = new Schedule({
                
                inspector : JSON.parse(parsed[i][0].replace(/\\/g, '')),
                beginDate : Date.parse(parsed[i][1]),
                endDate  : Date.parse(parsed[i][2])
            });
            
            schedule.save((err) => {
                if (err) {
                    console.log(err);
                    
                } else if(i == N){
                    res.send(200);
                }
                
            });
        }
    });
});

function parseCSV(file, cb) {
    var strings = file.split(/\n?\\n/);
    for (var i in strings) {
        strings[i] = strings[i].split(';');
    }
    cb(strings);
}

module.exports = router;

