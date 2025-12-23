import { getServerSession } from "next-auth";
import dbConnect from "../../../lib/db"
import UserModel from "../../../models/User"
import { authOptions } from "../auth/[...nextauth]/options";
import {logger} from "../../../lib/logger"
import { apiError } from "../../../lib/apiError";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) {
        return apiError(401,"User is not logged in")
    }

    const userId = user?._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isUserAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return apiError(500,"Failed to update the user")
        }

        return Response.json({
            success: true,
            message: "User updated successfully",
            updatedUser
        }, {
            status: 200
        })
    } catch (error) {
        logger.error("Error in updating the user",error)
        return apiError(500,"Internal server error while updating the user")
    }
}

export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) {
        return apiError(401,"User is not logged in")
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return apiError(404,"User not found")
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isUserAcceptingMessages
        }, {
            status: 200
        })
    } catch (error) {
        logger.error("Error in getting the user",error)
        return apiError(500,"Internal server failure while fetching the user")
    }
}