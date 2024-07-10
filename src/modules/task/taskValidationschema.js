import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import Joi from "joi";

export const addTaskValidationSchema = {
  body: Joi
    .object({
      title: Joi.string().min(6).max(50).required(),
      description: Joi.string().min(6).max(400).required(),
      deadLine: Joi
        .date()
        .greater(Date.now() - 24 * 60 * 60 * 1000)
        .required(),
      status: Joi.string(),
      assingTo: generalFields._id.required(),
    }).required(),
};

export const updateTaskValidationSchema = {
  body: Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(400).required(),
    deadLine: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).required(),
    status: Joi.string().required()
  }).required(),
};