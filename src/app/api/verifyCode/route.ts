import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username:decodedUsername
        })

        if(!user){
            return Response.json({
                sucess:false,
                message:"User with the entered username does not exist"
            },{
                status:404
            })
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
        }else if(!isCodeValid){
            return Response.json({
                success:false,
                message:"Code entered is not valid"
            },{
                status:400
            })
        }
        else{
            return Response.json({
                success:false,
                message:"Code expired"
            },{
                status:400
            })
        }
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error checking the code"
        },{
            status:404
        })
    }
}