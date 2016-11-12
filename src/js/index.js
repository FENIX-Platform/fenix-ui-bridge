if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    '../config/config',
    'jquery',
    'underscore',
    'q',
    'loglevel',
    'object-hash',
    'amplify-store'
], function (C, $, _, Q, log, Hash, amplify) {

    'use strict';

    function Bridge(o) {
        var obj = o || {};
        this.cache_db = {};
        this.environment = obj.environment || 'production';
        this.ENVIR = this.environment.toUpperCase();
        this.USE_CACHE = obj.cache;
        this.SERVICE_PROVIDER = C['serviceProvider' + capitalizeFirstLetter(this.ENVIR.toLowerCase())];
        if (!this.SERVICE_PROVIDER) {
            alert(this.environment + " is not a valid FENIX environment: [develop, production]");
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    Bridge.prototype.find = function (obj) {

        var key = _.extend({
                type: "find",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {

            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.SERVICE_PROVIDER || this.SERVICE_PROVIDER,
            filterService = obj.findService || C.findService,
            body = obj.body;

        return Q($.ajax({
            url: serviceProvider + filterService + this._parseQueryParams(obj.params),
            type: obj.type || "POST",
            contentType: obj.dataType || "application/json",
            data: JSON.stringify(body),
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    // )))

    Bridge.prototype.deleteResource = function(obj) {

        var serviceProvider = obj.SERVICE_PROVIDER || this.SERVICE_PROVIDER,
            deleteService = obj.resourcesService || C.resourcesService;

        return Q($.ajax({
            url: serviceProvider + deleteService + this._parseUidAndVersion(obj, true),
            type: obj.type || "DELETE",
            // Datatype changed to text as the server returns an empty response,
            // setting it to json would trigger an error on success
            dataType: 'text'

        })).then(function (data) {
            return Q.promise(function (resolve, reject, notify) {
                return resolve(data);
            });
        }, function (error) {
            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype._protoSaveUpdate = function(service, type, obj) {
        var serviceProvider = obj.SERVICE_PROVIDER || this.SERVICE_PROVIDER,
            saveService = service,
            body = obj.body,
            type = obj.type || type;

        return Q($.ajax({
            contentType: obj.contentType || 'application/json',
            url: serviceProvider + saveService,
            type: type,
            data: JSON.stringify(body),
            dataType: obj.dataType || 'json'
        })).then(function (data) {
            return Q.promise(function (resolve, reject, notify) {
                return resolve(data);
            });
        }, function (error) {
            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });

    };

    Bridge.prototype.saveMetadata = function (obj) {
        var saveService = obj.metadataService || C.metadataService;
        return this._protoSaveUpdate(saveService, "POST", obj);
    };

    Bridge.prototype.saveDSD = function (obj) {
        var saveService = obj.dsdService || C.dsdService;
        return this._protoSaveUpdate(saveService, "POST", obj);
    };

    Bridge.prototype.saveData = function (obj) {
        var saveService = obj.resourcesService || C.resourcesService;
        return this._protoSaveUpdate(saveService, "POST", obj);
    };


    Bridge.prototype.updateDSD = function (obj) {
        var saveService = obj.dsdService || C.dsdService;
        return this._protoSaveUpdate(saveService, "PUT", obj);
    };

    Bridge.prototype.updateData = function (obj) {
        var saveService = obj.resourcesService || C.resourcesService;
        if (obj.body.data) {
            obj.body.data = {
                'rid' : obj.dsdRid
            }
        }
        return this._protoSaveUpdate(saveService, "PUT", obj);
    };

    Bridge.prototype.deleteData = function (obj) {
        var saveService = obj.resourcesService || C.resourcesService;
        obj.body.data = [];
        return this._protoSaveUpdate(saveService, "PUT", obj);
    };

    Bridge.prototype.updateMetadata = function (obj) {
        var saveService = obj.metadataService || C.metadataService;
        if (obj.dsdRid) {
            obj.body.dsd = {
                'rid' : obj.dsdRid
            }
        }
        return this._protoSaveUpdate(saveService, "PUT", obj);
    };

    // 0)))

    Bridge.prototype.getEnumeration = function (obj) {

        var key = _.extend({
                type: "enumeration",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || this.SERVICE_PROVIDER,
            enumerationService = obj.enumerationService || C.enumerationService;

        return Q($.ajax({
            url: serviceProvider + enumerationService + obj.uid,
            type: obj.type || "GET",
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype.getCodeList = function (obj) {

        var key = _.extend({
                type: "codelist",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || this.SERVICE_PROVIDER,
            codeListService = obj.codeListService || C.codelistService,
            body = obj.body;

        return Q($.ajax({
            url: serviceProvider + codeListService + this._parseQueryParams(obj.params),
            type: obj.type || "POST",
            dataType: obj.dataType || 'json',
            contentType: obj.contentType || "application/json",
            data: JSON.stringify(body)
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });

    };


    Bridge.prototype.getResource = function (obj) {

        var key = _.extend({
                type: "resource",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || this.SERVICE_PROVIDER,
            processesService = obj.processesService || C.resourcesService,
            url = serviceProvider + processesService + this._parseUidAndVersion(obj, true) + this._parseQueryParams(obj.params);

        return Q($.ajax({
            url: url,
            type: obj.type || "GET",
            contentType: obj.contentType || "application/json",
            data: JSON.stringify(obj.body)
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype.getProcessedResource = function (obj) {

        var key = _.extend({
                type: "process",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || this.SERVICE_PROVIDER,
            processesService = obj.processesService || C.processesService,
            isMultiResource = obj.hasOwnProperty("uid"),
            url = ( serviceProvider + processesService) + (isMultiResource ? this._parseUidAndVersion(obj, false) : "") + this._parseQueryParams(obj.params);

        return Q($.ajax({
            url: url,
            type: obj.type || "POST",
            dataType: obj.dataType || 'json',
            contentType: obj.contentType || "application/json",
            data: JSON.stringify(obj.body)
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });
    };

    Bridge.prototype.getMetadata = function (obj) {

        var key = _.extend({
                type: "metadata",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || this.SERVICE_PROVIDER,
            processesService = obj.metadataService || C.metadataService;

        return Q($.ajax({
            url: serviceProvider + processesService + this._parseUidAndVersion(obj, true) + this._parseQueryParams(obj.params),
            type: obj.type || "GET",
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });

    };

    Bridge.prototype.export = function (payload, obj) {

        var serviceProvider = (obj && obj.serviceProvider) || this.SERVICE_PROVIDER;
        var url = serviceProvider + (C.exportService);

        return Q($.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload)

        })).then(function (data) {
            var object = {'data': data, 'url': url};
            return Q.promise(function (resolve, reject, notify) {
                return resolve(object);
            });

        }, function (error) {
            return Q.promise(function (resolve, reject, notify) {
                return resolve(error);
            });
        });

    };

    Bridge.prototype.getMDSD = function (opts) {

        var obj = opts || {},
            key = _.extend({
                type: "mdsd",
                environment: this.ENVIR
            }, obj),
            cached = this._getCacheItem(key),
            self = this;

        if (this.USE_CACHE && cached) {
            return Q.promise(function (resolve) {
                return resolve(cached);
            });
        }

        var serviceProvider = obj.serviceProvider || this.SERVICE_PROVIDER,
            mdsdService = obj.mdsdService || C.mdsdService,
            url = serviceProvider + mdsdService + this._parseQueryParams(obj.params);

        return Q($.ajax({
            url: url,
            type: obj.type || "GET",
            dataType: obj.dataType || 'json'
        })).then(function (data) {

            self._setCacheItem(key, data ? data : null);

            return Q.promise(function (resolve, reject, notify) {
                return resolve(self._getCacheItem(key));
            });

        }, function (error) {

            return Q.promise(function (resolve, reject, notify) {
                return reject(error);
            });

        });

    };

    Bridge.prototype.all = function (promises) {

        return Q.all(promises);
    };

    Bridge.prototype.getCacheKey = function (obj) {

        return this._getCacheKey(obj);
    };

    Bridge.prototype._parseQueryParams = function (params) {

        if (!params) {
            return '';
        }

        var result = '?';

        _.each(params, function (value, key) {
            result += key + '=' + value + '&'
        });

        return result.substring(0, result.length - 1);

    };

    Bridge.prototype._parseUidAndVersion = function (params, appendUid) {

        var result = '',
            versionFound = false;

        if (!params.uid) {
            log.warn("Impossible to find uid")
        }

        result = result.concat(params.uid);

        if (!!params.version) {
            result = result.concat("/").concat(params.version);
            versionFound = true;
        }

        return (appendUid === true && versionFound !== true) ? 'uid/' + result : result;

    };

    Bridge.prototype._setCacheItem = function (obj, value) {

        var key = this.getCacheKey(obj);

        try {
            amplify.sessionStorage(key, value)
        } catch (e) {

            this.cache_db[key] = value;
        }

        return this._getCacheItem(key);
    };

    Bridge.prototype._getCacheItem = function (obj) {

        var key = this.getCacheKey(obj),
            item = amplify.sessionStorage(key);

        return item ? item : this.cache_db[key];

    };

    Bridge.prototype._getCacheKey = function (obj) {

        var key = Hash(obj);

        return key;

    };

    return Bridge;

});