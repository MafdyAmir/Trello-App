import { Router } from "express";

const router = Router();

import * as userConteoller from "./user.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { isAuth } from "../../middleware/auth.js";
import { multerFunction } from "../../services/multerLocally.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { validationCoreFunction } from "../../middleware/validation.js";
import * as validators from "./userValidationschema.js";

router.post(
  "/signUp",
  validationCoreFunction(validators.signUpValidation),
  asyncHandler(userConteoller.signUp)
);

router.post(
  "/signIn",
  validationCoreFunction(validators.signInValidation),
  asyncHandler(userConteoller.signIn)
);

router.put(
  "/updateProfile",
  isAuth(),
  validationCoreFunction(validators.updateUserValidation),
  asyncHandler(userConteoller.updateProfile)
);

router.delete(
  "/deleteProfile",
  isAuth(),
  asyncHandler(userConteoller.deleteProfile)
);

router.patch(
  "/changePassword",
  isAuth(),
  validationCoreFunction(validators.changePasswordValidation),
  asyncHandler(userConteoller.changePassword)
);

router.patch("/forgetPassword", asyncHandler(userConteoller.forgetPassword));

router.patch("/softDelete", isAuth(), asyncHandler(userConteoller.softDelete));

router.patch(
  "/profilePicture",
  isAuth(),
  multerFunction(allowedExtensions.Image, "/uploads/User/Profile").single(
    "profile"
  ),
  asyncHandler(userConteoller.profilePicture)
);

router.patch(
  "/coverPictures",
  isAuth(),
  multerFunction(allowedExtensions.Image, "/uploads/User/Covers").fields([
    { name: "cover", maxCount: 1 },
    { name: "image", maxCount: 2 },
  ]),
  asyncHandler(userConteoller.coverPictures)
);

router.patch("/logOut", isAuth(), userConteoller.logOut);
router.get("/getUserProfile", isAuth(), asyncHandler(userConteoller.getUser));

router.get("/getUsers", isAuth(), asyncHandler(userConteoller.getUsers));

export default router;
