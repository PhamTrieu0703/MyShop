import usersModel from "../models/usersModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";


export const registerUser = async (req, res) => {
  const { username,email,address,phone ,password, role } = req.body;
  try {
    const existingUser = await usersModel.findOne({ username
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = new usersModel({ username, password,email, role,phone,address });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getUsers = async (req, res) => {
  try {
    const users = await usersModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUsers = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await usersModel.findByIdAndDelete(_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Delete user successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const user = await usersModel.findByIdAndUpdate(
      _id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const DoLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await usersModel.findOne({ username, password });
    if (user) {
      res.status(200).json({ 
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
          phone:user.phone,
          address:user.address,
          fullName:user.fullName
    
  }}
);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 
 
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usersModel.findOne({email});
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
     const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "trieuwjbu2k3@gmail.com",
      pass: "cnkg qmfh euus dtmk"
    }
  });

  await transporter.sendMail({
    to: email,
    subject: "Mã đặt lại mật khẩu",
    html: `<h3>Mã OTP của bạn: <b>${otp}</b></h3>
           <p>Mã có hiệu lực 5 phút</p>`
  });

  res.json({ message: "Đã gửi mã xác nhận qua email" });
} catch (error) {
  res.status(500).json({ message: error.message });
}
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await usersModel.findOne({
    email,
    resetPasswordCode: otp,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Mã không hợp lệ hoặc đã hết hạn" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordCode = null;
  user.resetPasswordExpire = null;

  await user.save();

  res.json({ message: "Đổi mật khẩu thành công" });
};

  