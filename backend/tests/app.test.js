// tests/app.test.js

import request from "supertest";
import app from "../src/app.js";

describe("GET /api/hello", () => {

    test("should return hello message", async () => {

        const res = await request(app).get("/api/hello");

        expect(res.statusCode).toBe(200);

        expect(res.body.message).toBe("Hello World");

    });

});