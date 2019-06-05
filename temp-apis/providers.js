    var Config = require('../config/config'),
            str = require('../lib/_String'),
            Model = require('../lib/model').SetConfiguration(Config.DataBase),
            bodyParser = require('body-parser'),
            path = require('path'),
            JSON = require('JSON');
    Doctors = function () {
        this.index = function (_parms) {
            Model.TableName = 'providers';
            Model.JoinWith = {
                'leftjoin': {
                    'users': {
                        'users.user_id': 'providers.provider_user_id'
                    }
                }
            };
            Model.GetAll();
            return Model.GetRows();
        };
        this.GetAll = function () {
            Model.TableName = 'providers';
            Model.JoinWith = {
                'leftjoin': {
                    'users': {
                        'users.user_id': 'providers.provider_user_id'
                    }
                }
            };

            var DoctorsData = this.req.body;
            if (Object.keys(DoctorsData).length <= 0) {
                DoctorsData = '';
            }

            Model.GetAll(DoctorsData);
            return Model.GetRows();
        };
        this.CreateDoctor = function (_parms) {
            var DoctorsData = this.req.body;
            Model.TableName = 'providers';
            Model.Insert(DoctorsData);
            console.log(DoctorsData);
            setTimeout(function () {
                console.log(Model._LastInsertId);
            }, 100);

        };
        this.UpdateDoctor = function (_parms) {
            var DoctorsData = this.req.body;
            if (typeof DoctorsData === "object") {
                if (DoctorsData.hasOwnProperty('provider_id') && DoctorsData.provider_id > 0) {
                    if (DoctorsData.hasOwnProperty('provider_password')) {
                        DoctorsData['provider_password'] = str.md5(DoctorsData['provider_password']);
                    }
                    Model.TableName = 'providers';
                    Model.JoinWith = {
                        'leftjoin': {
                            'users': {
                                'users.user_id': 'providers.provider_user_id'
                            }
                        }
                    };
                    Model.Update(DoctorsData, {
                        'provider_id': DoctorsData.provider_id
                    });
                } else {
                    return 'Please Set provider_id value';
                }
            }
        };
        this.DeleteDoctor = function (_parms) {
            var DoctorsData = this.req.body;
            if (typeof DoctorsData === "object") {
                if (DoctorsData.hasOwnProperty('provider_id') && DoctorsData.provider_id > 0) {
                    Model.TableName = 'providers';
                    Model.Delete({
                        'provider_id': DoctorsData.provider_id
                    });
                } else {
                    return 'Please Set provider_id value';
                }
            }
        };
    };
    module.exports = new Doctors();