import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Trade from "@/models/Trade";

export async function GET(req, context) {
    await connectDB();

    const { id } = await context.params; 

    const trade = await Trade.findById(id);

    return NextResponse.json(trade);
}
export async function PUT(req, context) {
    await connectDB();

    const { id } = await context.params; 
    const body = await req.json();

    const updated = await Trade.findByIdAndUpdate(
        id,
        body,
        { new: true }
    );

    return NextResponse.json(updated);
}
export async function DELETE(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        await Trade.findByIdAndDelete(id);

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete" },
            { status: 500 }
        );
    }
}