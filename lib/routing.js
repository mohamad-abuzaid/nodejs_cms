str = require('./_String');
module.exports = {
    Parse: function (_url, callback) {
        array_return = new Array();
        if (typeof _url === 'string') {
            var StringUrl = new String(str.Trim(_url, '/')).split('/');
            StringUrl.forEach(function (key) {
                if (key !== "undefined" && key !== "") {
                    array_return.push(str.Trim(key));
                }
            });
            array_return.FileName = array_return[0];
            if (array_return.length > 2) {
                array_return.Method = array_return[1];
                array_return.Parameters = array_return.slice(2);
            } else {
                if (typeof array_return[1] !== 'undefined') {
                    array_return.Method = array_return[1];
                } else {
                    array_return.Method = null;
                }
                array_return.Parameters = null;
            }
        }
        if (typeof callback === 'function') {
            return callback(array_return);
        }
        return array_return;
    }

};