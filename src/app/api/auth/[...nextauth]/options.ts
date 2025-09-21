import  CredentialsProvider  from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export const authOptions:NextAuthOptions =  {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",

            credentials:{
                email:{label:"username",type:'text',placeholder:'abc@123'},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier.email},
                            {username:credentials.identifier.username}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email/username')
                    }
                    if(!user.isVerified){
                        throw new Error('Pls verify your account first before logging in')
                    }

                    const passwordValidation = await bcrypt.compare(credentials.password,user.password)

                    if(!passwordValidation){
                        throw new Error("Incorrect password")
                    }
                    else{
                        return user
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}) {
            if(user){
                token._id = user._id,
                token.isVerified = user.isVerified,
                token.isUserAcceptingMessages = user.isUserAcceptingMessages,
                token.username = user.username
            }
            return token
        },

        async session({session,token}){
            if(token){
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isUserAcceptingMessages = token.isUserAcceptingMessages,
                session.user.username = token.username
            }
            return session
        }
    },

    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}