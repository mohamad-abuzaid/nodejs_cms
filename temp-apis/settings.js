    /* global setting_name */

var Config = require('../config/config'),
            str = require('../lib/_String'),
            Model = require('../lib/model').SetConfiguration(Config.DataBase),
            JSON = require('JSON');

    var Settings = function () {
        this.index = function (_parms) {
            Model.TableName = 'settings';
            Model.JoinWith = '';
            Model.GetAll();
            return Model.GetRows();
        };
        this.GetSettings = function (_parms) {
            Model.TableName = 'settings';
            Model.JoinWith = '';
            Model.GetAll();
            return Model.GetRows();
        };
        this.Update = function () {
            Model.TableName = 'settings';
            Model.JoinWith = '';
            var SettingsData = new Array();
            if (typeof this.req.body === "object") {
                for (setting_name in this.req.body) {
                    if (typeof this.req.body[setting_name] === "object") {
                        SettingsData['setting_value'] = str.AddSlashes(JSON.stringify(this.req.body[setting_name]));
                        Model.Update(SettingsData, {
                            'setting_name': setting_name
                        });
                    } else {
                        SettingsData['setting_value'] = str.AddSlashes(this.req.body[setting_name]);
                        Model.Update(SettingsData, {
                            'setting_name': setting_name
                        });
                    }
                }
            }
            return {'success': true};
        };
    };

    module.exports = new Settings('');
