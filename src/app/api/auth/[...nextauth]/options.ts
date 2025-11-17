import  CredentialsProvider  from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/db"
import UserModel from "../../../../models/User"

type Credentials = {
    identifier?:string,
    password:string
}

type AuthUser = {
    id?:string,
    isVerified?:boolean,
    isUserAcceptingMessages?:boolean,
    username?:string
}
export const authOptions:NextAuthOptions =  {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",

            credentials:{
                identifier:{label:"Email/Username",placeholder:"email/username",type:"text"},
                password:{label:"password",type:"password"}
            },

            async authorize(credentials:Credentials | undefined):Promise<AuthUser | null>{
                await dbConnect()

                if(!credentials) return null
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        console.log("User not found")
                        throw new Error('No user found with this email/username')
                    }
                    if(!user.isVerified){
                        console.log("User not verified")
                        throw new Error('Pls verify your account first before logging in')
                    }

                    const passwordValidation = await bcrypt.compare(credentials.password,user.password)

                    if(!passwordValidation){
                        throw new Error("Incorrect password")
                    }
                    else{
                        console.log("User getting returned?, maybe")
                        return user as AuthUser
                    }
                } catch (error) {
                    console.error("Error while signing in ",error)
                    return null
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}) {
            if(user){
                token._id = user.id
                token.isVerified = user.isVerified
                token.isUserAcceptingMessages = user.isUserAcceptingMessages
                token.username = user.username
            }
            return token
        },

        async session({session,token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isUserAcceptingMessages = token.isUserAcceptingMessages
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