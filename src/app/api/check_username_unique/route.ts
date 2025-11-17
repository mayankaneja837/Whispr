import {z} from 'zod'
import dbConnect from "../../../lib/db"
import UserModel from "../../../models/User"
import { usernameValidation } from "../../../schemas/signupSchema"

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            return Response.json({
                success:false,
                message:"Username is not available to use"
            },{
                status:404
            })
        }

        const {username} = result.data

        const existingVerifiedUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUsername){
            return Response.json({
                success:false,
                message:"USername already exists"
            },{
                status:400
            })
        }
        else{
            return Response.json({
                success:true,
                message:"Username available"
            },{
                status:201
            })
        }
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{
            status:500
        })
    }
}