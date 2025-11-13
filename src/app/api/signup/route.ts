import dbConnect from "../../../lib/db"
import UserModel from "../../../models/User"
import bcrypt from "bcryptjs";
import { SendVerificationEmail } from "../../../helpers/sendVerificationMail"

export async function POST(request:Request){
    await dbConnect()

    try {
        const {email,password,username} = await request.json()
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:404})
        }

        if(!existingVerifiedUser){
            console.log("No existing verified user existis, Proceeding with the function call")
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User is already verified"
                },{
                    status:404
                })
            }
            else{
                existingUserByEmail.username = username
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+360000)
                await existingUserByEmail.save()

                console.log("Existing user updated")
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                password:hashedPassword,
                email,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isUserAcceptingMessages:true,
                messages: []
            })
            await newUser.save()
            console.log("New user saved")
        }

        const emailResponse = await SendVerificationEmail(email,username,verifyCode)


        if(emailResponse){
            console.log("Email Response exists")
            console.log(emailResponse)
        }

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"trouble sending verification email to the user"
            },{
                status:500
            })
        }

        return Response.json({
            success:true,
            message:"Verification email sent"
        },{
            status:200
        })
    } catch (error) {
        console.error("Error registering user",error)
        return Response.json({
            success:false,
            message:"Error registering user"
        },{
            status:500
        })
    }
}