import jwt from "jsonwebtoken";
import userModel from "../DB/models/user.model.js";
import taskModel from "../DB/models/task.model.js";

export const isAuth = (access = ["Admin", "User", "Manager", "HR"]) => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return res.status(400).json({ message: "Please logIn first" });
    }
    if (!token.startsWith("Trello__")) {
      return res.status(400).json({ message: "invalid token prefix!" });
    }

    const splitedToken = token.split("Trello__")[1];
    const decodedData = jwt.verify(splitedToken, process.env.singature);
    if (!decodedData?.id) {
      return res.status(400).json({ message: "invalid token!" });
    }
    const findUser = await userModel.findById(decodedData.id);
    if (!findUser) {
      return res.status(400).json({ message: "invalid user!" });
    }
    if (findUser.isDeleted == true) {
      return res
        .status(400)
        .json({ message: "User temporarily deleted please login again!" });
    }
    if (findUser.isOnline == false) {
      return res.status(400).json({ message: "Please SignIn" });
    }
    if (!access.includes(findUser.role)) {
      console.log(findUser);
      return res.status(401).json({ message: "you are Not authorized!" });
    }
    // console.log(decodedData);
    // retrun findUser
    req.authUser = findUser;
    next();
    // console.log(findUser);
  };
};
