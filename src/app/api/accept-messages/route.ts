import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) {
        return Response.json({
            success: false,
            message: "User is not logged in"
        }, {
            status: 400
        })
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
            return Response.json({
                success: false,
                message: "Not able to update the user"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "User updated successfully",
            updatedUser
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error querying the user"
        }, {
            status: 404
        })
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) {
        return Response.json({
            success: false,
            message: "User is not logged in"
        }, {
            status: 400
        })
    }

    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            console.log("No user found")
            return Response.json({
                message: "No user found"
            })
        }

        console.log("User with the given id is found")
        console.log(foundUser.isUserAcceptingMessages)
        return Response.json({
            success: true,
            isUserAcceptingMessages: foundUser.isUserAcceptingMessages
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error querying the user"
        }, {
            status: 404
        })
    }
}