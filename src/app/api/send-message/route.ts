import UserModel from "../../../models/User"
import dbConnect from "../../../lib/db"
import { Message } from "../../../models/User"
import {logger} from "../../../lib/logger"
import { apiError } from "../../../lib/apiError"

export async function POST(request:Request){
    await dbConnect()

    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return apiError(404,"User not found")
        }

        if(!user.isUserAcceptingMessages){
            return apiError(403,"User is not accepting messages")
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success:true,
            message:"Message sent to the user"
        },{
            status:200
        })
    } catch (error) {
        logger.error("Error sending the messages to the user",error)
        return apiError(500,"Internal Server error in sending message to the user")
    }
}