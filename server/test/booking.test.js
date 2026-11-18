const test = require("node:test");
const assert = require("node:assert/strict");
const { estimateFare } = require("../src/controllers/bookingLifecycleController");

test("fare estimate includes weight and service charges", () => {
    const estimate = estimateFare(4000);

    assert.equal(estimate.distanceCharge, 8500);
    assert.equal(estimate.weightCharge, 1875);
    assert.equal(estimate.serviceFee, 1000);
    assert.equal(estimate.total, 11375);
});

test("fare estimate does not apply negative weight charge", () => {
    const estimate = estimateFare(500);

    assert.equal(estimate.weightCharge, 0);
    assert.equal(estimate.total, 9500);
});
