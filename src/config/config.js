if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    var serverDevelop = '//fenix.fao.org/',
        serverProduction = '//fenixservices.fao.org/',
        serverDemo = '//fenix.fao.org/',
        serverGIFT = '//fenixapps2.fao.org/gift-test/v1/',
        serverWiewsQA = '//www.fao.org/fenix/wiews/api/',
        serverWiewsProduction = '//www-test.fao.org/fenix/wiews/api/';


    return {

        //Bridge
        serviceProviderProduction : serverProduction + "d3s/",
        serviceProviderDevelop : serverDevelop + "d3s_dev/",
        serviceProviderDemo : serverDemo + "d3s/",
        serviceProviderGift : serverGIFT,
        serviceProviderWiews : serverDemo + "d3s_wiews/",
        serviceProviderWiews_qa : serverWiewsQA + "d3s/",
        serviceProviderWiews_production : serverWiewsProduction + "d3s/",

        exportService :"/fenix/export",
        exportFlow :"/export/flow",
        exportStreaming :"/export/",
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