export const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch(async (err) => {
      console.log(err);
      console.log(req.imagePath);
      if (req.imagePath) {
        //=========== Delete from cloudinary ==============
        await cloudinary.api.delete_resources_by_prefix(req.imagePath);

        await cloudinary.api.delete_folder(req.imagePath);
      }
      return next(new Error("Fail", { cause: 500 }));
    });
  };
};

//global error handler(app.use)
export const globalResponse = (err, req, res, next) => {
  if (err) {
    if (req.validationErrorArr) {
      return res
        .status(err["cause"] || 400)
        .json({ message:  req.validationErrorArr });
    }
    return res.status(err.statusCode || 500).json({ message: err.message }); //err.statusCode instead of {cause}
  }
};

// anothr way to do that ⬆

//OOP middleware to handle requests errors with different format messages
export class globalResponseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
