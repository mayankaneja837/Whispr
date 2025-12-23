import dbConnect from "../../../../lib/db"
import UserModel from "../../../../models/User"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import {logger} from "../../../../lib/logger"
import { apiError } from "../../../../lib/apiError";

export async function DELETE(request:NextRequest,{params}:{params:Promise<{messageId:string}>}){
    await dbConnect()
    const messageId = (await params).messageId
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return apiError(401,"User is not authenticated")
    }
    const userId = session.user._id
    try {
        const response = await UserModel.updateOne(
            {_id:(userId)},
            {$pull:{messages:{_id: (messageId)}}}
        )
        if(response.modifiedCount === 0){
            return apiError(404,"No message deleted from the database")
        }

        return NextResponse.json({
            success:true,
            message:"Message deleted from the database"
        },{
            status:200
        })
    } catch (error) {
        logger.error("Error in deleting message from the database",error)
        return apiError(500,"Internal Server error in deleting message from the database")
    }
}