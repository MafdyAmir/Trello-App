import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signUpValidation = {
  body: joi.object({
    userName: joi.string().min(4).max(30).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: joi.string().required().messages({
      "string.empty": "please enter confirm new password",
    }),
    gender: joi.string().optional(),
    phone: joi.string().min(11).max(11).required(),
    age: joi.number().optional(),
  }).required(),
};

export const signInValidation = {
  body: joi
    .object({
      email: joi
        .string()
        .required()
        .messages({ "string.empty": "please enter email" }),
      password: joi
        .string()
        .required()
        .messages({ "string.empty": "please enter password" }),
    })
    .required(),
};

export const updateUserValidation = {
  body: joi.object({
    userName: joi.string().min(4).max(30),
    email: joi.string(),
    phone: joi.string().min(11).max(11),
    gender: joi.string(),
    age: joi.number().optional(),
  }),
};
export const changePasswordValidation = {
  body: joi
    .object({
      password: joi.string().required().messages({
        "string.empty": "please enter password",
      }),
      newPassword: generalFields.password.required().messages({
        "string.empty": "please endter new password",
      }),
      confirm_New_Password: joi.string().required().messages({
        "string.empty": "please enter confirm new password",
      }),
    })
    .required(),
};
