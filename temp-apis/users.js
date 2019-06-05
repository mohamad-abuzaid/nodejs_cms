    var Config = require('../config/config'),
            str = require('../lib/_String'),
            Model = require('../lib/model').SetConfiguration(Config.DataBase),
            bodyParser = require('body-parser'),
            path = require('path'),
            JSON = require('JSON');
    Users = function (_JoinWith) {
        this.index = function (_parms) {
            Model.TableName = 'users';
            Model.JoinWith = {
                'leftjoin': {
                    'providers': {
                        'providers.provider_user_id': 'users.user_id'
                    },
                    'clients': {
                        'clients.client_user_id': 'users.user_id'
                    }
                }
            };
            Model.GetAll();
            return Model.GetRows();
        };
        this.GetAll = function (_parms) {
            Model.TableName = 'users';
            Model.JoinWith = {
                'leftjoin': {
                    'providers': {
                        'providers.provider_user_id': 'users.user_id'
                    },
                    'clients': {
                        'clients.client_user_id': 'users.user_id'
                    }
                }
            };
            Model.GetAll();
            return Model.GetRows();
        };
        this.CreateUser = function (_parms) {

        };
        this.UpdateUser = function (_parms) {
            var UserData = this.req.body;
            if (typeof UserData === "object") {
                if (UserData.hasOwnProperty('user_id') && UserData.user_id > 0) {
                    if (UserData.hasOwnProperty('user_password')) {
                        UserData['user_password'] = str.md5(UserData['user_password']);
                    }
                    Model.TableName = 'users';
                    Model.JoinWith = {
                        'leftjoin': {
                            'providers': {
                                'providers.provider_user_id': 'users.user_id'
                            },
                            'clients': {
                                'clients.client_user_id': 'users.user_id'
                            }
                        }
                    };
                    Model.Update(UserData, {
                        'user_id': UserData.user_id
                    });
                } else {
                    return 'Please Set user_id value';
                }
            }
        };
        this.DeleteUser = function (_parms) {
            var UserData = this.req.body;
            if (typeof UserData === "object") {
                if (UserData.hasOwnProperty('user_id') && UserData.user_id > 0) {
                    Model.TableName = 'users';
                    Model.JoinWith = {
                        'leftjoin': {
                            'providers': {
                                'providers.provider_user_id': 'users.user_id'
                            },
                            'clients': {
                                'clients.client_user_id': 'users.user_id'
                            }
                        }
                    };
                    Model.Delete({
                        'user_id': UserData.user_id
                    });
                } else {
                    return 'Please Set user_id value';
                }
            }
        };
    };
    module.exports = new Users();