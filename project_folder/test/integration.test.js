const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const supertest = require("supertest");
const app = require("../app"); // Path to your app.js

describe("Activities Integration Tests", () => {
  
  describe("GET /activities", () => {
    it("returns status 200", async () => {
      const res = await supertest(app).get("/activities");
      assert.equal(res.status, 200);
    });

    it("renders existing activities onto the page", async () => {
      const res = await supertest(app).get("/activities");
      assert.ok(res.text.includes("Hiking Stawamus Chief"));
    });
  });

  describe("POST /activities/create", () => {
    it("redirects to /activities after a successful post", async () => {
      const res = await supertest(app)
        .post("/activities/create")
        .type("form")
        .send({
          title: "Unit Test Adventure",
          type: "Hiking",
          difficulty: "3",
          description: "This is a test description",
          rating: "5"
        });

      assert.equal(res.status, 302);
      assert.equal(res.headers.location, "/activities");
    });
  });
});