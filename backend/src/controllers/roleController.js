import rolesModel from "../models/rolesModel.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await rolesModel.find();
    res.status(200).json(roles);
    } catch (error) {   
    res.status(500).json({ message: error.message });
    }
};
