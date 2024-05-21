import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import bcryptjs from "bcryptjs";
import getRandomNumber from "../utils/random.js";
import {
  cacheVariables,
  deleteLocalCache,
  existsLocalCache,
  getLocalCache,
  setLocalCache,
} from "../utils/cache.js";

export const createUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, phone, password } = req.body;
    if (!email || !password || !phone)
      return next(new ErrorHandler("Please enter all fields.", 400));
    let existUser = await User.findOne({ email: email });
    if (existUser) return next(new ErrorHandler("User already exists.", 200));
    const hashedPassword = await bcryptjs.hash(password, 8);

    let newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  }
);

export const loginUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter all fields.", 400));

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler("User with this email does not exist!", 400)
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect password", 400));
    }
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  }
);

export const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("Users does not exits.", 400));
  }
  return res.status(200).json({
    success: true,
    message: "User found in successfully",
    data: user,
  });
});

export const getAllUsers = TryCatch(async (req, res, next) => {
  const user = await User.find({ role: { $ne: "admin" } });
  if (!user) {
    return next(new ErrorHandler("Users does not exits.", 400));
  }
  return res.status(200).json({
    success: true,
    message: "User found in successfully",
    data: user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const { userId } = req.query;
  if (!userId) return next(new ErrorHandler("User id is required.", 400));

  const [admin, user] = await Promise.all([
    await User.findById(req.params.id),
    await User.findById(userId),
  ]);

  if (!admin) {
    return next(new ErrorHandler("Admin does not exits.", 404));
  }

  if (admin.role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to perform this action", 401)
    );
  }

  if (!user) {
    return next(new ErrorHandler("User does not exits.", 404));
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: user,
  });
});

export const updateUser = TryCatch(async (req, res, next) => {
  const { userId, email, phone } = req.query;
  if (!userId) return next(new ErrorHandler("User id is required.", 400));

  const [admin, user] = await Promise.all([
    await User.findById(req.params.id),
    await User.findById(userId),
  ]);

  if (!admin) {
    return next(new ErrorHandler("Admin does not exits.", 404));
  }

  if (admin.role !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to perform this action", 401)
    );
  }

  if (!user) {
    return next(new ErrorHandler("User does not exits.", 404));
  }

  // updating user
  if (email) user.email = email as string;
  if (phone) user.phone = Number(phone);

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

export const adminLogin = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter all fields.", 400));

    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new ErrorHandler("Admin with this email does not exist!", 400)
      );
    }

    if (user.role !== "admin") {
      return next(
        new ErrorHandler("You are not authorized to perform this action", 401)
      );
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect password", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      data: user,
    });
  }
);

export const getOTP = TryCatch(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    return next(new ErrorHandler("Email is required.", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Users does not exits.", 400));
  }
  // deleting older cache
  if (existsLocalCache(cacheVariables.otp)) {
    deleteLocalCache(cacheVariables.otp);
  }

  // it gives 5 to 8 digits random number
  let randomOTP: number = getRandomNumber();

  // saving otp
  setLocalCache(cacheVariables.otp, randomOTP);
  return res.status(200).json({
    success: true,
    message: "OTP Send successfully",
    data: `Your OTP is ${randomOTP}`,
  });
});

export const verifyOTP = TryCatch(async (req, res, next) => {
  const { email, password, otp } = req.query;

  if (!email || !password || !otp) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Users does not exits.", 400));
  }

  // match here
  let savedOtp = getLocalCache(cacheVariables.otp);

  if (Number(savedOtp) !== Number(otp)) {
    return next(new ErrorHandler("OTP is not correct.", 400));
  } else {
    const hashedPassword = await bcryptjs.hash(password as string, 8);
    user.password = hashedPassword!;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password Updated successfully",
    });
  }
});
