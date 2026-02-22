import { getResend } from "../lib/resend"
import { EmailTemplate } from "../../templates/verificationEmailTemplate"
import { ApiResponse } from "../types/ApiResponse"
import {logger} from "../lib/logger"

export async function SendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
    try {
        const resend = getResend()
        await resend.emails.send({
            from: "Whispr <noreply@mayankaneja.dev>",
            to: email,
            subject: 'verification email',
            react: EmailTemplate({ username, verifyCode }),
        })

        return { success: true, message: "Verification email sent successfully" }

    } catch (emailError) {
        logger.error("error sending verification mail", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}