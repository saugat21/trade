import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        startingCapital: {
            type: Number,
            required: true,
            default: 500,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Settings ||
    mongoose.model("Settings", SettingsSchema);