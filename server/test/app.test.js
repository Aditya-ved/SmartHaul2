const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");

test("health endpoint responds", async () => {
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    try {
        const address = server.address();
        const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
        const body = await response.json();
        assert.equal(response.status, 200);
        assert.equal(body.success, true);
        assert.equal(body.message, "SmartHaul API is running");
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});

test("protected route rejects missing authentication", async () => {
    const server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    try {
        const address = server.address();
        const response = await fetch(`http://127.0.0.1:${address.port}/api/shipments`);
        const body = await response.json();
        assert.equal(response.status, 401);
        assert.equal(body.success, false);
    } finally {
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});
