/*global describe, it, require*/
var expect = require("chai").expect;
var Bridge = require("../src/js/index");

describe("Bridge", function () {

    var bridge = new Bridge({
        cache : false,
        environment : "develop"
    });

    it("should be not null", function () {
        expect(bridge.getCacheKey({test: true})).to.be.not.null;
    });
});