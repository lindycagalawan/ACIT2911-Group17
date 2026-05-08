const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { getActivities, addActivity } = require("../fake-db"); // Removed .js for CommonJS

describe("Activities Data Storage", () => {
  
  describe("getActivities()", () => {
    it("returns an array of activities", () => {
      const activities = getActivities();
      assert.ok(Array.isArray(activities));
    });
  });

  describe("addActivity()", () => {
    it("assigns an ID and saves the activity", () => {
      const initialCount = getActivities().length;
      const newActivity = {
        title: "Kayaking Deep Cove",
        type: "Water",
        difficulty: 2,
        description: "Quiet morning paddle",
        creator: { uname: "MeghanC" }
      };

      addActivity(newActivity);
      const activities = getActivities();
      
      assert.equal(activities.length, initialCount + 1);
      assert.equal(activities[activities.length - 1].title, "Kayaking Deep Cove");
    });
  });
});