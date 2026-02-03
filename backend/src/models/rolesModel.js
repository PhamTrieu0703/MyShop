import mongoose from "mongoose";
const roleSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
    },
);
export default mongoose.model("roles", roleSchema);