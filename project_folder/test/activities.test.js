const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { getActivities, addActivity } = require("../fake-db"); // Removed .js for CommonJS
const { get } = require("node:http");

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

  describe("Filter Activities", () => {
    it("Filters the activities based on their type", () => {
      const pre_add_count = getActivities().filter(act => act.type === "Swimming").length;
      const swimActivity = {
        title: "The pool",
        type: "Swimming",
        difficulty: 1,
        description: "There's a kid drowning",
        creator: { uname: "MeghanD" }
      };

      addActivity(swimActivity);
      const newerActivity = getActivities().filter(act => act.type === "Swimming");
      const an_activity = getActivities().filter(act => act.type === "Biking");

      assert.equal(newerActivity.length, pre_add_count + 1);
      assert.equal(an_activity.length, 0);


    }) 
  });
});