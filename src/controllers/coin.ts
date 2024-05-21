import { TryCatch } from "../middlewares/error.js";
import { QrCode } from "../models/qr_code.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";

export const createCoin = TryCatch(async (req, res, next) => {
  const { coin } = req.query;
  if (!coin) return next(new ErrorHandler("Coin is required", 400));

  const user = await User.findById({ _id: req.params.id });

  if (!user) {
    return next(new ErrorHandler("User id is not valid!", 404));
  }

  user.coin += Number(coin);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Coin updated successfully",
  });
});

// checking and updating qr codes

export const addQrCode = TryCatch(async (req, res, next) => {
  const { qrCode } = req.query;
  if (!qrCode) return next(new ErrorHandler("QRCode is required", 400));

  let existCode = await QrCode.findOne({ code: qrCode });
  if (existCode) {
    return next(new ErrorHandler("QrCode Already Exists", 200));
  }

  const user = await User.findById({ _id: req.params.id });

  if (!user) {
    return next(new ErrorHandler("User id is not valid!", 404));
  }

  console.log("debug check");

  var code = await QrCode.create({ code: qrCode });

  return res.status(201).json({
    success: true,
    message: "Qr-Code added successfully",
    data: code,
  });
});

export const checkQrCode = TryCatch(async (req, res, next) => {
  const { qrCode } = req.query;
  if (!qrCode) return next(new ErrorHandler("QRCode is required", 400));

  let code = await QrCode.findOne({ code: qrCode });
  if (!code) {
    return next(new ErrorHandler("QrCode Not Found!", 200));
  }

  const user = await User.findById({ _id: req.params.id });

  if (!user) {
    return next(new ErrorHandler("User id is not valid!", 404));
  }
  
  if (code.status === true) {
    return next(new ErrorHandler("QR-CODE Already Scanned!", 200));
  }

  // updating user coin and qr code status
  user.coin += 100;
  code.status = true;


  await Promise.all([user.save(), code.save()]);

  return res.status(200).json({
    success: true,
    message: "Qr-Code Scanned successfully",
    data: code,
  });
});
