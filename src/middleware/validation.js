// req => userdata
// schema => endPoint schema

import joi from "joi";
import { Types } from "mongoose";
const reqMethods = ["body", "query", "params", "headers", "file", "files"];

const validationObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid objectId");
  // if (Types.ObjectId.isValid(value)) {
  //   return true
  // }
  // return helper.message('invalid objectId')
};
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required()
    .messages({
      "string.base":
        "the valid email extantion are [com, net, org]",
    }),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
    })
    .required(),
  _id: joi.string().custom(validationObjectId),
};

export const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    // req
    let validationErrorArr = [];
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        }); // error
        console.log(validationResult.error);
        if (validationResult.error) {
          console.log(validationResult.error);
          // validationErrorArr = [...validationResult.error.details]
          validationErrorArr.push(validationResult.error.details);
        }
      }
    }

    if (validationErrorArr.length) {
      req.validationErrors = validationErrorArr;
      return next(new Error("Validation Error!", { cause: 400 }));
    }
    next();
  };
};
