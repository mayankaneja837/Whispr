import dbConnect from '../../../lib/db'
import UserModel from "../../../models/User"
import { logger } from "../../../lib/logger";
import { apiError } from '../../../lib/apiError';

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username:decodedUsername
        })

        if(!user){
            return apiError(404,"User with the entered username does not exist")
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json({
                success:true,
                message:"Account verified successfully"
            },{
                status:200
            })
        }
        else if(!isCodeValid){
            return apiError(400,"Code entered is not valid")
        }
        else{
            return apiError(400,"Code expired")
        }
    } catch (error) {
        logger.error("Error checking the code",error)
        return apiError(500,"Internal Server error in checking the code")
    }
}