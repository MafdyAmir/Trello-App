import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      requier: true,
    },
    email: {
      type: String,
      requier: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Manager", "HR"],
      default: "User",
    },
    password: {
      type: String,
      requier: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "not specified"],
      default: "not specified",
    },
    age: {
      type: Number,
      requier: true,
    },
    phone: {
      type: String,
      requier: true,
      unique: true,
    },
    isDeleted: {
      //soft Delete
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    profile_pic: {
      secure_url: String,
      public_id: String,
    },
    coverPictures: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
