define([
    'loglevel',
    'jquery',
    'underscore',
    '../../../src/js/index',
], function (log, $, _, Bridge) {

    'use strict';

    var s = {
            GO: "[data-role='go']"
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

        var self= this;

        $(s.GO).on("click", function () {
            self.bridge.find({
                body: {
                    "meContent.resourceRepresentationType": {"enumeration": ["dataset"]},
                    "dsd.contextSystem": {"enumeration": ["cstat_ago"]}
                },
                params: {"full":true,"order":"meMaintenance.seUpdate.updateDate:desc"}
            }).then(function(data) {
               console.log(data)
            });
        })

    };


    // utils

    Dev.prototype._importThirdPartyCss = function () {

        //Bootstrap
        require('bootstrap/dist/css/bootstrap.css');

    };

    return new Dev();

});