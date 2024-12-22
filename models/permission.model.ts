import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    module: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "read", "update", "delete", "manage"],
      required: true,
    },
  },
  { timestamps: true }
);

const Permission =
  mongoose.models.Permission || mongoose.model("Permission", permissionSchema);
export default Permission;
