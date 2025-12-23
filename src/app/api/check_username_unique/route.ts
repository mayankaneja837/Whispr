import {z} from 'zod'
import dbConnect from "../../../lib/db"
import UserModel from "../../../models/User"
import { usernameValidation } from "../../../schemas/signupSchema"
import {logger} from "../../../lib/logger"
import { apiError } from '../../../lib/apiError'

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
        if(!result.success){
            return apiError(422,"Username is not available to use")
        }

        const {username} = result.data

        const existingVerifiedUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedUsername){
            return apiError(409,"Username already exists")
        }
        else{
            return Response.json({
                success:true,
                message:"Username available"
            },{
                status:200
            })
        }
    } catch (error) {
        logger.error("Error checking username",error)
        return apiError(500,"Internal server error while checking the username")
    }
}