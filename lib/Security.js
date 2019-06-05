    var str = require('./lib/_String');
    module.exports = {
        ClearSigns: function (text) {
            text = new String(text);
            text = text.replace(/([\'\`\„\‘\“\”\~\!\@\#\$\%\‰\^\&\*\(\)\+]+)/gi, '');
            return text;
        },
        ClearSqlWords: function (text) {
            text = new String(text);
            text = text.replace(/(where|between|insert|union|cnull|char|concat|drop|create)/gi, '');
            return text;
        },
        ClearSlashes: function (text) {
            return str.ClearSlashes(text);
        },
    };
