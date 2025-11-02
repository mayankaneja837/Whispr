import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
export async function DELETE(request:Request,{params}:{params:{messageId:string}}){
    await dbConnect()
    const messageId = params.messageId
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return NextResponse.json({
            message:"User is not authenticated",
        },{
            status:401
        })
    }
    const userId = session.user._id
    try {
        const response = await UserModel.updateOne(
            {_id:new mongoose.Types.ObjectId(userId)},
            {$pull:{messages:{_id: new mongoose.Types.ObjectId(messageId)}}}
        )
        if(response.modifiedCount === 0){
            return NextResponse.json({
                message:"No message deleted from the database"
            },{
                status:404
            })
        }
        return NextResponse.json({
            success:true,
            message:"Message deleted from the database"
        },{
            status:200
        })
    } catch (error) {
        return NextResponse.json({
            message:"Error in deleting message from the database"
        },{
            status:500
        })
    }
}