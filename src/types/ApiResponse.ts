import {Message} from "@/models/User"

export interface ApiResponse{
    succes: Boolean,
    message: string,
    statuscode?: number,
    isAcceptingMessage?:Boolean,
    messages?:[Message]
}