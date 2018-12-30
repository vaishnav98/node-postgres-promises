var promise = require('bluebird');
var mopbkdf2 = require('mosquitto_pbkdf2');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:freelancer@localhost:5432/mqtt';
var db = pgp(connectionString);

function getAllUsers(req, res, next) {
  db.any('select * from account')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Users'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createUser(req, res, next) {
  createPasswordAsync(req.body.password, function(hash){
    db.none('insert into account(id,username,password,super)' +
      'values(DEFAULT, ${username}, ${hash}, ${super})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one User'
        });
    })
    .catch(function (err) {
      return next(err);
    });
  });  
}

function getAllDevices(req, res, next) {
  db.any('select * from acls')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Devices'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleDevice(req, res, next) {
  var user = req.params.user;
  db.one('select * from acls where username = $1', user)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Devices of One User'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
//rw =1 readonly, rw=2 readwrite
function createDevice(req, res, next) {
  db.none('insert into acls(id, username, topic,rw)' +
      'values(DEFAULT, ${username}, ${topic}, ${rw})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one Device'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateDevice(req, res, next) {
  db.none('update acls set topic=$1 where username=$2  and topic=$3',
    [req.body.topic, req.params.device.user, req.params.device.topic])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Device'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeDevice(req, res, next) {
  db.result('delete from acls where  username=$1  and topic=$2', 
    [req.params.device.user, req.params.device.topic])
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Device`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getAllUsers: getAllUsers,
  createUser: createUser,
  getAllDevices: getAllDevices,
  getSingleDevice: getSingleDevice,
  createDevice: createDevice,
  updateDevice: updateDevice,
  removeDevice: removeDevice
};
