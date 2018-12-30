var express = require('express');
var router = express.Router();
var db = require('../queries');



router.get('/api/users', db.getAllUsers);
router.post('/api/users', db.createUser);
router.get('/api/devices', db.getAllDevices);
router.get('/api/devices/:user', db.getSingleDevice);
router.post('/api/devices', db.createDevice); //device is an object
router.put('/api/devices/:device', db.updateDevice);
router.delete('/api/devices/:device', db.removeDevice);

// application -------------------------------------------------------------
router.get('/', function (req, res) {

    res.render('index', {title: 'mqtt-mosquitto-auth-backend'}); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;
