import { RecurrenceRule, scheduleJob } from "node-schedule";
import { userModel } from "../DB/models/user.model.js";

//===================================== Date based ===============================

// ================= way One
export const cronOne = () => {
  scheduleJob("*/5 * * * * *", async function () {
    const isSoftdeletedUsers = await userModel.deleteMany({ isDeleted: true });
    console.log(isSoftdeletedUsers);
  });
};

