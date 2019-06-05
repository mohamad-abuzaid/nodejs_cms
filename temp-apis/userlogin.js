var Config = require('../config/config'),
        str = require('../lib/_String'),
        Model = require('../lib/model').SetConfiguration(Config.DataBase),
        bodyParser = require('body-parser'),
        path = require('path'),
        JSON = require('JSON');

userlogin = function () {

    this.login = function (_parms) {
        var LoginData = this.req.body;

        if (Object.keys(LoginData).length > 0) {
            if (LoginData.email !== "" && LoginData.password !== "") {

                Model.TableName = 'clients';
                Model.JoinWith = {
                    'leftjoin': {
                        'users': {
                            'users.user_id': 'clients.client_user_id'
                        },
                        'providers': {
                            'providers.provider_user_id': 'clients.client_user_id'
                        }
                    }
                };
                Model.Find();
                this.req.session.email = LoginData.email;
                this.req.session.password = LoginData.password;
                this.req.session.save();
            }
        }
        str.pr(this.req.body);
        str.pr(this.req.session);
        return true;
        Model.TableName = 'clients';
        Model.JoinWith = {
            'leftjoin': {
                'users': {
                    'users.user_id': 'clients.client_user_id'
                },
                'providers': {
                    'providers.provider_user_id': 'clients.client_user_id'
                }
            }
        };
        Model.GetAll();
        return Model.GetRows();
    };

    this.checklogin = function () {
        if (req.session.user) {
            next();     //If session exists, proceed to page
        } else {
            var err = new Error("Not logged in!");
            console.log(req.session.user);
            next(err);  //Error, trying to access unauthorized page!
        }
        return this.req.session;
    };

    this.CreateLogin = function (_parms) {
        var LoginData = this.req.body;
        console.log(LoginData);
    };

    this.UpdateProvider = function (_parms) {
        var LoginData = this.req.body;
        if (typeof LoginData === "object") {
            if (LoginData.hasOwnProperty('provider_id') && LoginData.provider_id > 0) {
                if (LoginData.hasOwnProperty('provider_password')) {
                    LoginData['provider_password'] = str.md5(LoginData['provider_password']);
                }
                Model.TableName = 'providers';
                Model.JoinWith = {
                    'leftjoin': {
                        'users': {
                            'users.user_id': 'providers.provider_user_id'
                        }
                    }
                };
                Model.Update(LoginData, {
                    'provider_id': LoginData.provider_id
                });
            } else {
                return 'Please Set provider_id value';
            }
        }
    };

};
module.exports = new userlogin();