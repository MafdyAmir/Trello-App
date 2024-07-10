import userModel from "../../DB/models/user.model.js";
import taskModel from "../../DB/models/task.model.js";
import { globalResponseError } from "../../utils/errorHandling.js";

//**** addTask *****
export const addTask = async (req, res, next) => {
  const { _id } = req.authUser;
   if (_id.toString() != req.authUser.id) {
     return next(
       new globalResponseError(
         "You are not authorized to add this task",
         401
       )
     );
   }
  req.body.userId = req.authUser.id;
  const assignTo = await userModel.findById(req.body.assignTo);
  if (!assignTo) {
    return next(
      new globalResponseError(
        "This user You want to assign this task not exist!",
        400
      )
    );
  }
  // 30-7-2023
  let date = new Date(req.body.deadLine); //29-7-2023
  let current = new Date(); //30-7-2023
  if (current > date) {
    return next(new globalResponseError("Enter valid date!", 400));
  }
  req.body.deadLine = date;

  const task = await taskModel.create(req.body);
  return res.json({ message: "Done", task });
};

//****** updateTask ******
export const updateTask = async (req, res, next) => {
  const { _id } = req.authUser;
  const { taskId } = req.query;
  const task = await taskModel.findById(taskId);
  if (!task) {
    return next(new globalResponseError("Task not found", 404));
  }
  if (_id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not authorized to update this task", 401)
    );
  }
  const assignTo = await userModel.findById(req.body.assignTo);
  if (!assignTo) {
    return next(
      new globalResponseError(
        "This user You want to assign this task not exist!",
        400
      )
    );
  }
  // 25-9-2023
  let date = new Date(req.body.deadLine); //24-9-2023
  let current = new Date(); //25-9-2023
  if (current > date) {
    return next(new globalResponseError("Enter valid date!", 400));
  }
  req.body.deadLine = date;
  const updatedTask = await taskModel.updateOne({ _id: taskId }, req.body);
  return res.json({ message: "Done", updatedTask, task });
};
//******* deleteTask *******
export const deleteTask = async (req, res, next) => {
  const { _id } = req.authUser;
  const { taskId } = req.query;
  const task = await taskModel.findById(taskId);
  if (!task) {
    return next(new globalResponseError("Task not found", 404));
  }
  if (_id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not allowed to delete This task", 401)
    );
  }
  await taskModel.deleteOne({ _id: task._id });
  return res.json({ message: "Done" });
};
//******* get all tasks with user data ******
export const getTasks_with_UserData = async (req, res, next) => {
  const { _id } = req.authUser;
  if (_id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not allowed to get This tasks", 401)
    );
  }
  const tasks = await taskModel.find().populate([
    {
      path: "userId",
      select: "userName email Phone",
    },
    {
      path: "assignTo",
      select: "userName email Phone",
    },
  ]);
  return res.json({ message: "Done", tasks });
};
//****** get tasks of oneUser with user data (user must be logged in) ******
export const myCreatedTasks = async (req, res, next) => {
  const { id } = req.authUser;
  if (id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not allowed to get This tasks", 401)
    );
  }
  const tasks = await taskModel.find({ userId: id }).populate([
    {
      path: "userId",
      select: "userName email Phone",
    },
    {
      path: "assignTo",
      select: "userName email Phone",
    },
  ]);
  return res.json({ message: "Done", tasks });
};
//******* Tasks Assign To Me ******
export const myTasksAssignToMe = async (req, res, next) => {
  const { id } = req.authUser;
  if (id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not allowed to get This tasks", 401)
    );
  }
  const tasks = await taskModel.find({ assignTo: id }).populate([
    {
      path: "userId",
      select: "userName email Phone",
    },
    {
      path: "assignTo",
      select: "userName email Phone",
    },
  ]);
  return res.json({ message: "Done", tasks });
};
//********* get Tasks Assign To Specific User *******
export const getTasksAssignToAnyUser = async (req, res, next) => {
  const { _id } = req.authUser;
  const { UserId } = req.query;
  if (_id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not allowed to get This tasks", 401)
    );
  }
  const user = await userModel.findById(UserId);
  if (!user) return next(new globalResponseError("invalid User id!", 400));

  const tasks = await taskModel.find({ assignTo: UserId }).populate([
    {
      path: "userId",
      select: "userName email Phone",
    },
    {
      path: "assignTo",
      select: "userName email Phone",
    },
  ]);
  return res.json({ message: "Done", tasks });
};
//******** get all tasks that not done after deadline *******
export const allLateTasks = async (req, res, next) => {
  const { id } = req.authUser;
  if (id.toString() != req.authUser.id) {
    return next(
      new globalResponseError("You are not allowed to get This tasks", 401)
    );
  }
  let currentDate = new Date();

  const tasks = await taskModel
    .find({ assignTo: id, deadLine: { $lt: currentDate } })
    .populate([
      {
        path: "userId",
        select: "userName email Phone",
      },
      {
        path: "assignTo",
        select: "userName email Phone",
      },
    ]);
  return res.json({ message: "Done", tasks });
};
