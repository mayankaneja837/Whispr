import {z} from "zod"

export const usernameValidation = z
       .string()
       .min(6,"Username should be atleast 6 characters long")
       .max(20,"Username at max can be 20 characters long")

export const signupSchema = z.object({
    username:usernameValidation,
    email:z.email(),
    password:z.string().min(6,{
        message:"Password must be atleast 6 characters"
    })
})