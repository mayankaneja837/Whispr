import {resend} from "@/lib/resend"
import { EmailTemplate } from "../../templates/verificationEmailTemplate"
import { ApiResponse } from "@/types/ApiResponse"
import { url } from "inspector"

export async function SendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:'verification email',
            react:EmailTemplate({username,verifyCode})
        })
        return {succes:true,message:"Verification email sent successfully"}

    } catch (emailError) {
        console.error("error sending verification mail",emailError)
        return {succes:false,message:"Failed to send verification email",//statuscode:400}
        }
}
}