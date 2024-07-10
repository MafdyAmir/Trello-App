import userRouter from "./modules/user/user.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import { Connection } from "./DB/connection.js";
import { globalResponse, globalResponseError } from "./utils/errorHandling.js";
export const bootestrap = (app, express) => {
  app.use(express.json());
  app.use("/user", userRouter);
  app.use("/task", taskRouter);
  app.use("*", (req, res, next) => {
    return next(new globalResponseError("in-valid routing!", 404));
  });
  app.use(globalResponse);
};
Connection();
