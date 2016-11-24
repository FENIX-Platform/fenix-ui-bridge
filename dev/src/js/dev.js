define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index'
], function (log, $, _, Bridge) {

    'use strict';

    var s = {
            GO: "[data-role='go']",
            SET: "[data-role='set']",
            DEL: "[data-role='del']",

            META: "[data-role='upd-meta']",
            DSD: "[data-role='upd-dsd']",
            DATA: "[data-role='upd-data']",
            DELMETA: "[data-role='del-meta']",
            DELDATA: "[data-role='del-data']",
            DISTINCT: "[data-role='distinct']"
        },

        environment = 'production';

    function Dev() {

        this._importThirdPartyCss();

        console.clear();

        this.bridge = new Bridge({
            cache: false,
            environment: environment
        });

        //trace, debug, info, warn, error, silent
        log.setLevel('silent');

        this.start();
    }

    Dev.prototype.start = function () {

        log.trace("Dev started");

        this._render();

        //this._createConfiguration();

    };

    Dev.prototype._render = function () {

        var self = this;

        $(s.GO).on("click", function () {
            self.bridge.find({
                body: {
                    "meContent.resourceRepresentationType": {"enumeration": ["dataset"]},
                    "dsd.contextSystem": {"enumeration": ["cstat_ago"]}
                },
                params: {"full": true, "order": "meMaintenance.seUpdate.updateDate:desc"}
            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.SET).on("click", function () {
            self.bridge.saveMetadata({
                body: {
                    "title": {
                        "EN": "Testing Bridge.saveMetadata"
                    },
                    "dsd": {
                        "contextSystem": "fenix_develop",
                        "datasources": ["D3S"]
                    },
                    "meContent": {
                        "resourceRepresentationType": "dataset",
                        "resourceRepresentationTypeLabel": {
                            "EN": "Dataset"
                        }
                    },
                    "metadataStandardName": "FENIX",
                    "metadataStandardVersion": "1.0"
                }
            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.DSD).on("click", function () {
            alert('updating DSD D3S_68675446089355920227307586329321703254 if exist')
            self.bridge.updateDSD({
                body: {
                    "rid": "63_1768",
                    "contextSystem": "fenix_develop",
                    "datasources": ["D3S"],
                    "columns": [{
                        "dataType": "year",
                        "title": {"EN": "YEAR"},
                        "values": {"timeList": [2010, 2011, 2012, 2013, 2013, 2014, 2014, 2015]},
                        "subject": "time",
                        "key": true,
                        "id": "DIMENSION0"
                    }, {
                        "dataType": "number",
                        "title": {"EN": "VALUE"},
                        "subject": "value",
                        "key": false,
                        "id": "VALUE0"
                    }, {"dataType": "text", "title": {"EN": "FLAG"}, "subject": "flag", "key": false, "id": "OTHER0"}]
                }
            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.DATA).on("click", function () {
            alert('updating DATA D3S_68675446089355920227307586329321703254 if exist')
            self.bridge.updateData({
                body: {
                    "metadata": {
                        "uid": "D3S_68675446089355920227307586329321703254",
                    },
                    "data": [['2010', 5, ''], ['2012', 25, '']]
                }

            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.DELDATA).on("click", function () {
            alert('updating deleteData D3S_68675446089355920227307586329321703254 if exist')
            self.bridge.deleteData({
                body: {
                    "metadata": {
                        "uid": "D3S_68675446089355920227307586329321703254",
                    }
                }

            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.META).on("click", function () {
            alert('updating META D3S_68675446089355920227307586329321703254 if exist')
            self.bridge.updateMetadata({
                dsdRid: '63_1768',
                body: {
                    "title": {
                        "EN": "Testing Bridge.updateMetadata"
                    },
                    "dsd": {
                        "contextSystem": "fenix_daniele",
                        "rid": "1"
                    },
                    "uid": "D3S_68675446089355920227307586329321703254",
                    "meContent": {
                        "resourceRepresentationType": "dataset",
                        "resourceRepresentationTypeLabel": {
                            "EN": "Dataset"
                        }
                    },
                    "metadataStandardName": "FENIX",
                    "metadataStandardVersion": "1.0"
                }
            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.DEL).on("click", function () {
            alert('deleting D3S_68675446089355920227307586329321703254 if exist')
            self.bridge.deleteResource({
                uid: 'D3S_68675446089355920227307586329321703254'
            }).then(function (data) {
                console.log(data)
            });
        });

        $(s.DISTINCT).on("click", function () {
            self.bridge.getColumnDistinctValues({
                uid: 'Uneca_PopulationNew',
                //version: "1.0",
                columnId: "DomainCode"
            }).then(function (data) {
                console.log(data)
            });
        });

    };

    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

    };

    return new Dev();

});