/*global describe, it, require*/
var expect = require("chai").expect,
    Bridge = require("../src/js/index");







describe("Bridge", function () {

    afterEach(function () {
        localStorage.clear();
    });

    var bridge = new Bridge({
        cache: false,
        environment: "develop"
    });

    it("should be not null", function () {
        expect(bridge.getCacheKey({test: true})).to.be.not.null;
    });

    it("find", function (done) {
        bridge.find({
            body: {
                "meContent.resourceRepresentationType": {"enumeration": ["dataset"]},
                "dsd.contextSystem": {"enumeration": ["cstat_ago"]}
            },
            params: {"full":true,"order":"meMaintenance.seUpdate.updateDate:desc"}
        }).then(function(data) {
            expect(data).to.be.not.null;
            done()
        });

    });
});