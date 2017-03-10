if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    var serverDevelop = '//fenix.fao.org/',
        serverProduction = '//fenixservices.fao.org/',
        serverDemo = '//fenix.fao.org/';


    return {

        //Bridge
        serviceProviderProduction : serverProduction + "d3s/",
        serviceProviderDevelop : serverDevelop + "d3s_dev/",
        serviceProviderDemo : serverDemo + "d3s/",
        exportService :"/fenix/export",
        findService : "msd/resources/find",
        codelistService: 'msd/codes/filter',
        enumerationService: 'msd/choices/',
        processesService : "processes/",
        metadataService : "msd/resources/metadata/",
        dsdService : "msd/resources/dsd",
        resourcesService : "msd/resources/",
        mdsdService : "mdsd/",
        columnDistinctValues : "dataset/distinct/",

        cache : true
    }
});