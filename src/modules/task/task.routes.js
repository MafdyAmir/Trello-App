import { Router } from "express";

const router = Router();

import * as taskController from "./task.controller.js";
import { isAuth } from "../../middleware/auth.js";
import * as validators from "./taskValidationschema.js";
import { validationCoreFunction } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
router.post(
  "/addTask",
  isAuth([("Admin", "Manager")]),
  validationCoreFunction(validators.addTaskValidationSchema),
  asyncHandler(taskController.addTask)
);

router.put(
  "/updatetask",
  isAuth([("Admin", "Manager", "User")]),
  validationCoreFunction(validators.updateTaskValidationSchema),
  asyncHandler(taskController.updateTask)
);

router.delete(
  "/deletetask",
  isAuth([("Admin", "Manager")]),
  asyncHandler(taskController.deleteTask)
);

router.get(
  "/getTasks_with_UserData",
  isAuth([("Admin", "Manager")]),
  asyncHandler(taskController.getTasks_with_UserData)
);

router.get(
  "/myCreatedTasks",
  isAuth([("Admin", "Manager")]),
 asyncHandler(taskController.myCreatedTasks)
);

router.get(
  "/myTasksAssignToMe",
  isAuth([("Admin", "User", "Manager", "HR")]),
  asyncHandler(taskController.myTasksAssignToMe)
);

router.get(
  "/getTasksAssignToAnyUser",
  isAuth([("Admin", "Manager")]),
  asyncHandler(taskController.getTasksAssignToAnyUser)
);

router.get(
  "/allLateTasks",
  isAuth([("Admin", "Manager", "User", "HR")]),
  asyncHandler(taskController.allLateTasks)
);

export default router;
