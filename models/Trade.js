import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },

        asset: {
            type: String,
            required: true,
            enum: ["BTC", "GOLD", "SILVER", "FOREX", "OTHER"],
        },

        position: {
            type: String,
            required: true,
            enum: ["BUY", "SELL"],
        },

        strategy: {
            type: String,
            required: true,
            enum: ["EMA", "CRT", "SESSION_SWEEP", "OTHER"],
        },

        session: {
            type: String,
            required: true,
            enum: ["ASIAN", "LONDON", "NEW_YORK"],
        },

        risk: {
            type: Number, 
            required: true,
        },

        reward: {
            type: Number, 
            required: true,
        },

        result: {
            type: String,
            required: true,
            enum: ["WIN", "LOSS", "BREAKEVEN", "PARTIAL_CLOSE"],
        },
        lessonLearned: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Trade ||
    mongoose.model("Trade", TradeSchema);
