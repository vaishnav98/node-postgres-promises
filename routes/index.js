var express = require('express');
var router = express.Router();
var db = require('../queries');

router.get('/api/users', db.getAllUsers);
router.post('/api/users', db.createUser);
router.get('/api/devices', db.getAllDevices);
router.get('/api/devices/:user', db.getSingleDevice);
router.post('/api/devices', db.createDevice); 
router.get('/', function (req, res) {

    res.render('index', {title: 'mqtt-mosquitto-auth-backend'}); 
});

module.exports = router;
