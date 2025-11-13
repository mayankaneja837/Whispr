import UserModel from "../../../models/User"
import dbConnect from "../../../lib/db"
import { Message } from "../../../models/User"

export async function POST(request:Request){
    await dbConnect()

    const {username,content} =await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
        }

        if(!user.isUserAcceptingMessages){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{
                status:403
            })
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
        return Response.json({
            success:false,
            message:"Error sending the messages to the user"
        },{
            status:500
        })
    }
}