    var md5 = require('md5');
    module.exports = {
        Sprintf: function (format, etc) {
            var parameters = arguments;
            var i = 1;
            return format.replace(/%((%)|s)/g, function (b) {
                return b[2] || parameters[i++];
            });
        },
        Trim: function (str, other_signs) {
            this.regexp = '';
            str = new String(str);
            if (other_signs !== "") {
                this.regexp = new RegExp(this.Sprintf('(^\\%s+|\\%s+$)', other_signs, other_signs), 'g');
                str = str.replace(this.regexp, '');
            }
            return str.trim();
        },
        ltrim: function (str, other_signs) {
            this.regexp = '';
            str = new String(str);
            if (other_signs !== "") {
                this.regexp = new RegExp(this.Sprintf('(^\\%s+)', other_signs), 'g');
                str = str.replace(this.regexp, '');
            }
            return str.replace(/^\s+/, '');
        },
        rtrim: function (str, other_signs) {
            this.regexp = '';
            str = new String(str);
            if (other_signs !== "") {
                this.regexp = new RegExp(this.Sprintf('(\%s+$/)', other_signs), 'g');
                str = str.replace(this.regexp, '');
            }
            return str.replace(/\s+$/, '');
        },
        ClearSlashes: function (str) {
            str = String(str.toString());
            return str.replace(/\\|\\+/g, '');
        },
        AddSlashes: function (str) {
            str = String(str.toString());
            return str.replace(/\\/g, '\\\\').
                    replace(/\u0008/g, '\\b').
                    replace(/\t/g, '\\t').
                    replace(/\n/g, '\\n').
                    replace(/\f/g, '\\f').
                    replace(/\r/g, '\\r').
                    replace(/'/g, '\\\'').
                    replace(/"/g, '\\"');
        },
        empty: function (str) {
            str = String(str);
            return str.replace(/\\|\\+/g, '');
        },
        pr: function (str, type) {
            console.log(str);
        },
        md5: function (str) {
            return md5(str);
        }
    };
