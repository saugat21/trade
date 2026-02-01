import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Settings from "@/models/Settings";

export async function GET() {
    await connectDB();

    let settings = await Settings.findOne();

    // If settings not created yet, create default
    if (!settings) {
        settings = await Settings.create({ startingCapital: 500 });
    }

    return NextResponse.json(settings);
}

export async function PUT(req) {
    await connectDB();
    const body = await req.json();

    let settings = await Settings.findOne();

    if (!settings) {
        settings = await Settings.create(body);
    } else {
        settings.startingCapital = body.startingCapital;
        await settings.save();
    }

    return NextResponse.json(settings);
}
