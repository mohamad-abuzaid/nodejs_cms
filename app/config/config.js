
'use strict';

var config = module.exports;
config.db = {
    user: 'root',
    password: '',
    name: 'xadoadmin'
};
config.db.details = {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
};
config.keys = {
    secret: 'QEZDeHKPkSm-=_;_bWc-XU6M10B|d8)!bs`ag(&3XgZ}0T5Uc#yj}5nQ_<-RX6F'
};
config.token = {
    expiresIn: '7d'
};
var userRoles = config.userRoles = {
    guest: 1,     // ...0001
    user: 2,      // ...0010
    moderator: 4, // ...0100
    admin: 8      // ...1000
};
config.accessLevels = {
    guest: userRoles.guest | userRoles.user | userRoles.moderator | userRoles.admin, // ...1111
    user: userRoles.user | userRoles.moderator | userRoles.admin, // ...1110
    moderator: userRoles.moderator | userRoles.admin, // ...1100
    admin: userRoles.admin    // ...1000
};
config.paypalconf = {
    mode: 'sandbox', // Sandbox or live
    client_id: 'AaG14sK9NYJAw_TmmGtTC5kAOdzf2cypLDh82QkqXQh0ZYrjxYOl46OkKIX9zGlizq1kBTZUq_Z772Hb',
    client_secret: 'EMONhN8Xf2XMiPEmQ1_BmGy1yFH9ABtFauWL5O9txDT4YMpwdAj_3tTcgl_JH8XoCmPdzVk0GYl-BEaV'
};