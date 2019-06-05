    var Configuration = require('../config/config'),
            DataBase = require('./DataBase'),
            str = require('./_String');
    module.exports = {
        TableName: 'users',
        JoinWith: {},
        QueryLimit: 250,
        _LastInsertId: '0',
        _LastQueryString: '',
        _rows: new Array(),
        QueryStructure: {
            'select': 'SELECT %s FROM %s',
            'insert': 'INSERT INTO %s (%s) VALUES (%s)',
            'update': 'UPDATE %s SET %s',
            'delete': 'DELETE FROM %s %s',
            'fulljoin': 'FULL JOIN %s',
            'innerjoin': 'INNER JOIN %s',
            'leftjoin': 'LEFT JOIN %s',
            'rightjoin': 'RIGHT JOIN %s',
            'orderby': 'ORDER BY %s',
            'groupby': 'GROUP BY %s',
            'limit': 'LIMIT %s'
        },
        query_list: {
            'select': '',
            'insert': '',
            'update': '',
            'delete': '',
            'join': [],
            'orderby': '',
            'groupby': '',
            'limit': '',
        },
        SetConfiguration: function (ConfigData) {
            DataBase.Connect(ConfigData.HostName, ConfigData.UserName, ConfigData.Password, ConfigData.DataBaseName, ConfigData.Port, function (error) {
                if (error) {
                    str.pr('error connecting: ' + error.stack);
                    return false;
                }
            });
            return this;
        },
        /**
         *
         * @param {String} Fileds
         * @returns {Object}
         */
        Select: function (Fileds, Where) {
            var _where = '';
            if (Where !== undefined || Where !== null) {
                _where = this._GetWhere(Where);
            }
            this._LastQueryString = str.Sprintf(this.QueryStructure.select, this._GetFileds(Fileds), this.TableName + ' ' + module.exports._Join() + ' ' + _where + str.Sprintf(this.QueryStructure.limit, this.QueryLimit));
            this.Run();
        },
        Find: function (Where) {
            module.exports.Select('*', Where);
            return module.exports._rows;
        },
        GetAll: function (_Where) {
            module.exports.Select('*', _Where);
            return module.exports._rows;
        },
        SetRows: function (rows) {
            this._rows = rows;
            return this._rows;
        },
        GetRows: function () {
            return this._rows;
        },
        Insert: function (fields) {
            if (fields == null) {
                return false;
            }
            var _insert_data = this._FieldsHandler(fields, 'insert');
            this._LastQueryString = str.Sprintf(this.QueryStructure.insert, this.TableName, _insert_data['fields'], _insert_data['values']);
            this.Run();
            return this;
        },
        Update: function (fields, where_data) {
            if (fields == null) {
                return false;
            }
            where_data = this._GetWhere(where_data);
            this._LastQueryString = str.Sprintf(this.QueryStructure.update, this.TableName, this._FieldsHandler(fields, 'update') + where_data);
            this.Run();
            return this;
        },
        Delete: function (where_data) {
            if (where_data == null) {
                return false;
            }
            where_data = this._GetWhere(where_data);
            this._LastQueryString = str.Sprintf(this.QueryStructure.delete, this.TableName, where_data);
            this.Run();
            return this;
        },
        Run: function (callback) {
            var _rows_list = new Array();
            var Query = DataBase._connection.query(this._LastQueryString);
            console.log(this._LastQueryString);
            Query.on('result', function (results) {
                _rows_list.push(results);
                if (results.insertId > 0) {
                    module.exports._LastInsertId = results.insertId;
                }
                module.exports.SetRows(results);
                if (typeof callback == 'function') {
                    callback(results);
                }
            });
            Query.on('error', function (error) {
                if (error) {
                    console.log(error);
                    console.log(module.exports._LastQueryString);
                }
            });
            Query.on('end', function () {
                module.exports.SetRows(_rows_list);
            });
        },
        _Join: function () {
            if (typeof module.exports.JoinWith != "object") {
                return '';
            }
            if (Object.keys(module.exports.JoinWith).length > 0) {
                var JoinWithKeys = new String(Object.keys(module.exports.JoinWith)).trim().toLowerCase();
                var JoinWith = module.exports.JoinWith;
                var _JoinData = new Array();
                switch (JoinWithKeys) {
                    case 'leftjoin':
                        for (TableJoinWith in JoinWith.leftjoin) {
                            TableJoinWith = new String(TableJoinWith);
                            if (TableJoinWith.trim() != null) {
                                _JoinData.push(str.Sprintf(this.QueryStructure.leftjoin, TableJoinWith + this._GetWhere(JoinWith.leftjoin[TableJoinWith], false, true)));
                            }
                        }
                        break;
                    case 'rightjoin':
                        for (TableJoinWith in JoinWith.rightjoin) {
                            TableJoinWith = new String(TableJoinWith);
                            if (TableJoinWith.trim() != null) {
                                _JoinData.push(str.Sprintf(this.QueryStructure.rightjoin, TableJoinWith + this._GetWhere(JoinWith.rightjoin[TableJoinWith], false, true)));
                            }
                        }
                        break;
                    case 'innerjoin':
                        for (TableJoinWith in JoinWith.innerjoin) {
                            TableJoinWith = new String(TableJoinWith);
                            if (TableJoinWith.trim() != null) {
                                _JoinData.push(str.Sprintf(this.QueryStructure.innerjoin, TableJoinWith + this._GetWhere(JoinWith.innerjoin[TableJoinWith], false, true)));
                            }
                        }
                        break;
                    case 'fulljoin':
                        for (TableJoinWith in JoinWith.fulljoin) {
                            TableJoinWith = new String(TableJoinWith);
                            if (TableJoinWith.trim() != null) {
                                _JoinData.push(str.Sprintf(this.QueryStructure.fulljoin, TableJoinWith + this._GetWhere(JoinWith.fulljoin[TableJoinWith], false, true)));
                            }
                        }
                        break;
                    default:
                        return '';
                        break;
                }
                return _JoinData.join(' ');
            }
            return '';
        },
        _GroupBy: function (fields) {
            if (fields == null) {
                return '';
            }
            return str.Sprintf(this.QueryStructure.groupby, fields);
        },
        _OrderBy: function (fields) {
            if (fields == null) {
                return '';
            }
            return str.Sprintf(this.QueryStructure.orderby, fields);
        },
        _Limit: function (count) {
            if (count.trim() == null) {
                return ' LIMIT 255';
            }
            return str.Sprintf(this.QueryStructure.limit, count);
        },
        _FieldsHandler: function (array_fields, handler_type) {
            handler_type = handler_type.trim().toLowerCase();
            var FieldsDate = [];
            switch (handler_type) {
                case 'update':
                    if (typeof array_fields == 'object') {
                        for (field in array_fields) {
                            if (field != "") {
                                FieldsDate.push("`" + field + "` = '" + array_fields[field] + "'");
                            }
                        }
                        FieldsDate = FieldsDate.join(' , ');
                    } else {
                        FieldsDate = array_fields;
                    }
                    break;
                case 'insert':
                    if (typeof array_fields == 'object') {
                        var _fields = [], _fields_data = [];
                        for (field in array_fields) {
                            if (field != "") {
                                _fields.push("`" + field + "`");
                                _fields_data.push("'" + array_fields[field] + "'");
                            }
                        }
                        FieldsDate['fields'] = _fields.join(' , ');
                        FieldsDate['values'] = _fields_data.join(' , ');
                    } else {
                        FieldsDate = array_fields;
                    }
                    break;
                default:
                    FieldsDate = array_fields;
                    break;
            }
            return FieldsDate;
        },
        _GetFileds: function (_fileds) {
            this.fileds = '';
            switch (typeof _fileds) {
                case 'object':
                    for (filed in _fileds) {
                        this.fileds = str.Trim(this.fileds + ', ' + _fileds[filed], '\,');
                    }
                    break;
                case 'string':
                    this.fileds = str.Trim(_fileds, '\,');
                    break;
                default:
                    this.fileds = '*';
                    break;
            }
            return this.fileds;
        },
        _GetWhere: function (_where, return_where, _DataType) {
            if (return_where != false) {
                return_where = true;
            }
            if (typeof _where == 'string' && new String(_where).trim() != null) {
                return '';
            }
            this.WhereData = [];
            switch (typeof _where) {
                case 'object':
                    for (filed in _where) {
                        if (str.Trim(_where[filed]) != "") {
                            if (_DataType === true) {
                                this.WhereData.push(str.Trim(filed) + " = " + str.Trim(_where[filed]));
                            } else {
                                this.WhereData.push(str.Trim(filed) + " = '" + str.Trim(_where[filed]) + "'");
                            }
                        }
                    }
                    break;
                case 'string':
                    this.WhereData = '';
                    if (_where != "") {
                        this.WhereData = (return_where == false ? ' ON ' : ' WHERE ') + _where;
                    }
                    break;
                default:
                    this.WhereData = '';
                    break;
            }
            if (typeof this.WhereData == "object" && this.WhereData.length > 0) {
                this.WhereData = (return_where == false ? ' ON ' : ' WHERE ') + this.WhereData.join(' AND ');
            }
            return this.WhereData;
        },
        CreateSqlString: function (_type) {

        }
    };
