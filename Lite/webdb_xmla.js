(function (window){

var $nsXMLALite = function () {
};

$nsXMLALite.prototype = {
  openXMLADatabaseSync : function (url, dsn, cat, uid, pwd, version, creationCallback) {
    var db = this.openXMLA(url, dsn, cat, uid, pwd, version, true);
    if (creationCallback) {
      creationCallback.handleEvent(db);
    }
    return db;
  },

  openXMLA : function (_url, _dsn, _cat, _uid, _pwd, version, _sync) {
    var _xmla = null;
    var _conn_ver = 0;
    var _rs = null;
    var _err = false;
    var _exception = null;
    var _readonly = false;
    var _isVirtuoso = false;

    if (_dsn.length == 0)
      _dsn = "DSN=Local_Instance";
    

    var _options = {
      		async: false,
      		url: _url,
      		properties: {
      		  DataSourceInfo: _dsn,
      		  UserName: _uid,
      		  Password: _pwd,
                  Format: Xmla.PROP_FORMAT_TABULAR
      		},
      		restrictions: {}
              };

    if (typeof(_cat) == "string" && _cat.length > 0) {
      _options.properties.Catalog = _cat;
    }

    try {
      _xmla = new Xmla(_options);

      _rs = _xmla.discoverProperties();
      if (_rs == null) {
        throw "Can't connect to "+_dsn;
      }
      while (_rs.hasMoreRows()) {
        if (_rs.fieldVal("PropertyName")=="ProviderName") {
          var s = _rs.fieldVal("Value");
          if (s!==null && s.indexOf("Virtuoso") != -1)
            _isVirtuoso = true;
          break;
        } 
        _rs.next();
      }

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      _rs = _xmla.discoverDBTables({
		restrictions: {
               TABLE_NAME: "NSIODBC_VERSION"
              }});
      if (_err) throw -1;
      var tblver_exists =( _rs.numRows > 0);
      if (!tblver_exists) {
         try {
           _xmla.execute({
                statement: "drop table NSIODBC_VERSION"});
         } catch (ex) {}
         _err = false;
         _xmla.execute({
                statement: "create table NSIODBC_VERSION(VER integer)"});
         if (_err ) {
           if (_exception.code == 4) 
             _readonly = true;
           else
             throw -1; 
         } else {
           _xmla.execute({
                statement: "insert into NSIODBC_VERSION values(0)"});
           if (_err) { 
             _readonly = true; throw -1;
           } else {
             tblver_exists = true;
           }
         }
      }
      if (tblver_exists) {
        _rs = _xmla.execute({
             statement: "select VER from NSIODBC_VERSION"});
        if (_err) throw -1;
        if (_rs.hasMoreRows()) 
          _conn_ver = _rs.fieldVal(_rs.fieldName(0));
      }

      if (typeof(version) == "string" && version.length > 0) {
        var dbver = parseInt(version);
        if (dbver != _conn_ver)
          throw "Wrong version database:"+_conn_ver;
      }
      if (_sync)
        return new $nsDatabaseSync(_options, _conn_ver, tblver_exists, _readonly);
      else
        return new $nsDatabase(_options, _conn_ver, tblver_exists, _readonly);

    } catch (ex) {
      if (ex instanceof Error) 
        throw new $nsSQLException(ex);
      else
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }

    return null;
  },


  discoverDataSources : function (_url) {
    var _xmla = null;
    var _rs;
    var _err = false;
    var _exception = null;

    var _options = {
      		async: false,
      		url: _url,
      		properties: {},
      		restrictions: {}
              };

    try {
      _xmla = new Xmla(_options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      _rs = _xmla.discoverDataSources();
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex instanceof Error) 
        throw new $nsSQLException(ex);
      else
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
    return null;
  }

};


function $nsDatabaseSync(options, conn_ver, ver_exists, readonly) {
  this._options = options;
  this._ver_exists = ver_exists;
  this._readonly = readonly;
  this.version = ""+conn_ver;
}

$nsDatabaseSync.prototype = {
  _options: null,
  _ver_exists: false,
  _readonly: false,

  version: "0",

  transaction : function (callback) {
    if (!callback)
      throw "Transaction callback function is null";

    var msc = new $nsSQLTransactionSync(this, this._options);
    if (!msc)
       throw "Error out of Memory";

    try {
//??unsupported XMLA       this._conn.readOnlyMode = false;
       callback.handleEvent(msc);
    } catch (ex) {
       if (ex instanceof Error) 
         ex = $nsSQLException(null, ex.message);
       else
       if (ex instanceof Xmla.Exception)
         ex = new $nsSQLException(ex);

       throw ex;
    } finally {
       delete msc;
    }
  },


  readTransaction : function(callback) {
    if (!callback)
      throw "Transaction callback function is null";

    var msc = new $nsSQLTransactionSync(this, this._options);
    if (!msc)
       throw "Error out of Memory";

    try {
//??unsupported XMLA       this._conn.readOnlyMode = true;
       callback.handleEvent(msc);
    } catch (ex) {
       if (ex instanceof Error) 
         ex = $nsSQLException(null, ex.message);
       else
       if (ex instanceof Xmla.Exception)
         ex = new $nsSQLException(this._exception);

       throw ex;
    } finally {
       delete msc;
    }
  },


  changeVersion : function (oldVersion, newVersion, callback) {
   var oldVer = parseInt(oldVersion);
   var newVer = parseInt(newVersion);

   if (oldVer != this._conn_ver)
     throw "Database version isn't equal connection version";

   var msc = new $nsSQLTransactionSync(this, this._options);
   var _err = false;
   var _exception = null;
   if (!msc)
     throw "Error out of Memory";

   try {
      if (callback)
        callback.handleEvent(msc);

      var _xmla = new Xmla(this._options);
      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
            _exception = eventData.exception;
            _err = true;
          },
          scope: this
      });

      var _query = "update NSIODBC_VERSION set VER="+newVersion;
      _xmla.execute({statement: _query});
      if (_err) throw -1;

      this._conn_ver = newVer;

   } catch (ex) {
     if (ex instanceof Error) 
       ex = $nsSQLException(null, ex.message);
     else
     if (ex == -1)
       throw new $nsSQLException(_exception); 
     else if (ex instanceof Xmla.Exception)
       throw new $nsSQLException(ex); 
     else
       throw ex;
   } finally {
      delete msc;
   }
  }

};



function $nsSQLException(ex) {
  if (typeof(ex.code)!="undefined" && ex.code) 
    this.code = ex.code;
  else
    this.code = -1;
  this.message = ex.message;
  this.state = "HY000"; //??TODO handle.errorState;
}

$nsSQLException.prototype = {
  code: 0,
  message: null,
  state: null,

  toString : function() {
    return this.message;
  }
};



function $substParams(query, args, arg_len) {
  var ch;
  var id=0;
  var i=0;
  var qlen = query.length;
  var buf=[];
  while(i < qlen) {
    ch = query.charAt(i++);
    if (ch == '?') {
      if (id < arg_len) {
        var par = args[id++];
        if (typeof(par) == "string") {
          buf.push("'");
          buf.push(par.replace(new RegExp("'",'g'),"\\'").replace(new RegExp("\"",'g'),"\\\""));
          buf.push("'")
        } else if (par === null){
          buf.push("null");
        } else {
          buf.push(par);
        }
      } else {
        buf.push(ch);
      }
    } else if (ch == '"' || ch == '\'') {
      buf.push(ch);
      while(i < qlen) {
        var c = query.charAt(i++);
        buf.push(c);
        if (c == ch)
          break;
      }
    } else {
      buf.push(ch);
    }
  }
  return buf.join("");
}



function $nsSQLTransactionSync(db, options) {
  this._db = db;
  this._options = options;
}

$nsSQLTransactionSync.prototype = {

  _db: null,
  _options: null,

  executeSql : function (sqlStatement, arguments) {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      var arg_len  = (arguments != null && typeof(arguments)!="undefined" ? arguments.length: 0);
      var query;
      if (arg_len > 0)
        query = $substParams(sqlStatement, arguments, arg_len);
      else
        query = sqlStatement;

      var _rs = _xmla.execute({statement: query});
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getCatalogs : function () {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      var _rs = _xmla.discoverDBCatalogs();
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getTables : function (catalog, schema, table, tableType) {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      catalog = (catalog===null?"":catalog);
      schema = (schema===null?"":schema);
      table = (table===null?"":table);
      tableType = (tableType===null?"":tableType);
      var _rs = _xmla.discoverDBTables({
      			restrictions: {
      		 	 	TABLE_CATALOG: catalog,
      		  		TABLE_SCHEMA: schema,
      		  		TABLE_NAME: table,
                  		TABLE_TYPE: tableType
      			}});
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getColumns : function (catalog, schema, table, column) {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      catalog = (catalog===null?"":catalog);
      schema = (schema===null?"":schema);
      table = (table===null?"":table);
      column = (column===null?"":column);
      var _rs = _xmla.discoverDBColumns({
      			restrictions: {
      		 	 	TABLE_CATALOG: catalog,
      		  		TABLE_SCHEMA: schema,
      		  		TABLE_NAME: table,
                  		COLUMN_NAME: column
      			}});
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },
  
  getPrimaryKeys : function (catalog, schema, table) {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      catalog = (catalog===null?"":catalog);
      schema = (schema===null?"":schema);
      table = (table===null?"":table);
      var _rs = _xmla.discoverDBPrimaryKeys({
      			restrictions: {
      		 	 	TABLE_CATALOG: catalog,
      		  		TABLE_SCHEMA: schema,
      		  		TABLE_NAME: table
      			}});
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getForeignKeys : function (pcatalog, pschema, ptable, 
  			fcatalog, fschema, ftable) {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      pcatalog = (pcatalog===null?"":pcatalog);
      pschema = (pschema===null?"":pschema);
      ptable = (ptable===null?"":ptable);
      fcatalog = (fcatalog===null?"":fcatalog);
      fschema = (fschema===null?"":fschema);
      ftable = (ftable===null?"":ftable);
      var _rs = _xmla.discoverDBForeignKeys({
      			restrictions: {
      		 	 	PK_TABLE_CATALOG: pcatalog,
      		  		PK_TABLE_SCHEMA: pschema,
      		  		PK_TABLE_NAME: ptable,
      		 	 	FK_TABLE_CATALOG: fcatalog,
      		  		FK_TABLE_SCHEMA: fschema,
      		  		FK_TABLE_NAME: ftable
      			}});
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getTypeInfo : function (dataType) {
    var _err = false;
    var _exception = null;
    try {
      var _xmla = new Xmla(this._options);

      _xmla.addListener({
          events: Xmla.EVENT_ERROR,
          handler: function(eventName, eventData, xmla){
             _exception = eventData.exception;
             _err = true;
          },
          scope: this
      });

      dataType = (dataType===null?0:dataType);
      var _rs = _xmla.discoverDBProviderTypes({
      			restrictions: {
      		 	 	DATA_TYPE: dataType
      			}});
      if (_err) throw -1;

      return new $nsSQLResultSet(_rs);

    } catch (ex) {
      if (ex == -1)
        throw new $nsSQLException(_exception); 
      else if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getProcedures : function (catalog, schema, procedure) {
    return new $nsSQLResultSetEmpty();
  },

  getProcedureColumns : function (catalog, schema, procedure, column) {
    return new $nsSQLResultSetEmpty();
  }

};



function $nsSQLResultSet(rs) {
  this.rows = new $nsSQLResultSetRowList(rs);
  this.metaData = new $nsSQLResultSetMetaData(rs);
}

$nsSQLResultSet.prototype = {
  insertId: 0,
  rowsAffected: -1,
  rows: null,
  metaData: null

};


function $nsSQLResultSetEmpty() {
  this.rows = new $nsSQLResultSetRowListEmpty();
  this.metaData = new $nsSQLResultSetMetaDataEmpty();
}

$nsSQLResultSetEmpty.prototype = {
  insertId: 0,
  rowsAffected: -1,
  rows: null,
  metaData: null

};


function $nsSQLResultSetRowList(rs) {
  this.length = rs.rowCount();
  this._data=[];

  if (this.length > 0) {
    try {
      var count = rs.fieldCount();
      var flds = rs.getFields();
      var id = 0;

      while(rs.hasMoreRows()) {
        var row = new $nsValue();

        for(var i=0; i < count; i++)
          row[flds[i].name] = rs.fieldVal(flds[i].name);

        this._data[id] = row;
        rs.next();
        id++;
      }
      this.length = id;
    } catch (ex) {
      if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  }
}

$nsSQLResultSetRowList.prototype = {

  length : 0,
  _data: null,

  item : function(index) {
    if (index > this.length)
      return null;
    return this._data[index];
  }

};


function $nsSQLResultSetRowListEmpty() {
}

$nsSQLResultSetRowListEmpty.prototype = {

  length: 0,
  item : null
};


function $nsValue() {
}



function $nsSQLResultSetMetaData(rs) {
  this.columnCount = rs.fieldCount();
  this._rs = rs;
}


$nsSQLResultSetMetaData.prototype = {

  _rs: null,
  columnCount: 0,

  getColumnType : function (index) {
    try {
      var name = this._rs.fieldName(index);
      return this._rs.fieldDef(name).type;
    } catch (ex) {
      if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  getColumnName : function (index) {
    try {
      return this._rs.fieldName(index);
    } catch (ex) {
      if (ex instanceof Xmla.Exception)
        throw new $nsSQLException(ex); 
      else
        throw ex;
    }
  },

  isNullable : function(index) {
    return true;
  }

};


function $nsSQLResultSetMetaDataEmpty() {
}

$nsSQLResultSetMetaDataEmpty.prototype = {

  columnCount : 0,
  getColumnType : function (index) { return null; },
  getColumnName : function (index) { return null; },
  isNullable : function(index) { return true; }
};

window.XMLALite = new $nsXMLALite();

})(window);


