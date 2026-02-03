import usersModel from "../models/usersModel.js";
import mongoose from "mongoose";

// GET /users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await usersModel
      .findById(id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDataProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address } = req.body;

    const user = await usersModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.fullName = fullName ?? user.fullName;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;

    await user.save(); // ✅ OK vì username/email/password đã tồn tại

    res.json({
      message: "Cập nhật profile thành công",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const putProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address } = req.body;

    // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await usersModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ update các field cho phép
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // ✅ update avatar nếu có upload
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // ✅ ẩn password khi trả về
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Cập nhật profile thành công",
      user: userResponse
    });

  } catch (error) {
    console.error("Put profile error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};