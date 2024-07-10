import userModel from "../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/tokenFunctions.js";
import { sendEmailService } from "../../services/sendEmailService.js";
import cloudinary from "../../utils/coludinaryConfigrations.js";
import { generateQrCode } from "../../utils/qrCodeFunction.js";

//****** signUp *******
export const signUp = async (req, res, next) => {
  // const { test } = req.query;
  const {
    userName,
    email,
    role,
    password,
    confirmPassword,
    gender,
    age,
    phone,
  } = req.body;
  const isUserExists = await userModel.findOne({ $or: [{ email }, { phone }] });
  if (isUserExists?.email == email) {
    return res.status(400).json({ message: "email already exist!" });
  } else if (isUserExists?.phone == phone) {
    return res.status(400).json({ message: "phoen already exist!" });
  }
  if (password != confirmPassword) {
    return res
      .status(400)
      .json({ message: "password not match confirm Password!" });
  }

  // confirmEmail
  const token = generateToken({
    payload: {
      email,
    },
    signature: process.env.CONFIRMATION_EMAIL_TOKEN,
    expiresIn: "1h",
  });

  if (!token) {
    return next(
      new Error("token generation fail, payload canot be empty", {
        cause: 400,
      })
    );
  }

  const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`;

  const message = `<a href=${confirmLink}> Click to confirm your email </a>`;

  const isEmailSent = await sendEmailService({
    message,
    to: email,
    subject: "Confiramtion Email",
  });
  if (!isEmailSent) {
    return res
      .status(500)
      .json({ message: "Please try again later or contact the support team" });
  }

  //hashing Password
  const hashingPassword = bcrypt.hashSync(password, +process.env.saltRounds);
  // cearte user and send confirm Email
  const user = new userModel({
    userName,
    email,
    role,
    password: hashingPassword,
    gender,
    age,
    phone,
  });
  await user.save();
  res.status(201).json({ message: "Done", user /*test*/ });
};
//================================== Confirm email =====================
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decodedData = jwt.verify(token, process.env.CONFIRMATION_EMAIL_TOKEN);

  const isConfirmedCheck = await userModel.findOne({
    email: decodedData.email,
  });
  if (isConfirmedCheck.isConfirmed) {
    return res.status(400).json({ message: "Your email is already confirmed" });
  }
  const user = await userModel.findOneAndUpdate(
    { email: decodedData.email },
    { isConfirmed: true },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Confirmed Done please try to login", user });
};
//******* signIn *******
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(400).json({ massage: "in-valid email or password!" });
  //compar hash password
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "in-valid email or password!" });
  }
  //generate token
  const userToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.singature
  );
  await userModel.findOneAndUpdate(
    { email: user.email },
    { $set: { isDeleted: false, isOnline: true } },
    { new: true }
  );

  return res
    .status(200)
    .json({ massage: "Logged in successfully", token: userToken });
};
//****** update Profile *********
export const updateProfile = async (req, res, next) => {
  const { _id } = req.authUser;
  const { userName, email, gender, age, phone } = req.body;

  const user = await userModel.findById(_id);
  if (!user) {
    return res.status(400).json({ message: "invalid userid!" });
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id: _id },
    { userName, email, gender, age, phone },
    { new: true }
  );
  res.status(200).json({ message: "Done", updatedUser });
};
//============================== get user profile =======================
export const getUser = async (req, res, next) => {
  const { _id } = req.authUser;
  const { userId } = req.query;
  const user = await userModel.findById(userId, 'username');
  if (!user) {
    return next(new Error("in-valid userId", { cause: 400 }));
  }
  const qrcode = await generateQrCode({ data: user });
  res.status(200).json({ message: "Done", user, qrcode });
};
//****** delete Profile *****
export const deleteProfile = async (req, res, next) => {
  const { _id } = req.authUser;
  const { email } = req.body;

  const user = await userModel.findById(_id);
  if (!user) {
    return res.status(400).json({ message: "invalid userid!" });
  }

  const User = await userModel.findByIdAndDelete(
    { _id: _id },
    { email },
    { new: true }
  );
  res.status(200).json({ message: "Done" });
};
//***** changePassword *******
export const changePassword = async (req, res, next) => {
  const { _id } = req.authUser;
  const { password, newPassword, confirm_New_Password } = req.body;
  if (newPassword != confirm_New_Password) {
    return res
      .status(404)
      .json({ message: "new Password mis match confirm New Password!" });
  }

  const matchPassword = bcrypt.compareSync(password, req.authUser.password);
  console.log(matchPassword);
  if (!matchPassword) {
    return res.status(400).json({ message: "password not matched!" });
  }

  const hashingPassword = bcrypt.hashSync(newPassword, +process.env.saltRounds);

  const newuser = await userModel.findOneAndUpdate(
    { _id: _id },
    { password: hashingPassword },
    { new: true }
  );
  return res.status(200).json({ message: "Done", newuser });
};
//**** forget password ********
export const forgetPassword = async (req, res, next) => {
  const { newPassword, confirm_New_Password } = req.body;
  if (newPassword != confirm_New_Password) {
    return res
      .status(404)
      .json({ message: "new Password mis match confirm New Password!" });
  }

  const hashingPassword = bcrypt.hashSync(newPassword, +process.env.saltRounds);

  const newuser = await userModel.findOneAndUpdate(
    { password: hashingPassword },
    { new: true }
  );
  return res.status(200).json({ message: "Done" });
};
//=======  profile Picture =======
export const profilePicture = async (req, res, next) => {
  const { _id } = req.authUser;
  console.log(req.file);
  if (!req.file) {
    return next(new Error("please upload profile picture", { cause: 400 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Users/Profiles/${_id}`,
      public_id: `${_id}`,
      use_filename: true,
      unique_filename: false,
      resource_type: "image",
    }
  );

  const user = await userModel.findByIdAndUpdate(
    _id,
    {
      profile_pic: { secure_url, public_id },
    },
    {
      new: true,
    }
  );

  if (!user) {
    await cloudinary.uploader.destroy(public_id);
    // await cloudinary.api.delete_resources([publibIds])  // delete bulk of publicIds
    return next(new Error("please try again later", { cause: 400 }));
  }
  res.status(200).json({ message: "Done", user });
};

//======= cover pictures ==========
export const coverPictures = async (req, res, next) => {
  const { _id } = req.authUser;
  if (!req.files) {
    return next(new Error("please upload pictures", { cause: 400 }));
  }

  const coverImages = [];
  for (const file in req.files) {
    for (const key of req.files[file]) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        key.path,
        {
          folder: `Users/Covers/${_id}`,
          resource_type: "image",
        }
      );
      coverImages.push({ secure_url, public_id });
    }
  }
  const user = await userModel.findById(_id);

  user.coverPictures.length
    ? coverImages.push(...user.coverPictures)
    : coverImages;

  const userNew = await userModel.findByIdAndUpdate(
    _id,
    {
      coverPictures: coverImages,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Done", userNew });
};

//**** soft Delete ****
export const softDelete = async (req, res, next) => {
  const { _id } = req.authUser;

  await userModel.findOneAndUpdate(
    { _id: _id },
    { isDeleted: true, isOnline: false },
    { new: true }
  );

  return res
    .status(200)
    .json({ massage: "The account has been temporarily deleted" });
};
//***** logOut ******
export const logOut = async (req, res, next) => {
  const { _id } = req.authUser;
  await userModel.findOneAndUpdate(
    { _id: _id },
    { isOnline: false },
    { new: true }
  );
  return res.status(200).json({ massage: "Done" });
};
//****** get all Users Profile *********
export const getUsers = async (req, res, next) => {
  const users = await userModel.find();
  return res.json({ message: "Done", users });
};
