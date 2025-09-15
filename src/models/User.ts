import mongoose, {Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt: Date
}

export interface User extends Document{
    username:string,
    password:string,
    email:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean
    isUserAcceptingMessages:boolean,
    messages:Message[]
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,'please use a valid email address']
    },
    password:{
        type:String,
        required:true
    },
    verifyCode:{
        type:String,
        required:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isUserAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel