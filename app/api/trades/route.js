import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Trade from "@/models/Trade";

// GET all trades
export async function GET() {
    try {
        await connectDB();
        const trades = await Trade.find().sort({ date: -1 });

        return NextResponse.json(trades, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch trades" },
            { status: 500 }
        );
    }
}

// CREATE a trade
export async function POST(request) {
    try {
        const body = await request.json();
        await connectDB();

        const trade = await Trade.create(body);

        return NextResponse.json(trade, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create trade" },
            { status: 500 }
        );
    }
}