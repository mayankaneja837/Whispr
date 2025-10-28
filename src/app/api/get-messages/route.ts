import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!user){
        return Response.json({
            success:false,
            message:"User is not logged in"
        },{
            status:404
        })
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const messages = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])

        console.log(messages)
        if(!messages || messages.length === 0){
            return Response.json({
                success:false,
                message:"No messages found"
            },{
                status:404
            })
        }

        return Response.json({
            success:true,
            messages: messages[0].messages
        })
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error getting the messages from the user"
        },{
            status:500
        })
    }

}