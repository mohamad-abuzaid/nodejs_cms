    var Config = require('../config/config'),
            str = require('../lib/_String'),
            Model = require('../lib/model').SetConfiguration(Config.DataBase),
            bodyParser = require('body-parser'),
            path = require('path'),
            JSON = require('JSON');
    Patients = function () {
        this.index = function (_parms) {
            Model.TableName = 'clients';
            Model.JoinWith = {
                'leftjoin': {
                    'users': {
                        'users.user_id': 'clients.client_user_id'
                    }
                }
            };
            Model.GetAll();
            return Model.GetRows();
        };
        this.GetAll = function () {
            Model.TableName = 'clients';
            Model.JoinWith = {
                'leftjoin': {
                    'users': {
                        'users.user_id': 'clients.client_user_id'
                    }
                }
            };

            var PatientsData = this.req.body;
            if (Object.keys(PatientsData).length <= 0) {
                PatientsData = '';
            }

            Model.GetAll(PatientsData);
            return Model.GetRows();
        };
        this.CreatePatient = function (_parms) {
            var PatientsData = this.req.body;

            var user_data = {
                'user_email': PatientsData.client_email,
                'user_password': PatientsData.client_password
            };

            Model.TableName = 'users';
            Model.Insert(user_data);

            setTimeout(function () {
                delete(PatientsData.client_password);
                PatientsData.client_user_id = Model._LastInsertId;
                Model.TableName = 'clients';
                Model.Insert(PatientsData);
                console.log(PatientsData);
            }, 100);

        };
        this.UpdatePatient = function (_parms) {
            var PatientsData = this.req.body;
            if (typeof PatientsData == "object") {
                if (PatientsData.hasOwnProperty('client_id') && PatientsData.client_id > 0) {
                    if (PatientsData.hasOwnProperty('client_password')) {
                        PatientsData['client_password'] = str.md5(PatientsData['client_password']);
                    }
                    Model.TableName = 'clients';
                    Model.JoinWith = {
                        'leftjoin': {
                            'users': {
                                'users.user_id': 'clients.client_user_id'
                            }
                        }
                    };
                    Model.Update(PatientsData, {
                        'client_id': PatientsData.client_id
                    });
                } else {
                    return 'Please Set client_id value';
                }
            }
        };
        this.DeletePatient = function (_parms) {
            var PatientsData = this.req.body;
            if (typeof PatientsData == "object") {
                if (PatientsData.hasOwnProperty('client_id') && PatientsData.client_id > 0) {
                    Model.TableName = 'clients';
                    Model.Delete({
                        'client_id': PatientsData.client_id
                    });
                } else {
                    return 'Please Set client_id value';
                }
            }
        };
    };
    module.exports = new Patients();